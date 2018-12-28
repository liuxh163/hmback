import db from '../db/db'
import rand from 'randexp'
import dateFormat from 'date-fns/format'
import dateAddMinutes from 'date-fns/add_minutes'
import dateAddMonths from 'date-fns/add_months'
import dateCompareAsc from 'date-fns/compare_asc'


if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = process.env.SMS_ACCESSKEYID
const secretAccessKey = process.env.SMS_SECRETACCESSKEY

const UUID = require('uuid');

class UserController {
    constructor() {}
    //用户注册操作
    async signup(ctx) {
        const request = ctx.request.body
        //检查新注册用户手机号是否重复
        // var [result] = await db('t_hm101_users')
        //     .where({
        //         telephone: request.telephone,
        //     }).count('id as id');
        // if (result.id) {
        //     ctx.throw(400, 'DUPLICATE_TELEPHONE_NUMBER')
        // };

        if(await this.checkSmsCode(ctx)){
            //获取用户ip地址 TODO: 使用反向代理时无法获取IP地址
            request.ipAddress = ctx.request.ip
            //生成新用户登录账户
            request.loginId = new rand(/[a-Z][1-9]{9}/).gen();
            //注册新用户成功，写入数据库
            try {
                var [result] = await db('t_hm101_users')
                    .insert(request)
                    .returning('telephone');
                //设置返回值
                ctx.body = { telephone: result }
            } catch (error) {
                ctx.throw(400, 'INVALID_DATA_IN_INSERT')
            }
        }else{
            ctx.body = { message: 'sms code verify error'}
        }
    };//end of sign up

    //用户登录操作
    async login(ctx) {
        const request = ctx.request.body;

        var [userData] = [];
        // 通过手机号登录
        if (request.telephone) {
            //TODO: 手机短信验证
            if(await this.checkSmsCode(ctx)){
                //通过手机号获取用户信息
                [userData] = await db('t_hm101_users')
                    .where({
                        telephone: request.telephone,
                    })
                    .select('telephone','loginId','type');
            };
            console.log(userData.loginId)
        }else{
            ctx.throw(404, 'INVALID_LOGIN_DATA');
        };
        //没有所请求的用户
        if (!userData) {
            ctx.throw(401, 'INVALID_CREDENTIALS')
        }

        //基于时间戳生成用户token
        const token = UUID.v1();
        ctx.redisdb.set(token, JSON.stringify(userData), 'EX', process.env.TOKEN_EXPIRATION_TIME);

        ctx.body = {
            accessToken: token,
            telephone: userData.telephone,
            loginid: userData.loginId
        }
    }

    // 禁用用户
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_users')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        // 用户登录状态改成无效
        if(ctx.header.hmtoken){
            ctx.redisdb.del(ctx.header.hmtoken)
        }
        ctx.body = {id: query.id};
    }

    // 启用用户
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_users')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }

    //用户登出操作
    async logout(ctx) {
        if(ctx.header.hmtoken){
            var telephone;
            await ctx.redisdb.get(ctx.header.hmtoken).then(function (result) {
                if(result){
                    telephone = JSON.parse(result).telephone
                }
            })
            ctx.redisdb.del(ctx.header.hmtoken)
            ctx.body = {telephone: telephone}
        }else{
            ctx.throw(401, 'LOGOUT_ERROR_USER');
        }
    }
    // 检查手机验证码
    async checkSmsCode(ctx){
        const request = ctx.request.body;
        //验证手机短信
        let passed = false;
        // 根据请求中的手机号从redis缓存中获取有效短信验证码
        await ctx.redisdb.get(request.telephone).then(function (result) {
            if(result){
                let redisSmsCode = JSON.parse(result).smscode
                // 验证短信码
                if(redisSmsCode && redisSmsCode == request.smscode){
                    passed = true
                }
            }
        })
        return passed
    }

    //发送短信验证码
    async sendSms(ctx) {
        const request = ctx.request.body
        //检查新注册用户手机号是否重复
        var [result] = await db('t_hm101_users')
            .where({
                telephone: request.telephone,
            }).count('id as id');
        if (!result.id) {
            ctx.throw(400, 'INVALID_TELEPHONE_NUMBER')
        };
        let verify = new rand(/[1-9]{6}/).gen();

        //初始化sms_client
        // let smsClient = new SMSClient({accessKeyId,secretAccessKey});

        let sms = '{"smscode":\"'+verify+'\"}'

        ctx.redisdb.set(request.telephone,sms,'EX',process.env.SMS_EXPIRATION_TIME)

        ctx.body = result

        //发送短信
        // smsClient.sendSMS({
        //     PhoneNumbers: request.telephone,
        //     SignName: '海马医疗',
        //     TemplateCode: 'SMS_153880263',
        //     TemplateParam: '{"code":\'verify\'}'
        // }).then(function (res) {
        //     let {Code}=res
        //     if (Code === 'OK') {
        //         ctx.redisdb.set(request.telephone,verify,'EX',process.env.SMS_EXPIRATION_TIME)
        //         //处理返回参数
        //         console.log(res)
        //     }
        // }, function (err) {
        //     console.log(err)
        // })
    }
}

export default UserController

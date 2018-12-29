import db from '../db/db'
import rand from 'randexp'
import dateFormat from 'date-fns/format'

import { User } from '../models/User'

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = process.env.ALI_ACCESSKEYID
const secretAccessKey = process.env.ALI_SECRETACCESSKEY

const UUID = require('uuid');

class UserController {
    constructor() {}
    //用户注册操作
    async signup(ctx) {
        const request = ctx.request.body
        //检查新注册用户手机号是否重复
        var [result] = await db('t_hm101_users')
            .where({
                telephone: request.telephone,
            }).count('id as id');
        if (result.id) {
            ctx.throw(400, 'DUPLICATE_TELEPHONE_NUMBER')
        };

        if(await this.checkSmsCode(ctx)){
            //生成新用户登录账户
            request.loginId = new rand(/[a-zA-Z0-9]{9}/).gen();
            request.ipAddress = ctx.request.ip
            request.type = '01';
            delete request.smscode
            console.log(Object.keys(request))
            var user = new User(request)
            try {
                let result = await user.store()
                ctx.body = { id: result[0] }
            } catch (error) {
                console.log(error)
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
                    .select('*');
            };
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
        //获取当前用户
        var curUser = ctx.state.user
        try {
            await db('t_hm101_users')
                .update({status:'02'})
                .where({ id: curUser.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        // 用户登录状态改成无效
        if(ctx.header.hmtoken){
            ctx.redisdb.del(ctx.header.hmtoken)
        }
        ctx.body = {id: curUser.id};
    }

    // 启用用户
    async awaken(ctx) {
        const query = ctx.query

        //获取当前用户
        var curUser = ctx.state.user

        try {
            await db('t_hm101_users')
                .update({status:'01'})
                .where({ id: curUser.id, status: '02' })

        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: curUser.id};
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
        console.log("now in send sms ing...")
        const request = ctx.request.body
        //检查新注册用户手机号是否重复
        var [result] = await db('t_hm101_users')
            .where({
                telephone: request.telephone,
            }).count('id as id');
        if (result.id) {
            ctx.throw(400, 'INVALID_TELEPHONE_NUMBER')
        };
        let verify = new rand(/[1-9]{6}/).gen();

        //初始化sms_client
        // let smsClient = new SMSClient({accessKeyId,secretAccessKey});

        let sms = {smscode:verify}

        ctx.redisdb.set(request.telephone,JSON.stringify(sms),'EX',process.env.SMS_EXPIRATION_TIME)

        ctx.body = sms

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

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a servant
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        const user = new User()
        await user.find(params.id)
        if (!user) ctx.throw(400, 'INVALID_DATA')

        //检查当前用户是否管理员
        const curUser = ctx.state.user
        console.log("user type is "+curUser.type)
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')

        //Add the updated date value
        user.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        user.operateFlag = 'U'
        user.operator = curUser.id

        //Replace the user data with the new updated user data
        Object.keys(request).forEach(function(parameter, index) {
            user[parameter] = request[parameter]
            console.log('parameter is'+parameter)
        })

        try {
            await user.save()
            ctx.body = { id: user.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async index(ctx) {
        const query = ctx.query

        //Init a new user object
        const user = new User()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.page || !query.number) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of users
        try {
            let result = await user.all(query)
            ctx.body = {users:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
}

export default UserController

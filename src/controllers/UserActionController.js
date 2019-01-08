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

    //用户登录/注册操作
    async login(ctx) {
        const request = ctx.request.body;
        // 检查请求参数是否有手机号
        if (!request.telephone)
            ctx.throw(401, 'INVALID_REQUEST_PARAMS')
        // 检查短信验证码是否正确
        if(!await this.checkSmsCode(ctx))
            ctx.throw(401, 'WRONG_SMS_CODE')
        var user = new User()
        await user.findPhone(request.telephone)
        if (!user.telephone){
            console.log("create new user by "+request.telephone)
            // 用户不存在则创建新用户
            request.loginId = new rand(/[0-9]{9}/).gen();
            request.ipAddress = ctx.request.ip
            request.type = '01';
            delete request.smscode
            
            user = new User(request);
            user.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
            user.operator = '1';
            try {
                let userid = await user.store();
                user.id = userid[0];
                console.log("hahahahah"+userid[0]);
            } catch (error) {
                ctx.throw(400, 'INVALID_DATA_IN_INSERT')
            }
        }
        // 如果已有用户则根据手机号判断用户是否已经登录
        var logined;
        try {
            await ctx.redisdb.get('login-'+request.telephone).then(function (result){
                // 用户已经登录
                if(result){logined = result}
            })

        } catch (error) {
            ctx.throw(401, 'AUTHENTICATION_ERROR')
        }
        if(logined){
            // token续期
            ctx.redisdb.expire('login-'+request.telephone, process.env.TOKEN_EXPIRATION_TIME)
            ctx.redisdb.expire(logined, process.env.TOKEN_EXPIRATION_TIME)
            // 返回用户token
            ctx.body = {accessToken: logined}
        }else{
            //已有用户但未登录，则基于时间戳生成新token
            var token = UUID.v1();
            console.log("before="+Object.keys(user))
            Object.keys(user).forEach(function(param){
                if('id' != param && 'telephone' != param && 'type' != param){
                    delete user[param];
                }
            });
            console.log("after="+Object.keys(user))
            // 设置redis双向绑定
            ctx.redisdb.set(token, JSON.stringify(user), 'EX', process.env.TOKEN_EXPIRATION_TIME);
            ctx.redisdb.set('login-'+request.telephone, token, 'EX', process.env.TOKEN_EXPIRATION_TIME);
            // 返回用户token
            ctx.body = {accessToken: token}
        }
    }

    // 禁用用户
    async halt(ctx) {
        const params = ctx.params
        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const user = new User()
        await user.find(params.id)
        if (!user) ctx.throw(400, 'INVALID_USER_DATA')

        //Add the updated date value
        user.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        user.operateFlag = 'U'
        user.operator = curUser.id
        // 设置启用状态
        user.status = '02'
        try {
            await user.save()
            ctx.body = { id: user.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
        // TODO:用户登录缓存状态改成无效
    }

    // 启用用户
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const user = new User()
        await user.find(params.id)
        if (!user) ctx.throw(400, 'INVALID_USER_DATA')

        //Add the updated date value
        user.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        user.operateFlag = 'U'
        user.operator = curUser.id
        // 设置启用状态
        user.status = '01'
        try {
            await user.save()
            ctx.body = { id: user.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
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
        // var [result] = await db('t_hm101_users')
        //     .where({telephone: request.telephone})
        //     .count('id as id');
        // if (result.id) {
        //     ctx.throw(400, 'INVALID_TELEPHONE_NUMBER')
        // };
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
        const request = ctx.request.body;

        const curUser = ctx.state.user;

        const user = new User()
        await user.find(curUser.id);

        //Add the updated date value
        user.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        user.operateFlag = 'U'
        user.operator = curUser.id

        //Replace the user data with the new updated user data
        Object.keys(request).forEach(function(parameter, index) {
            user[parameter] = request[parameter]
            // console.log('parameter-'+parameter+'-is:'+user[parameter])
        })
        Object.keys(user).forEach(function(parameter, index) {
            console.log('user param-'+parameter+'-is:'+user[parameter])
        });
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

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
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

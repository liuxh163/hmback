import rand from 'randexp'
import bcrypt from 'bcrypt'
import dateFormat from 'date-fns/format'

import { User } from '../models/User';

const UUID = require('uuid');

class UserController {
    constructor() {}

    //管理员登录
    async login(ctx) {
        const request = ctx.request.body;
        // 检查请求参数
        if (!request.telephone&&!request.password)
            ctx.throw(401, 'INVALID_REQUEST_PARAMS')
        var admin = new User()
        await admin.findPhone(request.telephone)
        if (!admin){
            ctx.throw(400, 'INVALID_USER')
        }
        //检查用户登录密码
        try {
            let correct = await bcrypt.compare(
                request.password,
                admin.password
            )
            if (!correct) {
                ctx.throw(400, 'WRONE_PASSWORD')
            }
        } catch (error) {
            console.log('here', error)
                ctx.throw(400, 'WRONE_PASSWORD')
        }
        // 判断管理员登录状态
        var logined;
        try {
            await ctx.redisdb.get('login-'+request.telephone)
                .then(function (result){
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
            //未登录，则基于时间戳生成新token
            var token = UUID.v1();
            // console.log("before="+Object.keys(user))
            Object.keys(user).forEach(function(param){
                if('id' != param && 'telephone' != param && 'type' != param){
                    delete user[param];
                }
            });
            // console.log("after="+Object.keys(user))
            // 设置redis双向绑定
            ctx.redisdb.set(token, JSON.stringify(admin),
                'EX', process.env.TOKEN_EXPIRATION_TIME);
            ctx.redisdb.set('login-'+request.telephone, token, 
                'EX', process.env.TOKEN_EXPIRATION_TIME);
            // 返回用户token
            ctx.body = {accessToken: token}
        }
    }
   //管理员登出
   async logout(ctx) {
        if(ctx.header.hmtoken){
            var telephone;
            await ctx.redisdb.get(ctx.header.hmtoken).then(function (result) {
                if(result){
                    telephone = JSON.parse(result).telephone
                }
            })
            ctx.redisdb.del(ctx.header.hmtoken);
            ctx.redisdb.del('login-'+telephone);
            ctx.body = {telephone: telephone}
        }else{
            ctx.throw(401, 'LOGOUT_ERROR_USER');
        }
    }
    /**
     * 创建管理员用户
     * @param {*} ctx 
     */
    async create(ctx) {
        const request = ctx.request.body;
        // 检查请求参数
        if (!request.telephone&&!request.password)
            ctx.throw(401, 'INVALID_REQUEST_PARAMS');
        // 检查短信验证码是否正确
        if(!await this.checkSmsCode(ctx))
            ctx.throw(401, 'WRONG_SMS_CODE');
        var admin = new User()
        await admin.findPhone(request.telephone)
        if (admin.telephone){
            ctx.throw(401, 'TELEPHONE_ALREADY_REGISTRY')
        }
        console.log("create new user by "+request.telephone)
        request.loginId = new rand(/[0-9]{9}/).gen();
        request.ipAddress = ctx.request.ip
        delete request.smscode
        // 处理用户密码.
        try {
            request.password = await bcrypt.hash(request.password, 12)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
        admin = new User(request);
        admin.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        admin.operator = '1';
        try {
            let userid = await admin.store("02");
            ctx.body = {id:userid[0]};
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA_IN_INSERT')
        }
    }
    //管理员修改密码
    async chpwd(ctx) {
        const request = ctx.request.body;
        // 检查请求参数
        if (!request.telephone&&!request.password)
            ctx.throw(401, 'INVALID_REQUEST_PARAMS');
        // 检查短信验证码是否正确
        if(!await this.checkSmsCode(ctx))
            ctx.throw(401, 'WRONG_SMS_CODE');
        var admin = new User()
        await admin.findPhone(request.telephone)
        if (!admin){
            ctx.throw(400, 'INVALID_ADMIN_USER')
        }
        const curUser = ctx.state.user;
        if(admin.telephone !== curUser.telephone){
            ctx.throw(401,'NOT_THE_SAME_USER');
        }
        // 处理用户密码.
        try {
            admin.password = await bcrypt.hash(request.password, 12)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
        //Add the updated date value
        admin.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        admin.operateFlag = 'U'
        admin.operator = curUser.id
        try {
            await admin.save()
            ctx.body = { telephone: admin.telephone }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 检查手机验证码
     * @param {*} ctx 
     */
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
}

export default UserController

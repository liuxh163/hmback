import rand from 'randexp';
import dateFormat from 'date-fns/format';

import { User,findById } from '../models/User'
import {getThumbNumAndCommentNumForUser} from '../models/Post'
import {Order} from '../models/Order'
import redisdb from '../db/redis'
import { isIterable } from 'core-js';
import IntervalLock from '../lock/intervallock'
if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = process.env.ALI_ACCESSKEYID
const secretAccessKey = process.env.ALI_SECRETACCESSKEY

const UUID = require('uuid');
const token_expire = process.env.TOKEN_EXPIRATION_TIME;
const sms_expire = process.env.SMS_EXPIRATION_TIME;
const sms_interval = process.env.SMS_INTERVAL
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
            console.debug("create new user by "+request.telephone)
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
                console.debug("hahahahah"+userid[0]);
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
            ctx.redisdb.expire('login-'+request.telephone, token_expire)
            ctx.redisdb.expire(logined, token_expire)
            // 返回用户token
            ctx.body = {accessToken: logined}
        }else{
            //已有用户但未登录，则基于时间戳生成新token
            var token = UUID.v1();
            console.debug("before="+Object.keys(user))
            Object.keys(user).forEach(function(param){
                if('id' != param && 'telephone' != param && 'type' != param 
                    && 'userName' != param && 'iconPath' != param){
                    delete user[param];
                }
            });
            console.debug("after="+Object.keys(user))
            // 设置redis双向绑定
            ctx.redisdb.set(token, JSON.stringify(user), 'EX', token_expire);
            ctx.redisdb.set('login-'+request.telephone, token, 'EX', token_expire);
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
            console.error(error)
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
            console.error(error)
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
        let key = 'sms_verify_'+request.telephone;
        let smsCode =  await ctx.redisdb.get(key);

        if(smsCode && smsCode == request.smscode ) {
            passed = true;
            await redisdb.del(key)
        }
        return passed
    }

    //发送短信验证码
    async sendSms(ctx) {
        const request = ctx.request.body

        if(!request.telephone) ctx.throw(500,"INVALID PARAM");
        let itlLock = new IntervalLock({
            key:'sms_interval:'+request.telephone,
            interval:sms_interval,
            lockedMsg: '发送太频繁'
        })
        await itlLock.lock();
        // let interval_key = 'sms_interval_'+request.telephone;
        // let cnt = await redisdb.exists(interval_key);
        // if(cnt != 0 ){
        //     ctx.throw(500,'发送太频繁');
        // }
        let verify = new rand(/[1-9]{6}/).gen();

        //初始化sms_client
        let smsClient = new SMSClient({accessKeyId,secretAccessKey});



        await smsClient.sendSMS({
            PhoneNumbers: request.telephone,
            SignName: '心意康旅',
            TemplateCode: 'SMS_153880263',
            TemplateParam: `{"code":${verify}}`
        }).then(async function (res) {
            let {Code}=res
            if (Code === 'OK') {
                await ctx.redisdb.set('sms_verify_'+request.telephone,verify,'EX',sms_expire)
                //处理返回参数
                console.debug(res)
            }
        }, function (err) {
            console.error(err);
            ctx.throw(500,'短信发送失败')
        })

        ctx.body = {}
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
        Object.keys(request).forEach(function(param) {
            if("birthday" === param){
                user.birthday = dateFormat(new Date(request[param]),'YYYY-MM-DD');
            }else{
                user[param] = request[param];
            }
            
            
        })

        try {
            await user.save()
            ctx.body = { id: user.id }
        } catch (error) {
            console.error(error)
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
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    async mine(ctx){
        let userid = ctx.state.user.id;
        let user = await findById(userid);
        let nums = await getThumbNumAndCommentNumForUser(userid);
        let beCommentOrderNum = await Order.getBeCommentNum(userid);
        let  pendingPaymentNum = await Order.getPendingPaymentNum(userid);
        ctx.body = {
            user:user,
            thumbNum:nums.thumbNum,
            commentNum:nums.commentNum,
            beCommentOrderNum:beCommentOrderNum,
            pendingPaymentNum:pendingPaymentNum
        }
    }
}

export default UserController

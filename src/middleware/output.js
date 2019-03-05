import redis from 'ioredis'

// if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
// require('dotenv').config();

//记录登录用户数据
// const redisdb = new redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
const redisdb = require('../db/redis')
const EscapePath = ['/api/v1/orders/wx_notify']
async function outHandler(ctx, next) {
    ctx.redisdb = redisdb
    await next();
    //跳过部分url
    try{
        let idx = EscapePath.findIndex((value)=>{return value === ctx.path});
        if(idx != -1){
            return;
        }
    }catch(error){
        console.error(error);
    }

    var result
    if('200'!=ctx.status){
        result = {
            success: false,
            status: ctx.status,
            errcode: "123",
            message:ctx.body.message,
            data: {}
        }
        delete ctx.body
    }else{
        result = {
            success: true,
            status: ctx.status,
            errcode: "",
            message: "",
            data: ctx.body
        }
        delete ctx.body
    }
    ctx.body = result
}

export default outHandler

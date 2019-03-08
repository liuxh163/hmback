'use strict'

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import xmlParser from 'koa-xml-body'
import cors from 'koa2-cors';
import logger from './logs/log';
import userAgent from 'koa-useragent';
import error from 'koa-json-error';
import ratelimit from 'koa-ratelimit';

import output from './middleware/output';
//Routes
import userActionsRouter from './routes/userActions';
import topicsRouter from './routes/topics';
import postsRouter from './routes/posts';
import productsRouter from './routes/products';
import commentsRouter from './routes/comments';
import channelsRouter from './routes/channels';
import carouselsRouter from './routes/carousels';
import servantsRouter from './routes/servants';
import attendantsRouter from './routes/attendants';
import tagsRouter from './routes/tags';
import thumbsRouter from './routes/thubms';
import filesRouter from './routes/files';
import ordersRouter from './routes/orders';
import commonsRouter from './routes/commons';
import adminsRouter from './routes/admins';
import commonlyTraverler from './routes/commonlytraveler'
import updateRouter from './routes/update'
import goodEstimateRouter from './routes/goodestimate'
import {startMQ} from './msgcenter/msgCenter'

startMQ();

console.log = function(logText){
    logger.info(logText);
}
console.error = function(logText){
    if(!logText) console.trace();
    logger.error(logText);
}

console.debug = function(logText){
    logger.debug(logText);
}
//Initialize app
const app = new Koa()
app.silent = true
if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const redisdb = require('./db/redis')

//Here's the rate limiter
app.use(
    ratelimit({
        db: redisdb,
        duration: 60000,
        errorMessage:
            "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 100,
    })
)

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
        logger.info(
            
            ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status+ " "+ctx.response.get('X-Response-Time')
        )
    } catch (error) {}
})

//Apply error json handling
let errorOptions = {
    postFormat: (e, obj) => {
        console.error(e)
        if (process.env.NODE_ENV !== 'production') {
            return obj
        } else {
            delete obj.stack
            delete obj.name
            return obj
        }
    },
}
//定义response整体格式中间件
app.use(output)

app.use(error(errorOptions))

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')
})

//For cors with options
app.use(cors({ origin: '*' }))

//For useragent detection
app.use(userAgent)
app.use(xmlParser({xmlOptions:{
    explicitArray:false,
    ignoreAttrs:true,
    trim:true
},encoding: 'utf8'}));
//For managing body. We're only allowing json.
app.use(bodyParser({jsonLimit:'10mb'}));

//公用资源路由
app.use(commonsRouter.routes())
app.use(commonsRouter.allowedMethods())
//用户资源路由
app.use(userActionsRouter.routes())
app.use(userActionsRouter.allowedMethods())
//产品资源路由
app.use(productsRouter.routes())
app.use(productsRouter.allowedMethods())
//轮播资源路由
app.use(carouselsRouter.routes())
app.use(carouselsRouter.allowedMethods())
//话题资源路由
app.use(topicsRouter.routes())
app.use(topicsRouter.allowedMethods())
//帖子资源路由
app.use(postsRouter.routes())
app.use(postsRouter.allowedMethods())
//评论资源路由
app.use(commentsRouter.routes())
app.use(commentsRouter.allowedMethods())
//服务人员资源路由
app.use(servantsRouter.routes())
app.use(servantsRouter.allowedMethods())
//渠道资源路由
app.use(channelsRouter.routes())
app.use(channelsRouter.allowedMethods())
//文件路由
app.use(filesRouter.routes())
app.use(filesRouter.allowedMethods())
//标签路由
app.use(tagsRouter.routes())
app.use(tagsRouter.allowedMethods())
//点赞路由
app.use(thumbsRouter.routes())
app.use(thumbsRouter.allowedMethods())
//附加项路由
app.use(attendantsRouter.routes())
app.use(attendantsRouter.allowedMethods())
//订单路由
app.use(ordersRouter.routes())
app.use(ordersRouter.allowedMethods())
//管理员路由
app.use(adminsRouter.routes())
app.use(adminsRouter.allowedMethods())
//出行人路由
app.use(commonlyTraverler.routes())
app.use(commonlyTraverler.allowedMethods())
//版本更新服务
app.use(updateRouter.routes())
app.use(updateRouter.allowedMethods())
//订单商品服务
app.use(goodEstimateRouter.routes())
app.use(goodEstimateRouter.allowedMethods())



process.on('uncaughtException', function (err) { 
    console.error('Caught exception: ' + err); 
}); 

export default app

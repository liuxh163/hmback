'use strict';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import logger from './logs/log';
import userAgent from 'koa-useragent';
import error from 'koa-json-error';

import output from './middleware/output';
//Routes
import hmRouters from './routes/';

console.log=function(logText){
    logger.info(logText);
}
//Initialize app
const app = new Koa();

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
        logger.info(
            ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status
        )
    } catch (error) {}
});

//Apply error json handling
let errorOptions = {
    postFormat: (e, obj) => {
        //Here's where we'll stick our error logger.
        logger.info(obj)
        if (process.env.NODE_ENV !== 'production') {
            return obj
        } else {
            delete obj.stack
            delete obj.name
            return obj
        }
    },
};
//定义response整体格式中间件
app.use(output);

app.use(error(errorOptions));

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')
});

//For cors with options
app.use(cors({ origin: '*' }));

//For useragent detection
app.use(userAgent);

//For managing body. We're only allowing json.
app.use(bodyParser({jsonLimit:'10mb'}));

//添加路由
app.use(hmRouters.routes());
app.use(hmRouters.allowedMethods());

export default app;

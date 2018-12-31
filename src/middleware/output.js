import redis from 'ioredis'
//记录登录用户数据
const redisdb = new redis();
// 错误处理中间件
async function outHandler(ctx, next) {
    ctx.redisdb = redisdb
    await next();
    // ctx.redisdb.get('dd114f80-05a6-11e9-bf02-7780a1cd7342').then(function (result) {
    //     let test = JSON.parse(result)
    //     console.log("1-1-1-1"+test.telephone);
    // });

    // ctx.redisdb.expire('dd114f80-05a6-11e9-bf02-7780a1cd7342', 1000)

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

import { Codes } from '../models/Codes'

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

module.exports = (opts = {}) => {

    const middleware = async function rdsToken(ctx, next) {
        //Grab the token
        const token = getToken(ctx);

        try {
            await ctx.redisdb.get(token).then(function (result){
                if(result){
                    ctx.state.user = JSON.parse(result);
                }
            });

            // 代码表保存至redis缓存中，长期有效
            let codeFlag = false;
            await ctx.redisdb.get('codes').then(function (result){
                if(!result){
                    codeFlag = true;
                }else{
                    ctx.state.codes = JSON.parse(result);
                    ctx.state.getCode = function(codeClass,code){
                        for(var i in ctx.state.codes){
                            if(ctx.state.codes[i].codeClass === codeClass 
                                &&ctx.state.codes[i].code === code){
                                    return ctx.state.codes[i].codeDesc
                                }                            
                        }
                    }
                    console.log("码表信息是--"+ctx.state.getCode("MBZLBM","03"));
                };
            });

            if(codeFlag){
                const codes = new Codes();
                let code = await codes.all();
                if( code ){
                    ctx.redisdb.set('codes', JSON.stringify(code))
                }
            }
            // 根据token从redis缓存中读取用户信息保存在上下文中
            if(ctx.state.user){
                var expiration = process.env.TOKEN_EXPIRATION_TIME;
                // token访问后续期
                await ctx.redisdb.expire(token, expiration)
                await ctx.redisdb.expire('login-'+ctx.state.user.telephone, expiration)
                return next()
            }

            
        } catch (error) {
            //If it's an expiration error, let's report that specifically.
            if (error.name === 'TokenExpiredError') {
                ctx.throw(401, 'TOKEN_EXPIRED')
            } else {
                ctx.throw(401, 'AUTHENTICATION_ERROR')
            }
        }
        ctx.throw(401, 'TOKEN_AUTHENTICATION_ERROR')
    }

    function getToken(ctx) {
        if (!ctx.header || !ctx.header.hmtoken) {
            return
        }
        if(ctx.header.hmtoken){
            return ctx.header.hmtoken;
        }
        return ctx.throw(401, 'AUTHENTICATION_ERROR')
    }

    return middleware
}


module.exports = (opts = {}) => {

    const middleware = async function rdsToken(ctx, next) {
        //Grab the token
        const token = getToken(ctx)

        try {
            await ctx.redisdb.get(token).then(function (result){
                if(result){
                    ctx.state.user = JSON.parse(result)
                    // ctx.state.user = result
                }
            })

            if(ctx.state.user){
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

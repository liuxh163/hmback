import { Codes } from '../models/Codes'

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

module.exports = (opts = {}) => {

    const middleware = async function rdsToken(ctx, next) {
        
        if(ctx.state.user.type != '02'){
            ctx.throw(400,'TOKEN_ROLE_ERROR');
        }
        return await next();
    }

    return middleware
}

import Update from '../models/Update'
class UpdateController{
    async getNewest(ctx){
        let query = ctx.query;
        if(!query.app_version || ! query.app_package){
            throw (500,'INVALID_PARAM')
        }
        let result = await Update.getNewest(query.app_package,query.app_version);
        ctx.body = result||{};
    }
}

export default UpdateController
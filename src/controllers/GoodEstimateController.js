
import GoodEstimate from '../models/GoodEstimate'
import {findById} from '../models/User'
class GoodEstimateController {
    async all(ctx) {
        let query = ctx.query;
        if(!query.target || ! query.targetId){
            ctx.throw(500,'INVALID_PARAM');
        }
        if ( !query.page || !query.pageNum) {
            ctx.throw(500, 'INVALID_PARAM')
        }
        let ests = await GoodEstimate.all(query.target,query.targetId,query.page,query.pageNum,query.escapeEmpty);
        for(let i = 0 ; i < ests.length ; ++i){
            var tmp = await findById(ests[i].userId);
            ests[i].userName = tmp.userName;
            ests[i].iconPath = tmp.iconPath;
            ests[i].formatForClient();
        }

        let cnt = await GoodEstimate.count(query.target,query.targetId);
        ctx.body = {
            estimates:ests,
            totalCount:cnt
        }
    }
    async commit(ctx){
        let param = ctx.request.body;
        if(!param.number) {
            ctx.throw(500,'INVALID_PARAM');
        }
        param.userId = ctx.state.user.id;
        await GoodEstimate.storeByNumber(param);
        ctx.body = {};
    }
}

export default GoodEstimateController

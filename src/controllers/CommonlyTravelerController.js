
import dateFormat from 'date-fns/format';
import {CommonlyTraveler, findById} from '../models/CommonlyTraveler'

class CommonlyTravelerController{
    async all(ctx){
        let userId = ctx.state.user.id;
        let results = await CommonlyTraveler.all(userId);
        for(let i = 0 ; i < results.length ; ++i){
            results[i].formatForClient();
        }
        ctx.body = results;
    }
    async add(ctx){
        let userId = ctx.state.user.id;
        let ct = new CommonlyTraveler(ctx.request.body);
        await ct.save(userId);
        ct.formatForClient();
        ctx.body = ct;
    }
    async update(ctx){
        let userId = ctx.state.user.id;
        let ct = new CommonlyTraveler(ctx.request.body);
        await ct.store(userId);
        ct = await CommonlyTraveler.find(ct.id);
        ct.formatForClient();
        ctx.body = ct;
    }
    async del(ctx){
        let params = ctx.request.body;
        if(!params.id) ctx.throw(500,'INVALID_PARAM');
        let userId = ctx.state.user.id;
        let ct = new CommonlyTraveler(params);
        await ct.del(userId);
        ctx.body = '';
    }
}
export default CommonlyTravelerController;

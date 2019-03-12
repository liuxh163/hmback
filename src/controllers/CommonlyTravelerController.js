
import dateFormat from 'date-fns/format';
import {CommonlyTraveler, findById} from '../models/CommonlyTraveler'

class CommonlyTravelerController{
    async all(ctx){
        let userId = ctx.state.user.id;
        ctx.body = await CommonlyTraveler.all(userId);
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
        ctx.body = ct.id;
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

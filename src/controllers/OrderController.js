import dateFormat from 'date-fns/format'

import { Order, OrderPeople , OrderAttendant, ProductTranscation } from '../models/Order'
import {User} from '../models/User'

class OrderController {
    async index(ctx) {
        const query = ctx.query

        //Attach logged in user
        query.userId = ctx.state.user.id;
        

        //Let's check that the sort options were set. Sort can be empty
        if ( !query.page || !query.pageNum) {
            ctx.throw(500, 'INVALID_PARAM')
        }



        //Get paginated list of notes
        try {
            let result = await Order.all(query)
            for(let i = 0 ; i < result.length ; ++i){
                result[i].formatForClient();
            }
            ctx.body = result
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    async withdraw(ctx){
        let params = ctx.request.body
        if(!params.number){
            ctx.throw(400, 'INVALID_DATA')
        }
        try{
            const order = new Order(params)
            order.withdraw();
            ctx.body = {}
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async productOrder(ctx){
        let params = ctx.request.body;
        params.buyerId = ctx.state.user.id;
        let productTranscation = new ProductTranscation(params);
        let order = await productTranscation.save();
        ctx.body = order;
    }
    async getOrderFullInfo(ctx){
        const query = ctx.query;
        let number = query.number;
        let order = await Order.findNumber(number);
        order.formatForClient();
        await order.fillFullInfo();
        ctx.body = order;
    }
}

export default OrderController

import dateFormat from 'date-fns/format'

import { Order, OrderPeople , OrderAttendant, ProductTranscation } from '../models/Order'
import {User} from '../models/User'
class OrderController {
    async index(ctx) {
        const query = ctx.query

        //Attach logged in user
        query.userId = ctx.state.user.id;
        

        //Let's check that the sort options were set. Sort can be empty
        if (!query.status || !query.page || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of notes
        try {
            let result = await Order.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
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
            console.log(error)
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
}

export default OrderController

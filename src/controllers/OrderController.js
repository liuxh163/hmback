import dateFormat from 'date-fns/format'

import { Order, OrderPeople , OrderAttendant, OrderDBTranscation } from '../models/Order'
import {User} from '../models/User'
class OrderController {
    async index(ctx) {
        const query = ctx.query

        //Attach logged in user
        const user = new User(ctx.state.user)
        query.userId = user.id
        
        //Init a new note object
        const order = new Order()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.status || !query.page || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of notes
        try {
            let result = await order.all(query)
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

    async create(ctx){
        let params = ctx.request.body;
        try{
            params.buyerId = ctx.state.user.id;
            let orderDBTranscation = new OrderDBTranscation(params);
            let order = await orderDBTranscation.save();
            ctx.body = order;
        }catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize note
        const note = new Note()

        try {
            //Find and show note
            await note.find(params.id)
            ctx.body = note
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }



    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a note
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that note
        const note = new Note()
        await note.find(params.id)
        if (!note) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their note - error out
        const user = new User(ctx.state.user)
        if (note.userId !== user.id) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        note.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Add the ip
        request.ipAddress = ctx.ip

        //Replace the note data with the new updated note data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            note[parameter] = request[parameter]
        })

        try {
            await note.save()
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that note
        const note = new Note()
        await note.find(params.id)
        if (!note) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their note - error out
        const user = new User(ctx.state.user)
        if (note.userId !== user.id) ctx.throw(400, 'INVALID_DATA')

        try {
            await note.destroy()
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default OrderController

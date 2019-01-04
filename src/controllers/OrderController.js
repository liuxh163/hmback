import dateFormat from 'date-fns/format'

import { Order } from '../models/Order'

class OrderController {
    async index(ctx) {
        const query = ctx.query

        //Attach logged in user
        const user = new User(ctx.state.user)
        query.userId = user.id

        //Init a new order object
        const order = new Order()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.order || !query.page || !query.limit) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of orders
        try {
            let result = await order.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize order
        const order = new Order()

        try {
            //Find and show order
            await order.find(params.id)
            ctx.body = order
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Attach logged in user
        const user = new User(ctx.state.user)
        request.userId = user.id

        //Add ip
        request.ipAddress = ctx.ip

        //Create a new order object using the request params
        const order = new Order(request)

        //Validate the newly created order
        const validator = joi.validate(order, orderSchema)
        if (validator.error) ctx.throw(400, validator.error.details[0].message)

        try {
            let result = await order.store()
            ctx.body = { message: 'SUCCESS', id: result }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a order
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that order
        const order = new Order()
        await order.find(params.id)
        if (!order) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their order - error out
        const user = new User(ctx.state.user)
        if (order.userId !== user.id) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        order.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Add the ip
        request.ipAddress = ctx.ip

        //Replace the order data with the new updated order data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            order[parameter] = request[parameter]
        })

        try {
            await order.save()
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that order
        const order = new Order()
        await order.find(params.id)
        if (!order) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their order - error out
        const user = new User(ctx.state.user)
        if (order.userId !== user.id) ctx.throw(400, 'INVALID_DATA')

        try {
            await order.destroy()
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default OrderController

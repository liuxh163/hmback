import dateFormat from 'date-fns/format'

import { Carousel } from '../models/Carousel'

class ExpertController {
    async index(ctx) {
        const query = ctx.query

        //Init a new expert object
        const expert = new Expert()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.id) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of experts
        try {
            let result = await expert.all(query)
            ctx.body = result
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize expert
        const expert = new Expert()

        try {
            //Find and show expert
            await expert.find(params.id)
            ctx.body = expert
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Create a new expert object using the request params
        const expert = new Expert(request)

        try {
            let result = await expert.store()
            ctx.body = { message: 'SUCCESS', id: result }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a expert
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that expert
        const expert = new Expert()
        await expert.find(params.id)
        if (!expert) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their expert - error out
        const user = new User(ctx.state.user)
        if (user.type !== '02') ctx.throw(400, 'INVALID_PREVILEGE')

        //Add the updated date value
        expert.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the expert data with the new updated expert data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            expert[parameter] = request[parameter]
        })

        try {
            await expert.save()
            ctx.body = { id: expert.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that expert
        const expert = new Expert()
        await expert.find(params.id)
        if (!expert) ctx.throw(400, 'INVALID_DATA')

        //Grab the user //If it's not their expert - error out
        const user = new User(ctx.state.user)
        if (expert.userId !== user.id) ctx.throw(400, 'INVALID_DATA')

        try {
            await expert.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default ExpertController

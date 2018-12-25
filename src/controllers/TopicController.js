import dateFormat from 'date-fns/format'

import { User } from '../models/User'
import { Topic } from '../models/Topic'

class TopicController {
    async index(ctx) {
        const query = ctx.query

        const topic = new Topic()

        //获取所有话题
        try {
            let result = await topic.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        const topic = new Topic()

        try {
            await topic.find(params.id)
            ctx.body = topic
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        const topic = new Topic(request)

        try {
            let result = await topic.store()
            ctx.body = { message: 'SUCCESS', id: result }
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
        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        note.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')


        //Replace the note data with the new updated note data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            topic[parameter] = request[parameter]
        })

        try {
            await topic.save()
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
        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_DATA')

        try {
            await topic.destroy()
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default TopicController

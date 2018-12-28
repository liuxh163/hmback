import dateFormat from 'date-fns/format'

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

        //Make sure they've specified a topic
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that topic
        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        topic.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')


        //Replace the topic data with the new updated topic data
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
    // 禁用话题
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_topics')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 启用话题
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_topics')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }
}

export default TopicController

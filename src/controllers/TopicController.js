import db from '../db/db'
import dateFormat from 'date-fns/format'

import { Topic } from '../models/Topic'

class TopicController {
    async index(ctx) {
        const query = ctx.query
        const request = ctx.request.body

        query.status = request.status
        //获取当前用户
        // const curUser = ctx.state.user
        // if ('02' === curUser.type) {
        //     query.operateFlag = 'D'
        // }
        const topic = new Topic()

        //获取所有话题
        try {
            let result = await topic.all(query)
            ctx.body = {topics:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body
        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')
        const topic = new Topic(request)
        topic.operator = curUser.id

        try {
            let result = await topic.store()
            ctx.body = { id: result[0] }
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

        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')

        //Find and set that topic
        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_DATA');
        console.log("lalalalalalal"+Object.keys(request))
        //Add the updated date value
        topic.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        topic.operateFlag = 'U'
        topic.operator = curUser.id

        //Replace the topic data with the new updated topic data
        Object.keys(request).forEach(function(parameter, index) {
            topic[parameter] = request[parameter]
            // console.log("param is include "+parameter)
        })

        try {
            await topic.save()
            ctx.body = { id: topic.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    //
    /**
     * [禁用话题]
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async halt(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_TOPIC_DATA')

        //Add the updated date value
        topic.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        topic.operateFlag = 'U'
        topic.operator = curUser.id
        // 设置启用状态
        topic.status = '02'
        try {
            await topic.save()
            ctx.body = { id: topic.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 启用话题
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const topic = new Topic()
        await topic.find(params.id)
        if (!topic) ctx.throw(400, 'INVALID_TOPIC_DATA')

        //Add the updated date value
        topic.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        topic.operateFlag = 'U'
        topic.operator = curUser.id
        // 设置启用状态
        topic.status = '01'
        try {
            await topic.save()
            ctx.body = { id: topic.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default TopicController

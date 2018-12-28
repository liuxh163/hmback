import dateFormat from 'date-fns/format'

import { Channel } from '../models/Channel'

class ChannelController {
    async index(ctx) {
        const query = ctx.query

        const channel = new Channel()

        if (!query.pages || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of channels
        try {
            let result = await channel.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        const channel = new Channel(request)

        try {
            let result = await channel.store()
            ctx.body = { id: result }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that channel
        const channel = new Channel()
        await channel.find(params.id)
        if (!channel) ctx.throw(400, 'INVALID_DATA')

        //验证管理员权限
        const user = new User(ctx.state.user)
        if ('02' !== user.id) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        channel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the channel data with the new updated channel data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            channel[parameter] = request[parameter]
        })

        try {
            await channel.save()
            ctx.body = { id: channel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

   // 禁用渠道
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_channels')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 启用渠道
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_channels')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }
}

export default ChannelController

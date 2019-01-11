import dateFormat from 'date-fns/format'

import { Channel } from '../models/Channel'
import { User } from '../models/User'

class ChannelController {
    async index(ctx) {
        const query = ctx.query

        const channel = new Channel()

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //Get paginated list of channels
        try {
            let result = await channel.all(query)
            ctx.body = {channels:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body
        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        request.operator = curUser.id
        const channel = new Channel(request)

        try {
            let result = await channel.store()
            ctx.body = { id: result[0] }
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
        const curUser = new User(ctx.state.user)
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        channel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        channel.operateFlag = 'U'
        channel.operator = curUser.id
        // Object.keys(channel).forEach(function(param,index){
        //     console.log("controller1 channel attr "+param+" is "+channel[param])
        // })
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
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const channel = new Channel()
        await channel.find(params.id)
        if (!channel) ctx.throw(400, 'INVALID_CHANNEL_DATA')

        //Add the updated date value
        channel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        channel.operateFlag = 'U'
        channel.operator = curUser.id
        // 设置启用状态
        channel.status = '02'
        try {
            await channel.save()
            ctx.body = { id: channel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 启用渠道
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const channel = new Channel()
        await channel.find(params.id)
        if (!channel) ctx.throw(400, 'INVALID_CHANNEL_DATA')

        //Add the updated date value
        channel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        channel.operateFlag = 'U'
        channel.operator = curUser.id
        // 设置启用状态
        channel.status = '01'
        try {
            await channel.save()
            ctx.body = { id: channel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default ChannelController

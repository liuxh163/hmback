import dateFormat from 'date-fns/format'

import { Servant } from '../models/Servant'


class ServantController {
    async index(ctx) {
        const query = ctx.query

        //Init a new servant object
        const servant = new Servant()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.type || !query.nation || !query.pages || !query.pageNum) {
            ctx.throw(400, 'INVALID_SERVANT_OPTIONS')
        }

        //Get paginated list of servants
        try {
            let result = await servant.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize servant
        const servant = new Servant()

        try {
            //Find and show servant
            await servant.find(params.id)
            ctx.body = { id: servant.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Create a new servant object using the request params
        const servant = new Servant(request)

        try {
            let result = await servant.store()
            ctx.body = { id: result.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a servant
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that servant
        const servant = new Servant()
        await servant.find(params.id)
        if (!servant) ctx.throw(400, 'INVALID_DATA')

        //检查当前用户是否管理员
        const user = new User(ctx.state.user)
        if (servant.type !== '02') ctx.throw(400, 'INVALID_PREVILEGE')

        //Add the updated date value
        servant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the servant data with the new updated servant data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            servant[parameter] = request[parameter]
        })

        try {
            await servant.save()
            ctx.body = { id: servant.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

   // 禁用服务人员
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_servants')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 启用服务人员
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_servants')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }
}

export default ServantController

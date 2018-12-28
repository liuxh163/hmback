import dateFormat from 'date-fns/format'

import { Attendant } from '../models/Attendant'

class AttendantController {
    async index(ctx) {
        const query = ctx.query

        //Init a new attendant object
        const attendant = new Attendant()

        //Let's check that the sort options were set. Sort can be empty
        if (!query.pages || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of attendants
        try {
            let result = await attendant.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Create a new attendant object using the request params
        const attendant = new Attendant(request)

        try {
            let result = await attendant.store()
            ctx.body = { id: result.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a attendant
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that attendant
        const attendant = new Attendant()
        await attendant.find(params.id)
        if (!attendant) ctx.throw(400, 'INVALID_DATA')

        // 用户类型 01-普通用户 02-管理员
        const user = new User(ctx.state.user)
        if ('02' !== user.type) ctx.throw(400, 'NO_PREVILEGE_TO_UPDATE_DATA')

        //Add the updated date value
        attendant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the attendant data with the new updated attendant data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            attendant[parameter] = request[parameter]
        })

        try {
            await attendant.save()
            ctx.body = { id: attendant.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 禁用附加项
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_attendants')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 启用附加项
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_attendants')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }
}

export default AttendantController

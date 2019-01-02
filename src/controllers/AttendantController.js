import dateFormat from 'date-fns/format'

import { Attendant } from '../models/Attendant'

class AttendantController {
    /**
     * 查询所有附加项
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async index(ctx) {
        const query = ctx.query
        const request = ctx.request.body

        query.status = request.status
        //Init a new attendant object
        const attendant = new Attendant()

        //Get paginated list of attendants
        try {
            let result = await attendant.all(query)
            ctx.body = {attendants:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    /**
     * 创建新附加项
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const request = ctx.request.body

        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')

        //Create a new attendant object using the request params
        const attendant = new Attendant(request)
        attendant.operator = curUser.id
        attendant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        try {
            let result = await attendant.store()
            ctx.body = { id: result[0] }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 更新指定附加项信息
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
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
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'NO_PREVILEGE_TO_UPDATE_DATA')

        //Add the updated date value
        attendant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        attendant.operateFlag = 'U'
        attendant.operator = curUser.id

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
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const attendant = new Attendant()
        await attendant.find(params.id)
        if (!attendant) ctx.throw(400, 'INVALID_attendant_DATA')

        //Add the updated date value
        attendant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        attendant.operateFlag = 'U'
        attendant.operator = curUser.id
        // 设置停用状态
        attendant.status = '02'
        try {
            await attendant.save()
            ctx.body = { id: attendant.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 启用附加项
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const attendant = new Attendant()
        await attendant.find(params.id)
        if (!attendant) ctx.throw(400, 'INVALID_attendant_DATA')

        //Add the updated date value
        attendant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        attendant.operateFlag = 'U'
        attendant.operator = curUser.id
        // 设置启用状态
        attendant.status = '01'
        try {
            await attendant.save()
            ctx.body = { id: attendant.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default AttendantController

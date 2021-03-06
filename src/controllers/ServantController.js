import dateFormat from 'date-fns/format'

import { Servant } from '../models/Servant'
import { User } from '../models/User'
import {isLike} from '../models/Thumb'
class ServantController {
    /**
     * 分类型国籍查询服务人员列表，支持分页
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */ 
    async index(ctx) {
        const query = ctx.query

        //Init a new servant object
        const servant = new Servant()

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //Get paginated list of servants
        try {
            let result = await servant.all(query)
            ctx.body = {servants:result}
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    /**
     * 查询具体服务人员信息
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        const servant = new Servant()

        try {
            //Find and show servant
            await servant.find(params.id)
            servant.isLike = await isLike(ctx.state.user.id,'03',servant.id);

            ctx.body = servant
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 创建新服务人员
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const request = ctx.request.body
        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        request.operator = curUser.id
        const servant = new Servant(request)
        try {
            let result = await servant.store()
            ctx.body = { id: result }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 修改指定服务人员信息
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
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
        const curUser = new User(ctx.state.user)
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')

        //Add the updated date value
        //servant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        servant.updatedAt = new Date();
        servant.operateFlag = 'U'
        servant.operator = curUser.id
        //Replace the servant data with the new updated servant data
        let validColumn = ["name","desc","picFileId","nation","literPrice","followPrice",
            "recepPrice","type","service","intro","status","feedesc","car","category","isMainPage","score"];
        validColumn.forEach((parameter)=>{
            if(request[parameter]){
                servant[parameter] = request[parameter];
            }
        })
        // Object.keys(servant).forEach((parameter)=>{
        //     if(parameter == '')
        //     servant[parameter] = request[parameter]?request[parameter]:servant[parameter]
        // })
        // Object.keys(ctx.request.body).forEach(function(parameter, index) {
        //     servant[parameter] = request[parameter]
        // })

        try {
            await servant.save()
            ctx.body = { id: servant.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    /**
     * 禁用服务人员
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async halt(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const servant = new Servant()
        await servant.find(params.id)
        if (!servant) ctx.throw(400, 'INVALID_SERVANT_DATA')

        //Add the updated date value
        servant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        servant.operateFlag = 'U'
        servant.operator = curUser.id
        // 设置启用状态
        servant.status = '02'
        try {
            await servant.save()
            ctx.body = { id: servant.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    /**
     * 启用服务人员
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const servant = new Servant()
        await servant.find(params.id)
        if (!servant) ctx.throw(400, 'INVALID_SERVANT_DATA')

        //Add the updated date value
        servant.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        servant.operateFlag = 'U'
        servant.operator = curUser.id
        // 设置启用状态
        servant.status = '01'
        try {
            await servant.save()
            ctx.body = { id: servant.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default ServantController

import dateFormat from 'date-fns/format'

import { Carousel } from '../models/Carousel'

class CarouselController {
    /**
     * 查询指定位置或指定产品的轮播图
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async index(ctx) {
        const query = ctx.query
        const request = ctx.request.body
        query.status = request.status
        query.productId = request.productId

        const carousel = new Carousel();

        // 获取carousels列表
        try {
            let result = await carousel.all(query)
            ctx.body = {carousels:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    /**
     * 创建轮播图
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const request = ctx.request.body;

        //当前用户是否管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE')

        //Create a new carousel object using the request params
        const carousel = new Carousel(request)
        carousel.operator = curUser.id
        carousel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        try {
            let result = await carousel.store()
            ctx.body = { id: result[0] }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 修改指定轮播图信息
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a carousel
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that carousel
        const carousel = new Carousel()
        await carousel.find(params.id)
        if (!carousel) ctx.throw(400, 'INVALID_DATA')

        //检查管理员权限 用户类型 01-普通用户 02-管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'NO_PREVILEGE_TO_UPDATE_DATA')

        //Add the updated date value
        carousel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        carousel.operateFlag = 'U'
        carousel.operator = curUser.id

        //Replace the carousel data with the new updated carousel data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            carousel[parameter] = request[parameter]
        })

        try {
            await carousel.save()
            ctx.body = { id: carousel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that carousel
        const carousel = new Carousel()
        await carousel.find(params.id)
        if (!carousel) ctx.throw(400, 'INVALID_DATA')
        //检查管理员权限 用户类型 01-普通用户 02-管理员
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'NO_PREVILEGE_TO_UPDATE_DATA')

        try {
            await carousel.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

   // 禁用轮播
    async halt(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const carousel = new Carousel()
        await carousel.find(params.id)
        if (!carousel) ctx.throw(400, 'INVALID_CAROUSEL_DATA')

        //Add the updated date value
        carousel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        carousel.operateFlag = 'U'
        carousel.operator = curUser.id
        // 设置停用状态
        carousel.status = '02'
        try {
            await carousel.save()
            ctx.body = { id: carousel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 启用轮播
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const carousel = new Carousel()
        await carousel.find(params.id)
        if (!carousel) ctx.throw(400, 'INVALID_carousel_DATA')

        //Add the updated date value
        carousel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        carousel.operateFlag = 'U'
        carousel.operator = curUser.id
        // 设置启用状态
        carousel.status = '01'
        try {
            await carousel.save()
            ctx.body = { id: carousel.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default CarouselController

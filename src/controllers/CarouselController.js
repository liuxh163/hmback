import dateFormat from 'date-fns/format'

import { Carousel } from '../models/Carousel'

class CarouselController {
    async index(ctx) {
        const query = ctx.query

        const carousel = new Carousel()

        //检查查询参数
        if (!query.location) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of carousels
        try {
            let result = await carousel.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Create a new carousel object using the request params
        const carousel = new Carousel(request)

        try {
            let result = await carousel.store()
            ctx.body = { id: result }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a carousel
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that carousel
        const carousel = new Carousel()
        await carousel.find(params.id)
        if (!carousel) ctx.throw(400, 'INVALID_DATA')

        //检查管理员权限
        const user = new User(ctx.state.user)
        if ('02' !== user.type) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        carousel.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

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
        //检查管理员权限
        const user = new User(ctx.state.user)
        if ('02' !== user.type) ctx.throw(400, 'INVALID_DATA')

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
        const query = ctx.query

        try {
            await db('t_hm101_carousels')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 启用轮播
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_carousels')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }
}

export default CarouselController

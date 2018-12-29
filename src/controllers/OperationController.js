import dateFormat from 'date-fns/format'

import { Product } from '../models/Product'

class ProductController {
    async index(ctx) {
        const query = ctx.query

        //Attach logged in user
        const user = new User(ctx.state.user)
        query.operator = user.id

        //Init a new product object
        const product = new Product()

        //检测查询参数
        if (!query.sort || !query.nation || !query.pages || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //获取产品列表，分页
        try {
            let result = await product.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize product
        const product = new Product()

        try {
            //Find and show product
            await product.find(params.id)
            ctx.body = product
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        //Attach logged in user
        const user = new User(ctx.state.user)
        request.oeprator = user.id

        //Create a new product object using the request params
        const product = new Product(request)

        try {
            let result = await product.store()
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

        const product = new Product()
        await product.find(params.id)
        if (!product) ctx.throw(400, 'INVALID_DATA')

        const user = new User(ctx.state.user)
        if (product.opeartor !== user.id) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the product data with the new updated product data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            product[parameter] = request[parameter]
        })

        try {
            await product.save()
            ctx.body = { id: product.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that product
        const product = new Product()
        await product.find(params.id)
        if (!product) ctx.throw(400, 'INVALID_DATA')

        //检查操作人权限
        const user = new User(ctx.state.user)
        if ('02' !== user.type) ctx.throw(400, 'INVALID_DATA')

        try {
            await product.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

   // 产品下架
    async halt(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_products')
                .update({status:'02'})
                .where({ id: query.id, status: '01' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
        ctx.body = {id: query.id};
    }

    // 产品上架
    async awaken(ctx) {
        const query = ctx.query

        try {
            await db('t_hm101_products')
                .update({status:'01'})
                .where({ id: query.id, status: '02' })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }

        ctx.body = {id: query.id};
    }

}

export default ProductController

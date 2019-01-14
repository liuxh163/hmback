import dateFormat from 'date-fns/format'

import { Product } from '../models/Product'
import {isLike} from '../models/Thumb'
class ProductController {
    /**
     * 获取指定参数的产品列表
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async index(ctx) {
        const query = ctx.query

        //Init a new product object
        const product = new Product()

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //获取产品列表
        try {
            let result = await product.all(query)
            ctx.body = {products:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    /**
     * 查询指定产品详情
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize product
        const product = new Product()

        try {
            //Find and show product
            await product.find(params.id)
            console.log(product.id)
            product.isLike = await isLike(ctx.state.user.id,'01',product.id);
            ctx.body = product
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 创建产品
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const request = ctx.request.body;

        //获取当前用户
        const curUser = ctx.state.user;
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');
        request.operator = curUser.id;

        //Create a new product object using the request params
        const product = new Product(request);
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');

        try {
            let result = await product.store(request);
            ctx.body = { id: result };
        } catch (error) {
            console.log(error);
            ctx.throw(400, 'INVALID_INSERT_PRODUCT_DATA');
        }
    }

    async update(ctx) {
        const params = ctx.params;
        const request = ctx.request.body;

        if (!params.id) ctx.throw(400, 'INVALID_DATA');

        const product = new Product();
        await product.find(params.id);
        if (!product) ctx.throw(400, 'INVALID_DATA');

        //获取当前用户
        const curUser = ctx.state.user;
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');
        // if (product.opeartor !== curUser.id) ctx.throw(400, 'INVALID_USER')

        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        product.operateFlag = 'U';
        product.operator = curUser.id;

        //Replace the product data with the new updated product data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            product[parameter] = request[parameter];
        })
        delete product.isLike;
        try {
            await product.save();
            ctx.body = { id: product.id };
        } catch (error) {
            console.log(error);
            ctx.throw(400, 'INVALID_DATA');
        }
    }

    async delete(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const product = new Product()
        await product.findPro(params.id)
        if (!product) ctx.throw(400, 'INVALID_SERVANT_DATA')

        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        product.operateFlag = 'D'
        product.operator = curUser.id
        try {
            await product.savePro()
            ctx.body = { id: product.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

   // 产品下架
    async halt(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const product = new Product()
        await product.findPro(params.id)
        if (!product.id) ctx.throw(400, 'INVALID_PRODUCT_DATA')

        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        product.operateFlag = 'U'
        product.operator = curUser.id
        // 设置启用状态
        product.status = '02'

        // Object.keys(product).forEach(function(param,index){
        //     console.log("product attr "+param+" is "+product[param])
        // })
        try {
            await product.savePro()
            ctx.body = { id: product.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    // 产品上架
    async awaken(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(400, 'INVALID_PREVILEGE');

        const product = new Product()
        await product.findPro(params.id)
        if (!product.id) ctx.throw(400, 'INVALID_PRODUCT_DATA')

        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        product.operateFlag = 'U'
        product.operator = curUser.id
        // 设置启用状态
        product.status = '01'
        try {
            await product.savePro()
            ctx.body = { id: product.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

}

export default ProductController

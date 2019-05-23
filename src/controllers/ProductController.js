import dateFormat from 'date-fns/format'

import { Product ,findById} from '../models/Product'
import {isLike} from '../models/Thumb'
import Axios from 'axios';

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const cardDiscountUrl = process.env.HAIMA_BASE+"/haima/user/getBCDiscount";

class ProductController {
    /**
     * 获取指定参数的产品列表
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async index(ctx) {
        const query = ctx.query
        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //获取产品列表

        let result = await Product.all(query);
        let prdid = "";
        for(let i = 0 ; i < result.length ; ++i){
            prdid = prdid+result[i].id+ ",";
        }
        let discMap = new Map();
        if(prdid){
            prdid=prdid.substring(0,prdid.length-1)+"";
            let inParam = `?prdid=${prdid}&id=${ctx.state.user.id}`;
            let prdDiscount = [];
            try{
                prdDiscount = await Axios.get(cardDiscountUrl+inParam, {headers: {'Content-Type': 'application/json'}});
            }catch(err){
                console.error(err)
            }
            if(prdDiscount.data.data.discountList){
                console.debug("产品列表获取折扣数据成功");
                for(var key in prdDiscount.data.data.discountList){
                    discMap.set(prdDiscount.data.data.discountList[key].prdid,
                        prdDiscount.data.data.discountList[key].discount);
                }
            }
        }
        for(let ii = 0 ; ii < result.length ; ++ii){
            let discRate = discMap.get((result[ii].id).toString());
            result[ii].computeDiscount(discRate);
            result[ii].formatForClient();
            // 删掉儿童金额
            delete result[ii].childPrice;
            delete result[ii].childPrice_discount;
        };
        
        ctx.body = {products:result}

    }
    //admin 获取列表
    async indexWithAttendants(ctx){
        let query = ctx.query
        if(!query.id){
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        } 
        let product = await findById(query.id);
        let result = await product.allSameNationForAdmin();
        for(let i = 0 ; i < result.length ; ++i){
            result[i].formatForClient();
        }
        ctx.body = {products:result}
    }
    /**
     * 查询指定产品详情
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(500, 'INVALID_PARAM')

        let product = await Product.find(params.id);
        // 获取产品折扣
        let discRate = 1;
        if(ctx.state.user){
            let inParam = `?prdid=${product.id}&id=${ctx.state.user.id}`;
            let prdDiscount = [];
            try{
                prdDiscount = await Axios.get(cardDiscountUrl+inParam, {headers: {'Content-Type': 'application/json'}});
            }catch(err){
                console.error(err)
            }
            if(prdDiscount.data.data.discountList){
                console.debug("折扣数据获取成功");
                for(var key in prdDiscount.data.data.discountList){
                    if(product.id == prdDiscount.data.data.discountList[key].prdid){
                        discRate = prdDiscount.data.data.discountList[key].discount;
                    }
                }
            }
        }
        product.computeDiscount(discRate);

        product.formatForClient();
        if(ctx.state.user){
            product.isLike = await isLike(ctx.state.user.id,'01',product.id);
        }
        for(let i = 0 ; i < product.attendants.length ; ++i){
            product.attendants[i].formatForClient();
        }
        
        // 删掉儿童金额
        delete product.childPrice;
        delete product.childPrice_discount;

        ctx.body = product
    }
    /**
     * v2
     */
    async getProduct(ctx){
        const params = ctx.query
        if (!params.id) ctx.throw(500, 'INVALID_PARAM')

        let product = await Product.find(params.id)
        if(ctx.state.user){
            product.isLike = await isLike(ctx.state.user.id,'01',product.id);
        }
        ctx.body = product
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


        let result = await product.store(request);
        ctx.body = { id: result };

    }

    async update(ctx) {
        const params = ctx.params;
        const request = ctx.request.body;

        if (!params.id) ctx.throw(500, 'INVALID_PARAM');


        let product = await findById(params.id);

        //获取当前用户
        const curUser = ctx.state.user;
        if ('02' !== curUser.type) ctx.throw(500, 'INVALID_PREVILEGE');
        // if (product.opeartor !== curUser.id) ctx.throw(400, 'INVALID_USER')

        //Replace the product data with the new updated product data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            product[parameter] = request[parameter];
        })

        //Add the updated date value
        //product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        product.updatedAt = new Date();
        product.operateFlag = 'U';
        product.operator = curUser.id;
        delete product.isLike;

        await product.save();
        ctx.body = { id: product.id };

    }

    async delete(ctx) {
        const params = ctx.params

        //获取当前用户
        const curUser = ctx.state.user
        if ('02' !== curUser.type) ctx.throw(500, 'INVALID_PREVILEGE');

        let product = await findById(params.id);
        //Add the updated date value
        product.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        product.operateFlag = 'D'
        product.operator = curUser.id
        try {
            await product.savePro()
            ctx.body = { id: product.id }
        } catch (error) {
            console.error(error)
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


        try {
            await product.savePro()
            ctx.body = { id: product.id }
        } catch (error) {
            console.error(error)
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
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

}

export default ProductController

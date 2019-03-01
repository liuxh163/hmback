import db from '../db/db';
import { findByPid } from '../models/Tag';
import {FilesQuery} from '../models/File'
import {getH5Content} from './H5Content'
const func_getThumbs = require('./Thumb').getThumbs
const TARGET = '01'
async function getThumbs(id){
    return await func_getThumbs(id,TARGET);
}
class Product {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id;
        this.desc = data.desc;
        this.nation = data.nation;
     
        this.adultPrice = data.adultPrice;
        this.womenPrice = data.womenPrice;
        this.followPrice = data.followPrice;
        this.childPrice = data.childPrice;
        this.status = data.status;
        this.coverId = data.coverId;
        this.coverPic = data.coverPic;
        this.viewNum = data.viewNum;

        this.experts = data.experts;
        this.operations = data.operations;
        this.tags = data.tags;

        this.category = data.category;
        this.isMainPage = data.isMainPage;


        this.featureH5Id = data.featureH5Id;
        this.detailH5Id = data.detailH5Id;
        this.routineH5Id = data.routineH5Id;
        this.feeH5Id = data.feeH5Id;
        this.noticeH5Id = data.noticeH5Id;
        this.hospitalH5Id = data.hospitalH5Id;
        this.itemH5Id = data.itemH5Id;
        this.feature = data.feature;
        this.detail = data.detail;
        this.routine = data.routine;
        this.fee = data.fee;
        this.notice = data.notice;
        this.hospital = data.hospital;
        this.item = data.item;
        this.displayUrl = data.displayUrl;

        this.prepayExpiry = data.prepayExpiry;
        this.postpayExpiry = data.postpayExpiry;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
    }

    static async all(request) {

        request.page = request.page || 1;
        request.number = request.number || 10000;
        // 构建查询where条件
        let conditions = {};
        if(request.nation !== undefined) conditions.nation =  request.nation;
        if(request.isMainPage !== undefined) conditions.isMainPage = request.isMainPage;
        let notConditions = {
            "operateFlag":"D"
        };
        let result = [];
        let dbresult = await db('t_hm101_products').select('id','desc','nation','status',
                                        'coverId','adultPrice','viewNum',
                                        'isMainPage','category','displayUrl')
                                        .where(conditions)
                                        .whereNot(notConditions)
                                        .orderBy('updatedAt', 'desc')
                                        .offset(--request.page * +request.number)
                                        .limit(+request.number);
        for(let i = 0 ; i < dbresult.length ; ++i){
            let product = new Product(dbresult[i]);
            result.push(product);
        }
        
        // 获取点赞数及评论数
        for(var i in result){
            // 获取点赞数
            
            let product = result[i];
            await product.fillBrief();
        }
        return result;

    }
    /**
     * 获取点赞数与评论数
     */
    async  fillThumbsAndCommentsNum() {
        let thumbNum = await getThumbs(this.id)
        this.thumbNum = thumbNum;
        // 获取评论数
        let commentNum = await getComments(this.id)
        this.commentNum = commentNum[0].count;
    } 
    /**
     * 获取图片
     */
    async fillPictures(){
        let pics = undefined;
        if(this.coverId){
            pics = this.coverId.split(",");
            this.coverPic = await getPictures(pics);
        }else{
            this.coverPic = [];
        }
    }
    async fillExperts(){
        this.experts = await db('t_hm101_product_experts').select('*')
                .where({'productId': this.id});
    }
    async fillH5(){
        this.feature = await getH5Content(this.featureH5Id);
        this.detail = await getH5Content(this.detailH5Id);
        this.routine = await getH5Content(this.routineH5Id);
        this.fee = await getH5Content(this.feeH5Id);
        this.notice = await getH5Content(this.noticeH5Id);
        this.hospital = await getH5Content(this.hospitalH5Id);
        this.item = await getH5Content(this.itemH5Id);
    }
    /**
     * 获取TAG
     */
    async fillTags(){
        this.tags = await getTags(this.id);
    }
    /**
     * 活动?
     */
    async fillOperations(){
        this.operations = await db('t_hm101_product_operations').select('*')
        .where({'targetId': this.id});
    }
    /**
     * 获取摘要，外层使用
     */
    async fillBrief(){
        await this.fillThumbsAndCommentsNum();
        await this.fillPictures();
        await this.fillTags();
        await this.fillOperations();
    }
    /**
     * 获取所有详情,连掉上面的,可优化为并行执行?
     */
    async fillFullInfo(){
        await this.fillThumbsAndCommentsNum();
        await this.fillPictures();
        await this.fillTags();
        await this.fillOperations();
        await this.fillExperts();
        await this.fillH5();
    }
    /**
     * 除开点赞评论的,可优化为并行执行?
     */
    async fillSelf(){
        await this.fillPictures();
        await this.fillTags();
        await this.fillOperations();
        await this.fillExperts();
        await this.fillH5();
    }
    /**
     * 查询产品详细信息，包含子表信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    static async find(id) {
        let product = await findById(id);
        await product.fillFullInfo();
        return product;
    }
    /**
     * 查询产品本身信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    static async findPro(id) {
        let product = await findById(id);
        await product.fillSelf();
        return product;
    }

    async store() {
        var product = this
        // 插入表时去掉数据中非字段项
        delete product.commentNum;
        delete product.thumbNum;
        delete product.tags;

        var contents = [
            {content: product.feature},
            {content: product.detail},
            {content: product.routine},
            {content: product.fee},
            {content: product.notice},
            {content: product.hospital},
            {content: product.item}
        ];

        delete product.feature;
        delete product.detail;
        delete product.routine;
        delete product.fee;
        delete product.notice;
        delete product.hospital;
        delete product.item;

        var experts = product.experts||[];
        var operations = product.operations||[];
        delete product.experts;
        delete product.operations;
        delete product.coverPic;

        var proudctId

        return await db.transaction(function(trx) {
          return db.batchInsert('t_hm101_htmls', contents, 7)
            .returning('id')
            .transacting(trx)
            .then(function(ids) {
                product.featureH5Id = ids[0];
                product.detailH5Id = ids[0]+1;
                product.routineH5Id = ids[0]+2;
                product.feeH5Id = ids[0]+3;
                product.noticeH5Id = ids[0]+4;
                product.hospitalH5Id = ids[0]+5;
                product.itemH5Id = ids[0]+6;

                return db('t_hm101_products').insert(product)
                    .returning('id')
                    .transacting(trx)
                    .then(function(ids){
                        console.log("expert insert product id:"+ids[0])
                        proudctId = ids[0]
                        for(var i in experts){
                            experts[i].productId = proudctId
                        };

                        for(var i in operations){
                            operations[i].target = '01';
                            operations[i].targetID = proudctId;
                        };
                        return db.batchInsert('t_hm101_product_experts', 
                            experts).transacting(trx);
                    })
                    .then(function(ids){
                        return db.batchInsert('t_hm101_product_operations',
                             operations).transacting(trx);
                    })

            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return proudctId;
        })
        .catch(function(error) {
            console.log("error is---"+error)
            throw new Error('ERROR')
        });
    }
    /**
     * 存储全部产品信息
     * @return {[type]} [description]
     */
    async save() {
        var product = this

        var contents = [
            {content: product.feature, id: product.featureH5Id},
            {content: product.detail, id: product.detailH5Id},
            {content: product.routine, id: product.routineH5Id},
            {content: product.fee, id: product.feeH5Id},
            {content: product.notice, id: product.noticeH5Id},
            {content: product.hospital, id: product.hospitalH5Id},
            {content: product.item, id: product.itemH5Id}
        ];
        var experts = product.experts;
        var operations = product.operations;
        
        //更新产品内容表
        for(var i in contents){
            if(contents[i].content){
                await db('t_hm101_htmls').update(contents[i])
                .where({id: contents[i].id})
            }
        };
        if(experts){
            await db('t_hm101_product_experts')
                        .where({productId: product.id}).del();
        };
        // 更新产品专家表
        for(var i in experts){
            experts[i].productId = product.id;
            await db('t_hm101_product_experts').insert(experts[i])
                    .where({productId: product.id});
        };
        if(operations){
            await db('t_hm101_product_operations')
                        .where({targetId: product.id}).del();
        };
        // 更新产品运营表
        for(var i in operations){
            operations[i].target = '01';
            operations[i].targetId = product.id;
            await db('t_hm101_product_operations').insert(operations[i])
                .where({targetId: product.id});
        };
        // 插入表时去掉数据中非字段项
        delete product.commentNum;
        delete product.thumbNum;
        delete product.feature;
        delete product.detail;
        delete product.routine;
        delete product.fee;
        delete product.notice;
        delete product.hospital;
        delete product.item;
        delete product.experts;
        delete product.operations;
        delete product.tags;
        delete product.coverPic;
        delete product.createdAt;
        // delete product.updatedAt;
        // 更新产品表
        product.savePro();
    }
    /**
     * 只存储产品本身信息
     * @return {[type]} [description]
     */
    async savePro() {
        try {
            console.log('123');
            // Object.keys(this).forEach(function(param){
            //     // console.log("product attr:"+param);
            //     console.log("product attr-"+param+" is-"+this[param]);
            // })
            return await db('t_hm101_products')
                .update(this)
                .where({ id: this.id });
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }
}
//产品缓存，主要包括产品自身的全属性，对应上面的Pro
class ProductCache{
    static async get(id) {
        
    }
    static async cache(product){

    }
    static async dirty(id){

    }
}
/**
 * 根据文件id数组获取文件对象
 * @param {*} ids 
 */
async function getPictures(ids) {
    try {
        return await FilesQuery(ids);
    } catch (error) {
        console.log(error);
        throw new Error('ERROR');
    }
}
/**
 * 根据文件id数组获取文件对象
 * @param {*} ids 
 */
async function getTags(id) {
    try {
        return await findByPid(id);
    } catch (error) {
        console.log(error);
        throw new Error('ERROR');
    }
}
/**
 * 根据Id获取产品信息
 * @param {*} id 
 */
async function findById(id) {

    let products = await db.select('*').from('t_hm101_products')
                .where({ 'id': id});

    if(products.length == 0) {
        throw new Error("no product:"+id);
    }
    let  product = new Product(products[0]);


    return product;

}
/**
 * 更新并获取帖子观看数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getViews(id,num) {
    try {
        return await db('t_hm101_products')
            .update({viewNum:num})
            .where({ id: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取点赞数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
// async function getThumbs(id) {
//     try {
//         return await db('t_hm101_thumbs')
//             .count('targetId as count')
//             .where({ targetId: id })
//     } catch (error) {
//         console.log(error)
//         throw new Error('ERROR')
//     }
// }

/**
 * 获取评论数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getComments(id) {
    try {
        return await db('t_hm101_comments')
            .count('targetId as count')
            .where({ targetId: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
export { Product, findById }

import db from '../db/db';
import { findByPid } from '../models/Tag';
import {FilesQuery} from '../models/File'
import {Attendant} from './Attendant'
import GoodEstimate from './GoodEstimate'
const func_getThumbs = require('./Thumb').getThumbs
const func_getComments = require('./Comment').getComments
const TARGET = '01'
async function getThumbs(id){
    return await func_getThumbs(id,TARGET);
}
async function getComments(id){
    return await func_getComments(id,TARGET)
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
        this.coverPic = data.coverPic;
        this.coverPicId = data.coverPicId
        this.viewNum = data.viewNum;

        this.hospitalId = data.hospitalId;

        this.experts = data.experts;
        this.operations = data.operations;
        this.tags = data.tags;

        this.category = data.category;
        this.isMainPage = data.isMainPage;


        this.displayUrl = data.displayUrl;

        this.prepayExpiry = data.prepayExpiry;
        this.postpayExpiry = data.postpayExpiry;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
    }
    async allSameNationForAdmin(){
        let dbresult = await db('t_hm101_products').select('id','desc','nation','status',
        'adultPrice','womenPrice','followPrice','childPrice','hospitalId','displayUrl')
        .where({nation:this.nation})
        .whereNot({operateFlag:'D'})
        .orderBy('updatedAt','desc')
        let result = [];
        for(let i = 0 ; i < dbresult.length ; ++i){
            let product = new Product(dbresult[i]);
            result.push(product);
        }
        for(var i in result){
            let product = result[i];
            await product.fillAttendants();
        }
        return result;
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
                                        'coverPicId','adultPrice','womenPrice','followPrice','childPrice','viewNum',
                                        'isMainPage','category','hospitalId','displayUrl')
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
        // let commentNum = await getComments(this.id)
        // this.commentNum = commentNum;

        let commentNum  =  await GoodEstimate.count(TARGET,this.id);
        this.commentNum = commentNum;

    } 
    /**
     * 获取图片
     */
    async fillPictures(){
        this.coverPic = await getPictures([this.coverPicId])
    }
    async fillExperts(){
        this.experts = await db('t_hm101_hospital_experts').select('*')
                .where({'hospitalId': this.hospitalId});
    }
    async fillH5(){
        let db_fields = await db('t_hm101_product_fields').select('name','value')
                .where({target:TARGET,targetId:this.id});
        for(let i = 0 ; i < db_fields.length ; ++i){
            this[db_fields[i].name] = db_fields[i].value
        }
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
    async fillHospital(){
        let [db_hospital] = await db('t_hm101_hospital').select('*').where({id:this.hospitalId});
        this.hospital = db_hospital.desc;
        this.item = db_hospital.items;
    }
    async fillAttendants(){
        this.attendants = await Attendant.all({hospitalId:this.hospitalId})
    }
    /**
     * 获取摘要，外层使用
     */
    async fillBrief(){
        await this.fillThumbsAndCommentsNum();
        await this.fillTags();
        await this.fillOperations();
        await this.fillPictures();
    }
    /**
     * 获取所有详情,连掉上面的,可优化为并行执行?
     */
    async fillFullInfo(){
        await this.fillThumbsAndCommentsNum();
        await this.fillTags();
        await this.fillOperations();
        // await this.fillExperts();
        await this.fillH5();
        await this.fillPictures();
        // await this.fillHospital();
        await this.fillAttendants();
    }
    /**
     * 除开点赞评论的,可优化为并行执行?
     */
    async fillSelf(){
        await this.fillTags();
        await this.fillOperations();
        // await this.fillExperts();
        await this.fillH5();
        await this.fillPictures();
        // await this.fillHospital();
    }
    formatForClient(){
        this.adultPrice = (this.adultPrice/100).toFixed();
        this.childPrice = (this.childPrice/100).toFixed();
        this.womenPrice = (this.womenPrice/100).toFixed();
        this.followPrice = (this.followPrice/100).toFixed();
    }
    // 计算产品折扣价格
    computeDiscount(discount=1){
        this.adultPrice_discount = (this.adultPrice*discount/100).toFixed();
        this.childPrice_discount = (this.childPrice*discount/100).toFixed();
        this.womenPrice_discount = (this.womenPrice*discount/100).toFixed();
        this.followPrice_discount = (this.followPrice*discount/100).toFixed();
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
   
    }
    /**
     * 存储全部产品信息
     * @return {[type]} [description]
     */
    async save() {

    }
    /**
     * 只存储产品本身信息
     * @return {[type]} [description]
     */
    async savePro() {
        
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
        console.error(error);
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
        console.error(error);
        throw new Error('ERROR');
    }
}
/**
 * 根据Id获取产品信息
 * @param {*} id 
 */
async function findById(id,allowNonExist = false) {

    let [products] = await db.select('*').from('t_hm101_products')
                .where({ 'id': id});

    if(!products && ! allowNonExist) {
        throw new Error("no product:"+id);
    }
    if(products){
        let  product = new Product(products);
        return product;
    }

    return null;

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
        console.error(error)
        throw new Error('ERROR')
    }
}



export { Product, findById }

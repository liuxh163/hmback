import db from '../db/db'
import {getH5Content} from './H5Content'
const func_getThumbs = require('./Thumb').getThumbs


const func_getComments = require('./Comment').getComments;

const TARGET = '03'

async function getThumbs(id){
    return await func_getThumbs(id,TARGET);
}

async function getComments(id){
    return await func_getComments(id,TARGET);
}

class Servant {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id;
        this.name = data.name;
        this.desc = data.desc;
        this.picFileId = data.picFileId;
        this.type = data.type;
        this.status = data.status;
        this.nation = data.nation;
        this.introH5Id = data.introH5Id;
        this.carH5Id = data.carH5Id;
        this.car = data.car;
        this.feedescH5Id = data.feedescH5Id;
        this.feedesc = data.feedesc;
        this.intro = data.intro;
        this.literPrice = data.literPrice;
        this.followPrice = data.followPrice;
        this.recepPrice = data.recepPrice;
        this.rank = data.rank;
        this.viewNum = data.viewNum;
        this.thumbNum = data.thumbNum;
        this.commentNum = data.commentNum;
        this.category = data.category;
        this.isMainPage = data.isMainPage;
        this.score = data.score;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
    }

    async all(request) {
        try {
            request.page = request.page || 1;
            request.number = request.number || 10000;
            if(!request.type) request.type = "";
            // 构建查询where条件
            let conditions = {
            //    type:request.type,
                nation:request.nation
            };
            let notConditions = {
                "a.operateFlag":"D"
            };
            // 删除不存在的条件
            Object.keys(conditions).forEach(function(param, index){
                if(undefined === conditions[param]){
                    delete conditions[param];
                }
            });
            let result;
            if("{}" !== JSON.stringify(conditions)){
                result = await db.select('a.*','b.content as intro')
                .from('t_hm101_servants as a')
                .leftJoin('t_hm101_htmls as b','a.introH5Id', 'b.id')
                .where(conditions)
                .whereNot(notConditions)
                .orderBy('a.updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .where('type', 'like', `%${request.type}%`)
                .limit(+request.number)
            }else{
                result = await db.select('a.*','b.content as intro')
                .from('t_hm101_servants as a')
                .leftJoin('t_hm101_htmls as b','a.introH5Id', 'b.id')
                .whereNot(notConditions)
                .orderBy('a.updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .where('type', 'like', `%${request.type}%`)
                .limit(+request.number)
            }
            
            // 获取点赞数及评论数
            for(var i in result){
                result[i].car = await getH5Content(result[i].carH5Id);
                result[i].feedesc =await  getH5Content(result[i].feedescH5Id);
                // 获取点赞数
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum;
            }
            return result;
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 查找指定id服务人员信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    async find(id) {
        try {
            let result = await findById(id)
            if (result) {
                // 增加并获取查看数
                let viewNum = ++result.viewNum
                await getViews(id,viewNum)//更新帖子查看数
                result.viewNum = viewNum
                // 获取点赞数
                let thumbNum = await getThumbs(id)
                result.thumbNum = thumbNum;
                // 获取评论数
                let commentNum = await getComments(id)
                result.commentNum = commentNum;
                // await getComments(id);
            }else{
                return {}
            }

            this.constructor(result)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 存储服务人员信息
     * @return {[type]} [description]
     */
    async store() {
        var servant = this
        servant.createdAt = new Date();
        // 插入表时去掉数据中非字段项
        delete servant.commentNum
        delete servant.thumbNum
        var content = servant.intro
        var carContent = servant.car;
        var feedesc = servant.feedesc;
        delete servant.intro
        delete servant.car
        delete servant.feedesc

        // 使用事务插入帖子信息及内容信息表
        let dbresult = 0;
        await db.transaction(async function(trx) {
            try {
                let x = await trx('t_hm101_htmls').insert({content: content});
                servant.introH5Id = x[0];
                x = await trx('t_hm101_htmls').insert({content: carContent});
                servant.carH5Id = x[0];
                x = await trx('t_hm101_htmls').insert({content: feedesc});
                servant.feedescH5Id = x[0];
                x = await trx('t_hm101_servants').insert(servant);
                dbresult =  x[0];
                return trx.commit();
            } catch (error) {
                console.error(error);
                return trx.rollback(error);
            }
            
        });
        return dbresult;

    }
    /**
     * 更新服务人员信息
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async save() {
        var servant = this
        // 插入post表时去掉数据中非字段项
        delete servant.commentNum
        delete servant.thumbNum

        // servant.updatedAt = new Date();
        // content.operateFlag = servant.operateFlag
        // content.operator = servant.operator

        var content = servant.intro
        var carContent = servant.car;
        var feedesc = servant.feedesc;
        delete servant.intro
        delete servant.car
        delete servant.feedesc
        // 使用事务插入帖子信息及内容信息表
        return await db.transaction(async function(trx) {
            try {
                await trx('t_hm101_htmls').update({content:content})
                    .where({id: servant.introH5Id});
                await trx('t_hm101_htmls').update({content:carContent})
                    .where({id: servant.carH5Id});
                await trx('t_hm101_htmls').update({content:feedesc})
                    .where({id: servant.feedescH5Id});
                await trx('t_hm101_servants').update(servant)
                    .where({id:servant.id});
                return trx.commit();
            } catch (error) {
                console.error(error)
                return trx.rollback(error);
            };  
        });

    }

    async destroy() {
        try {
            return await db('t_hm101_servants')
                .update({operateFlag : 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
}
/**
 * 根据id查找指定服务人员
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function findById(id) {
    try {
        let [servantData] = await db.select('a.*','b.content as intro')
                    .from('t_hm101_servants as a')
                    .leftJoin('t_hm101_htmls as b','a.introH5Id', 'b.id')
                    .where({ 'a.id': id});
        if(servantData){
                servantData.car =await getH5Content(servantData.carH5Id);
                servantData.feedesc =await getH5Content(servantData.feedescH5Id);
        }
        return servantData
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}
/**
 * 更新并获取帖子观看数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getViews(id,num) {
    try {
        return await db('t_hm101_servants')
            .update({viewNum:num})
            .where({ id: id })
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}




export { Servant, findById ,getH5Content}

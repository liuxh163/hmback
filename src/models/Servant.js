import db from '../db/db'
import rand from 'randexp'

class Servant {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.picPath = data.picPath
        this.type = data.type
        this.status = data.status
        this.nation = data.nation
        this.service = data.service
        this.introH5Id = data.introH5Id
        this.intro = data.intro
        this.literPrice = data.literPrice
        this.followPrice = data.followPrice
        this.recepPrice = data.recepPrice
        this.viewNum = data.viewNum
        this.thumbNum = data.thumbNum
        this.commentNum = data.commentNum

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db.select('a.*','b.content as intro')
                .from('t_hm101_servants as a')
                .leftJoin('t_hm101_htmls as b','a.introH5Id', 'b.id')
                .where({ type: request.type, nation: request.nation })
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)

            // 获取点赞数及评论数
            for(var i in result){
                console.log("servant-"+i+":"+result[i])
                // 获取点赞数
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum[0].count;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum[0].count;
            }
        } catch (error) {
            console.log(error)
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
            console.log("check servant :"+result.name)
            if (result) {
                // 增加并获取查看数
                let viewNum = ++result.viewNum
                await getViews(id,viewNum)//更新帖子查看数
                result.viewNum = viewNum
                // 获取点赞数
                let thumbNum = await getThumbs(id)
                result.thumbNum = thumbNum[0].count;
                // 获取评论数
                let commentNum = await getComments(id)
                result.commentNum = commentNum[0].count;
                // await getComments(id);
            }else{
                return {}
            }
            // Object.keys(result).forEach(function(param,index){
            //     console.log("find result attr "+param+" is "+result[param])
            // })
            this.constructor(result)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 存储服务人员信息
     * @return {[type]} [description]
     */
    async store() {
        var servant = this
        // 插入表时去掉数据中非字段项
        delete servant.commentNum
        delete servant.thumbNum
        var content = servant.intro
        delete servant.intro
        // 遍历打印对象内容
        // Object.keys(post).forEach(function(param,index){
        //     console.log("post attr "+param+" is "+post[param])
        // })
        // 使用事务插入帖子信息及内容信息表
        return await db.transaction(function(trx) {
          return db('t_hm101_htmls').insert({content: content}, 'id')
            .transacting(trx)
            .then(function(ids) {
                servant.introH5Id = ids[0];
                return db('t_hm101_servants').insert(servant).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return inserts;
        })
        .catch(function(error) {
            console.log("error is---"+error)
            throw new Error('ERROR')
        });
    }
    /**
     * 更新服务人员信息
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async save(request) {
        var servant = this
        // 插入post表时去掉数据中非字段项
        delete servant.commentNum
        delete servant.thumbNum
        var content = {content:servant.intro}
        content.updatedAt = servant.updatedAt
        content.operateFlag = servant.operateFlag
        content.operator = servant.operator
        delete servant.intro

        // 使用事务插入帖子信息及内容信息表
        return await db.transaction(function(trx) {
          return db('t_hm101_htmls').update(content)
            .transacting(trx)
            .where({id: servant.introH5Id})
            .then(function(ids) {
                console.log("content id is :"+ids[0])
                return db('t_hm101_servants')
                    .update(servant)
                    .transacting(trx)
                    .where({id: servant.id});
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return inserts;
        })
        .catch(function(error) {
            console.log("error is---"+error)
          throw new Error('ERROR')
        });
    }

    async destroy(request) {
        try {
            return await db('t_hm101_servants')
                .update({operateFlag : 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [servantData] = await db.select('a.*','b.content as intro')
                    .from('t_hm101_servants as a')
                    .leftJoin('t_hm101_htmls as b','a.introH5Id', 'b.id')
                    .where({ 'a.id': id});
        return servantData
    } catch (error) {
        console.log(error)
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
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取点赞数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getThumbs(id) {
    try {
        return await db('t_hm101_thumbups')
            .count('targetId as count')
            .where({ targetId: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

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
export { Servant, findById }

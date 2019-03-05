import db from '../db/db'
import dateFormat from 'date-fns/format'
const getUser = require('../models/User').findById
import {getH5Content} from './H5Content'
const func_getThumbs = require('./Thumb').getThumbs
const TARGET = '05'
async function getThumbs(id){
    return await func_getThumbs(id,TARGET);
}
class Comment {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.target = data.target
        this.targetId = data.targetId
        this.contentH5Id = data.contentH5Id
        this.content = data.content
        this.commenterId = data.commenterId
        this.thumbNum = data.thumbNum
        this.commentNum = data.commentNum

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            request.page = request.page || 1;
            request.number = request.number || 10000;
            // 构建查询where条件
            let conditions = {
                target: request.target,
                targetId: request.targetId
            };
            let notConditions = {
                "operateFlag":"D"
            };
            // 删除不存在的条件
            Object.keys(conditions).forEach(function(param, index){
                if(undefined === conditions[param]){
                    delete conditions[param];
                }
            });
            let result;
            if("{}" !== JSON.stringify(conditions)){
                result = await db('t_hm101_comments').select('*')
                // result = await db.select('a.*','b.content as comment')
                // .from('t_hm101_comments as a')
                // .leftJoin('t_hm101_htmls as b','a.contentH5Id', 'b.id')
                .where(conditions)
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)
            }else{
                result = await db('t_hm101_comments').select('*')
                // result = await db.select('a.*','b.content as comment')
                // .from('t_hm101_comments as a')
                // .leftJoin('t_hm101_htmls as b','a.contentH5Id', 'b.id')
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)
            }
            let comments = [];
            // 获取点赞数及评论数
            for(var i in result){
                // 获取点赞数
                result[i].content = await getH5Content(result[i].contentH5Id);
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum;

                let comment = new Comment(result[i]);
                comments.push(comment);
            }
            return comments;
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
            console.debug("check comment :"+result.name)
            if (result) {
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
     * 插入新评论内容
     * @return {[type]} [description]
     */
    async store() {
        var comment = this
        // 插入表时去掉数据中非字段项
        delete comment.commentNum
        delete comment.thumbNum
        var content = comment.content
        delete comment.content
        comment.createdAt = new Date();

        // 使用事务插入帖子信息及内容信息表
        return await db.transaction(function(trx) {
          return db('t_hm101_htmls').insert({content: content}, 'id')
            .transacting(trx)
            .then(function(ids) {
                comment.contentH5Id = ids[0];
                return db('t_hm101_comments').insert(comment).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return inserts;
        })
        .catch(function(error) {
            console.error(error)
            throw new Error('ERROR')
        });
    }

    async save(request) {
        var comment = this
        // 插入post表时去掉数据中非字段项
        delete comment.commentNum
        delete comment.thumbNum
        var content = {content:comment.content}
        content.updatedAt = comment.updatedAt
        content.operateFlag = comment.operateFlag
        content.operator = comment.operator
        delete comment.content


        // 使用事务插入帖子信息及内容信息表
        return await db.transaction(function(trx) {
          return db('t_hm101_htmls').update(content)
            .transacting(trx)
            .where({id: comment.contentH5Id})
            .then(function(ids) {
                console.debug("content id is :"+ids[0])
                return db('t_hm101_comments')
                    .update(comment)
                    .transacting(trx)
                    .where({id: comment.id});
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return inserts;
        })
        .catch(function(error) {
            console.error("error is---"+error)
          throw new Error('ERROR')
        });
    }

    async destroy(request) {
        try {
            return await db('t_hm101_comments')
                .update({operateFlag : 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async formatForClient(){
        let date = new Date(this.createdAt);
        this.createdAt = dateFormat(new Date(this.createdAt), 'YYYY-MM-DD HH:mm:ss');
        let curUser = await getUser(this.commenterId);
        this.iconPath = curUser.iconPath;
        this.userName = curUser.userName;
    }
}
/**
 * 根据指定id查找评论信息
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function findById(id) {
    try {
        let [commentData] = await db('t_hm101_comments').select('*')
                    .where({ id: id});
        let comment = new Comment(commentData);
        comment.content = await getH5Content(comment.contentH5Id);
        // 获取点赞数
        let thumbNum = await getThumbs(comment.id)
        comment.thumbNum = thumbNum;
        // 获取评论数
        let commentNum = await getComments(comment.id)
        comment.commentNum = commentNum;
        return comment;
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}


/**
 * 获取评论数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getComments(id,target=TARGET) {
    let rows = await db('t_hm101_comments')
        .count('targetId as count')
        .where({ targetId: id ,target:target})

    return parseInt(rows[0].count);

}

export { Comment ,findById,getComments}

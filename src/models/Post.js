import db from '../db/db'
import { FilesQuery } from '../models/File'

class Post {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.topicId = data.topicId
        this.title = data.title
        this.content = data.content
        this.picIds = data.picIds
        this.posterId = data.posterId
        this.pictures = data.pictures
        this.viewNum = data.viewNum
        this.thumbNum = data.thumbNum
        this.commentNum = data.commentNum
        this.location = data.location

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
    /**
     * 查询所有符合条件的帖子列表
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async all(request) {
        try {
            request.page = request.page || 1;
            request.number = request.number || 10000;
            // 构建查询where条件
            let conditions = {
                topicId:request.topicId
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
            let result 
            if("{}" !== JSON.stringify(conditions)){
                result = await db('t_hm101_posts').select('*')
                .where(conditions)
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)
            }else{
                result = await db('t_hm101_posts').select('*')
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)
            }
            // 获取帖子点赞数及评论数
            for(var i in result){
                console.log("post-"+i+":"+result[i])
                // 获取点赞数
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum[0].count;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum[0].count;
            }
            // 获取帖子图片
            for(var i in result){
                console.log("post-"+i+":"+result[i])
                let pics = result[i].picIds.split(",");
                // 获取帖子图片集合
                result[i].pictures = await getPictures(pics);
            }
            return result
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 根据id查找帖子
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
     * 存储帖子信息
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    async store() {
        var post = this
        // 插入post表时去掉数据中非字段项
        delete post.commentNum;
        delete post.thumbNum;
        // 遍历打印对象内容
        // Object.keys(post).forEach(function(param,index){
        //     console.log("post attr "+param+" is "+post[param])
        // })
        return await db('t_hm101_posts').insert(post);
        // 使用事务插入帖子信息及内容信息表
        // return await db.transaction(function(trx) {
        //   return db('t_hm101_htmls').insert({content: content}, 'id')
        //     .transacting(trx)
        //     .then(function(ids) {
        //         console.log("content id is :"+ids[0])
        //         post.contentH5Id = ids[0];
        //         return db('t_hm101_posts').insert(post).transacting(trx);
        //     })
        //     .then(trx.commit)
        //     .catch(trx.rollback);
        // })
        // .then(function(inserts) {
        //     return inserts;
        // })
        // .catch(function(error) {
        //     console.log("error is---"+error)
        //   throw new Error('ERROR')
        // });
    }
    /**
     * 更新帖子相关信息
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async save(request) {
        var post = this
        // 插入post表时去掉数据中非字段项
        delete post.commentNum;
        delete post.thumbNum;
        // var content = {content:post.content}
        // content.updatedAt = post.updatedAt
        // content.operateFlag = post.operateFlag
        // content.operator = post.posterId
        // delete post.content
        // 遍历打印对象内容
        // Object.keys(content).forEach(function(param,index){
        //     console.log("content attr "+param+" is "+content[param])
        // })
        // Object.keys(post).forEach(function(param,index){
        //     console.log("post attr "+param+" is "+post[param])
        // })
        return db('t_hm101_posts').update(post).where({id: post.id});
        // 使用事务插入帖子信息及内容信息表
        // return await db.transaction(function(trx) {
        //   return db('t_hm101_htmls').update(content)
        //     .transacting(trx)
        //     .where({id: post.contentH5Id})
        //     .then(function(ids) {
        //         console.log("content id is :"+ids[0])
        //         return db('t_hm101_posts')
        //             .update(post)
        //             .transacting(trx)
        //             .where({id: post.id});
        //     })
        //     .then(trx.commit)
        //     .catch(trx.rollback);
        // })
        // .then(function(inserts) {
        //     return inserts;
        // })
        // .catch(function(error) {
        //     console.log("error is---"+error)
        //   throw new Error('ERROR')
        // });
    }
    /**
     * 删除指定的帖子
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async destroy(request) {
        try {
            return await db('t_hm101_posts')
                .update({operateFlag : 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}
/**
 * 通过Id查找帖子详细信息
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function findById(id) {
    try {
        let [result] = await db('t_hm101_posts').select('*')
                    .where({ 'id': id});
        // Object.keys(result).forEach(function(param,index){
        //     console.log("return post attr "+param+" is "+result[param])
        // })
        return result
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
        return await db('t_hm101_posts')
            .update({viewNum:num})
            .where({ id: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取帖子点赞数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getThumbs(id) {
    try {
        return await db('t_hm101_thumbs')
            .count('targetId as count')
            .where({ targetId: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取帖子评论数
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
/**
 * 根据文件id数组获取文件对象
 * @param {*} ids 
 */
async function getPictures(ids) {
    try {
        return await FilesQuery(ids);
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
getPictures
async function findByUserAndTopic(userId,topicId){
    let condation = {
        posterId:userId,
        topicId:topicId
    }
    let db_posts =await db('t_hm101_posts').select('id').where(condation);
    let posts = [];
    for(let i = 0 ; i < db_posts.length ; ++i){
        let post = new Post;
        await post.find(db_posts[i].id);
        posts.push(post);
    }
    console.log(posts)
    return posts;
}

async function getThumbNumAndCommentNumForUser(userId){
    let db_posts =await db('t_hm101_posts').select('id').where({posterId:userId});
    let thumbNum = 0;
    let commentNum = 0;
    for(let i = 0 ; i < db_posts.length ; ++i){
        thumbNum +=await getThumbs(db_posts[i].id)[0].count;
        commentNum +=await getComments(db_posts[i].id[0].count);
    }
    return {
        thumbNum:thumbNum,
        commentNum:commentNum
    }
}
export { Post, findById,findByUserAndTopic ,getThumbNumAndCommentNumForUser}

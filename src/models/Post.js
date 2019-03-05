import db from '../db/db'
import { FilesQuery } from '../models/File'
const func_getThumbs = require('./Thumb').getThumbs
const func_getComments = require('./Comment').getComments
const TARGET = '02'
async function getThumbs(id){
    return await func_getThumbs(id,TARGET);
}
async function getComments(id){
    return await func_getComments(id,TARGET);
}
class Post {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id;
        this.topicId = data.topicId;
        this.title = data.title;
        this.content = data.content;
        this.picIds = data.picIds;
        this.posterId = data.posterId;
        this.pictures = data.pictures;
        this.viewNum = data.viewNum;
        this.thumbNum = data.thumbNum;
        this.commentNum = data.commentNum;
        this.location = data.location;
        this.category = data.category;
        this.isMainPage = data.isMainPage;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
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
                topicId: request.topicId,
                isMainPage: request.isMainPage
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
                console.debug("post-"+i+":"+result[i])
                // 获取点赞数
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum;

                // 获取帖子图片
                console.debug("post-"+i+":"+result[i]);
                let pics = undefined;
                if(result[i].picIds){
                    pics = result[i].picIds.split(",");
                    // 获取帖子图片集合
                    result[i].pictures = await getPictures(pics);
                }else{
                    result[i].pictures = [];
                };
            }
            
            return result
        } catch (error) {
            console.error(error)
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
                result.thumbNum = thumbNum;
                // 获取评论数
                let commentNum = await getComments(id)
                result.commentNum = commentNum;

                let pics = undefined;
                if(result.picIds){
                    pics = result.picIds.split(",");
                    // 获取帖子图片集合
                    result.pictures = await getPictures(pics);
                }else{
                    result.pictures = [];
                };
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
     * 存储帖子信息
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    async store() {
        var post = this
        // 插入post表时去掉数据中非字段项
        delete post.commentNum;
        delete post.thumbNum;
        delete post.pictures;

        return await db('t_hm101_posts').insert(post);

    }
    /**
     * 更新帖子相关信息
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async save() {
        var post = this
        // 插入post表时去掉数据中非字段项
        delete post.commentNum;
        delete post.thumbNum;
        delete post.pictures;

        return db('t_hm101_posts').update(post).where({id: post.id});

    }
    /**
     * 删除指定的帖子
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    async destroy() {
        try {
            return await db('t_hm101_posts')
                .update({operateFlag : 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
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

        return result
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
        return await db('t_hm101_posts')
            .update({viewNum:num})
            .where({ id: id })
    } catch (error) {
        console.error(error)
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
        console.error(error)
        throw new Error('ERROR')
    }
}

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
    return posts;
}

async function getThumbNumAndCommentNumForUser(userId){
    let db_posts = await db('t_hm101_posts').select('id').where({posterId:userId});
    let thumbNum = 0;
    let commentNum = 0;
    for(let i = 0 ; i < db_posts.length ; ++i){
        let db_response = await getThumbs(db_posts[i].id);
        thumbNum += db_response;
        db_response = await getComments(db_posts[i].id);
        commentNum += db_response;
    }
    return {
        thumbNum:thumbNum,
        commentNum:commentNum
    }
}
export { Post, findById,findByUserAndTopic ,getThumbNumAndCommentNumForUser}

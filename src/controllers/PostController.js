import dateFormat from 'date-fns/format'

import { User, findById } from '../models/User'
import { Post,findByUserAndTopic } from '../models/Post'

class PostController {
    async index(ctx) {
        const query = ctx.query
        const params = ctx.params

        query.topicId = params.id
        //Attach logged in user
        const curUser = ctx.state.user;
        const post = new Post()

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //Get paginated list of posts
        try {
            let result = await post.all(query);
            // TODO获取发帖人昵称和头像
            for(var i in result){
                var tmp = await findById(result[i].posterId);
                result[i].userName = tmp.userName;
                result[i].iconPath = tmp.iconPath;
            }
            ctx.body = {posts:result}
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async show(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Initialize post
        const post = new Post()

        try {
            //Find and show post
            await post.find(params.id)
            ctx.body = post
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 发帖
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const request = ctx.request.body
        const params = ctx.params
        request.topicId = params.id;
        //Attach logged in user
        const curUser = ctx.state.user;
        request.posterId = curUser.id

        var post = new Post(request)
        post.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        post.operator = curUser.id

        try {
            let result = await post.store()
            ctx.body = { id: result[0] }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    /**
     * 修改帖子内容
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a post
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that post
        const post = new Post()
        await post.find(params.id)
        if (!post) ctx.throw(400, 'INVALID_DATA')

        //判断操作用户是否发帖人，不是发帖人不允许更新
        const curUser = new User(ctx.state.user)
        if (post.posterId !== curUser.id) ctx.throw(400, 'INVALID_OPERATOR')
        // Object.keys(post).forEach(function(param,index){
        //     console.log("controller1 post attr "+param+" is "+post[param])
        // })
        //Add the updated date value
        post.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        post.operateFlag = 'U'
        post.operator = curUser.id

        //Replace the post data with the new updated post data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            post[parameter] = request[parameter]
        })
        // Object.keys(post).forEach(function(param,index){
        //     console.log("controller2 post attr "+param+" is "+post[param])
        // })
        try {
            await post.save()
            ctx.body = { id: post.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that post
        const post = new Post()
        await post.find(params.id)
        if (!post.id) ctx.throw(400, 'INVALID_DATA');

        // console.log("post object "+Object.keys(post))
        // // 遍历打印对象内容
        // Object.keys(post).forEach(function(param,index){
        //     console.log("post attr "+param+" is "+post[param])
        // })
        //判断操作用户是否发帖人，不是发帖人不允许删除
        const user = new User(ctx.state.user)
        if (post.posterId !== user.id) ctx.throw(400, 'INVALID_POSTER');

        try {
            await post.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
    async mine(ctx){
        console.log('ccvvv')
        let x = await findByUserAndTopic(ctx.state.user.id,ctx.query.topicId);
        console.log('ccvvv')
        console.log(x);
        ctx.body = x;
    }
}

export default PostController

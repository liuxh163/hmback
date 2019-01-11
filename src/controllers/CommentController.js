import dateFormat from 'date-fns/format'

import { User } from '../models/User'
import { Comment } from '../models/Comment'

class CommentController {
    /**
     * 查询指定对象的评论，支持分页
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async index(ctx) {
        const query = ctx.query

        const comment = new Comment()

        //检测查询参数
        if (query.page&&!query.number) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }
        if (query.target&&!query.targetId) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //获取分页列表
        try {
            let result = await comment.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }
    /**
     * 针对特定对象发表评论
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    async create(ctx) {
        const query = ctx.query
        const request = ctx.request.body

        //Attach logged in user
        const curUser = new User(ctx.state.user)
        request.commenterId = curUser.id
        request.operator = curUser.id

        const comment = new Comment(request)

        comment.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        //Replace the servant data with the new updated servant data
        Object.keys(query).forEach(function(parameter, index) {
            comment[parameter] = query[parameter]
        })

        try {
            let result = await comment.store()
            ctx.body = { id: result[0] }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async update(ctx) {
        const params = ctx.params
        const request = ctx.request.body

        //Make sure they've specified a note
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find and set that comment
        const comment = new Comment()
        await comment.find(params.id)
        if (!comment) ctx.throw(400, 'INVALID_COMMENT_DATA')

        //检查是否当前评论人
        const curUser = new User(ctx.state.user)
        if (comment.commenterId !== curUser.id) ctx.throw(400, 'INVALID_OPERATOR')

        //Add the updated date value
        comment.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        comment.operateFlag = 'U'
        comment.operator = curUser.id

        //Replace the comment data with the new updated comment data
        Object.keys(request).forEach(function(parameter, index) {
            comment[parameter] = request[parameter]
        })

        // Object.keys(comment).forEach(function(param,index){
        //     console.log("controller update attr "+param+" is "+comment[param])
        // })
        try {
            await comment.save()
            ctx.body = { id: comment.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that comment
        const comment = new Comment()
        await comment.find(params.id)
        if (!comment) ctx.throw(400, 'INVALID_DATA')

        //检查是否当前评论人
        const curUser = new User(ctx.state.user)
        if (comment.commenterId !== curUser.id) ctx.throw(400, 'INVALID_DATA')

        try {
            await comment.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default CommentController

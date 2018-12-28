import dateFormat from 'date-fns/format'

import { User } from '../models/User'
import { Comment } from '../models/Comment'
import { H5content } from '../models/H5content'

class CommentController {
    async index(ctx) {
        const query = ctx.query

        const comment = new Comment()

        //检查查询参数
        if (!query.pages || !query.pageNum) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
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

    async create(ctx) {
        const request = ctx.request.body

        //Attach logged in user
        const user = new User(ctx.state.user)
        request.commenterId = user.id

        const comment = new Comment(request)

        // 插入h5内容
        const h5Content = new H5content();
        h5Content.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        h5Content.content = request.content;
        await h5Content.store();

        try {
            let result = await comment.store()
            ctx.body = { id: result.id }
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
        if (!comment) ctx.throw(400, 'INVALID_DATA')

        // 更新h5内容
        const h5Content = new H5content();
        await h5Content.find(comment.contentH5Id);
        if (!content) ctx.throw(400, 'INVALID_DATA');
        h5Content.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        h5Content.content = request.content;
        await h5Content.save();


        //检查是否当前评论人
        const user = new User(ctx.state.user)
        if (comment.commenterId !== user.id) ctx.throw(400, 'INVALID_DATA')

        //Add the updated date value
        comment.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')

        //Replace the comment data with the new updated comment data
        Object.keys(ctx.request.body).forEach(function(parameter, index) {
            comment[parameter] = request[parameter]
        })

        try {
            await comment.save()
            ctx.body = { id: result.id }
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
        const user = new User(ctx.state.user)
        if (comment.commenterId !== user.id) ctx.throw(400, 'INVALID_DATA')

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

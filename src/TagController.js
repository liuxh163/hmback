import dateFormat from 'date-fns/format'

import { Tag } from '../models/Tag'

class TagController {
    async index(ctx) {
        const query = ctx.query

        const tag = new Tag()

        if (!query.target || !query.targetId) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of tags
        try {
            let result = await tag.all(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const request = ctx.request.body

        const tag = new Tag(request)

        try {
            let result = await tag.store()
            ctx.body = { id: result }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_DATA')

        //Find that tag
        const tag = new Tag()
        await tag.find(params.id)
        if (!tag) ctx.throw(400, 'INVALID_DATA')

        //只能删除自己打的标签
        const user = new User(ctx.state.user)
        if (tag.targerId !== user.id) ctx.throw(400, 'INVALID_DATA')

        try {
            await tag.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default TagController

import dateFormat from 'date-fns/format'

import { User } from '../models/User'
import { Tag } from '../models/Tag'

class TagController {
    async index(ctx) {
        const query = ctx.query

        const tag = new Tag()

        if (!query.target || !query.targetId) {
            ctx.throw(400, 'INVALID_QUERY_PARAMS')
        }

        //Get paginated list of tags
        try {
            let result = await tag.all(query)
            ctx.body = {tags:result}
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async create(ctx) {
        const query = ctx.query

        if (!query.target || !query.targetId) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        const request = ctx.request.body

        const curUser = ctx.state.user

        const tag = new Tag(request)

        tag.target = query.target
        tag.targetId = query.targetId
        tag.tagerId = curUser.id
        tag.operator = curUser.id

        try {
            let result = await tag.store()
            ctx.body = { id: result[0] }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async delete(ctx) {
        const params = ctx.params
        if (!params.id) ctx.throw(400, 'INVALID_TAGID_DATA')

        //Find that tag
        const tag = new Tag()
        await tag.find(params.id)
        if (!tag.id) ctx.throw(400, 'INVALID_TAG_DATA')

        //只能删除自己打的标签
        const curUser = new User(ctx.state.user)

        if (tag.tagerId !== curUser.id) ctx.throw(400, 'INVALID_USER_DATA')

        //Add the updated date value
        tag.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        tag.operator = curUser.id

        try {
            await tag.destroy()
            ctx.body = { id: params.id }
        } catch (error) {
            console.error(error)
            ctx.throw(400, 'INVALID_DATA')
        }
    }
}

export default TagController

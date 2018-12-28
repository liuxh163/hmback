import dateFormat from 'date-fns/format'

import { Thumb } from '../models/Thumb'

class ThumbController {
    async count(ctx) {
        const query = ctx.query

        const thumb = new Thumb()

        if (!query.target || !query.targetId) {
            ctx.throw(400, 'INVALID_ROUTE_OPTIONS')
        }

        //Get paginated list of thumbs
        try {
            let result = await thumb.count(query)
            ctx.body = result
        } catch (error) {
            console.log(error)
            ctx.throw(400, 'INVALID_DATA' + error)
        }
    }

    async toggle(ctx) {
        const request = ctx.request.body

        if (!request.target || !request.targetId) ctx.throw(400, 'INVALID_DATA');

        request.likerId = ctx.state.user.id;

        const thumb = new Thumb()
        await thumb.find(request)
        if (!thumb){
            try {
                let result = await thumb.store()
                ctx.body = { id: result }
            } catch (error) {
                console.log(error)
                ctx.throw(400, 'INVALID_DATA')
            }
        }else{
            try {
                await thumb.destroy()
                ctx.body = { id: thumb.id }
            } catch (error) {
                console.log(error)
                ctx.throw(400, 'INVALID_DATA')
            }
        }
    }
}

export default ThumbController

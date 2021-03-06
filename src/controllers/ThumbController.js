import dateFormat from 'date-fns/format'

import { Thumb } from '../models/Thumb'

class ThumbController {

    async toggle(ctx) {
        const request = ctx.request.body

        if (request.target && !request.targetId){
            ctx.throw(400, 'INVALID_QUERY_PARAMS');
        }
        const curUser = ctx.state.user
        request.likerId = curUser.id;


        const thumb = new Thumb()
        await thumb.find(request)
        thumb.updatedAt = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        thumb.operator = curUser.id


        // 没有点过赞
        if (!thumb.status){
            //Replace the data
            Object.keys(request).forEach(function(parameter, index) {
                thumb[parameter] = request[parameter]
            })

                thumb.status = '01';
            try {
                let result = await thumb.store()
                ctx.body = { id: result[0] }
            } catch (error) {
                console.error(error)
                ctx.throw(400, 'INVALID_DATA')
            }
        }else{
            thumb.operateFlag = 'U'
            // 设置状态
            if('01' === thumb.status){
                thumb.status = '02'
            }else{
                thumb.status = '01'
            }
            // 更新点赞信息
            try {
                await thumb.save()
            } catch (error) {
                console.error(error)
                ctx.throw(400, 'INVALID_DATA')
            }
            ctx.body = { id: thumb.id }
        }

    }
}

export default ThumbController

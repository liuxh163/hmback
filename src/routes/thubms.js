import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import ThumbController from '../controllers/ThumbController'

const router = new Router()
const tokenMw = RdsToken()

const thumbController = new ThumbController()
// 点赞/取消
router.put('/api/v1/thumbs', tokenMw, async (ctx, next) => {
    await thumbController.toggle(ctx)
})

export default router

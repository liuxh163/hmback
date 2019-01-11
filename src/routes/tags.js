import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import TagController from '../controllers/TagController'

const router = new Router()
const tokenMw = RdsToken()

const tagController = new TagController()
// 打标签
router.post('/api/v1/tags', tokenMw, async (ctx, next) => {
    await tagController.create(ctx)
})
// 查询标签
router.get('/api/v1/tags', tokenMw, async (ctx, next) => {
    await tagController.index(ctx)
})
// 删除标签
router.delete('/api/v1/tags/:id', tokenMw, async (ctx, next) => {
    await tagController.delete(ctx)
})

export default router

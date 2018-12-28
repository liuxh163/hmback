import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import ExpertController from '../controllers/ExpertController'

const router = new Router()
const tokenMw = RdsToken()

const expertController = new ExpertController()
// 获取产品专家列表
router.get('/v1/product/:id/experts', tokenMw, async (ctx, next) => {
    await expertController.index(ctx)
})
// 新增专家
router.post('/v1/product/:id/experts', tokenMw, async (ctx, next) => {
    await expertController.create(ctx)
})
// 修改专家信息
router.put('/v1/experts/:id', tokenMw, async (ctx, next) => {
    await expertController.update(ctx)
})
// 删除专家信息
router.delete('/修改专家信息', tokenMw, async (ctx, next) => {
    await expertController.delete(ctx)
})

export default router

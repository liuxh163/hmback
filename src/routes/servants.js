import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import ServantController from '../controllers/ServantController'

const router = new Router()
const tokenMw = RdsToken()

const servantController = new ServantController()
// 获取服务人员列表
router.get('/api/v1/servants', tokenMw, async (ctx, next) => {
    await servantController.index(ctx)
})
// 创建新服务人员
router.post('/api/v1/servants', tokenMw, async (ctx, next) => {
    await servantController.create(ctx)
})
// 获取服务人员详情
router.get('/api/v1/servants/:id', tokenMw, async (ctx, next) => {
    await servantController.show(ctx)
})
// 修改服务人员信息
router.put('/api/v1/servants/:id', tokenMw, async (ctx, next) => {
    await servantController.update(ctx)
})
// 停用渠道信息
router.put('/api/v1/servants/:id/halt', tokenMw, async (ctx, next) => {
    await servantController.halt(ctx)
})
// 启用渠道信息
router.put('/api/v1/servants/:id/awaken', tokenMw, async (ctx, next) => {
    await servantController.awaken(ctx)
})

export default router

import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import AttendantController from '../controllers/AttendantController'

const router = new Router()
const tokenMw = RdsToken()

const attendantController = new AttendantController()
// 获取所有附加项列表
router.get('/api/v1/attendants', tokenMw, async (ctx, next) => {
    await attendantController.index(ctx)
})
// 新建产品附加项
router.post('/api/v1/attendants', tokenMw, async (ctx, next) => {
    await attendantController.create(ctx)
})
// 更新产品附加项
router.put('/api/v1/attendants/:id', tokenMw, async (ctx, next) => {
    await attendantController.update(ctx)
})
// 停用产品附加项
router.put('/api/v1/attendants/:id/halt', tokenMw, async (ctx, next) => {
    await attendantController.halt(ctx)
})
// 启用产品附加项
router.put('/api/v1/attendants/:id/awaken', tokenMw, async (ctx, next) => {
    await attendantController.awaken(ctx)
})
export default router

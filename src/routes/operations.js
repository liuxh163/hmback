import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import OperationController from '../controllers/OperationController'

const router = new Router()
const tokenMw = RdsToken()

const operationController = new OperationController()
// 查看运营
router.get('/api/v1/products/:id/operations', tokenMw, async (ctx, next) => {
    await operationController.index(ctx)
})
// 新增运营
router.post('/api/v1/products/:id/operations', tokenMw, async (ctx, next) => {
    await operationController.create(ctx)
})
// 更新运营
router.put('/api/v1/operations/:id', tokenMw, async (ctx, next) => {
    await operationController.update(ctx)
})
// 删除运营
router.delete('/api/v1/operations/:id', tokenMw, async (ctx, next) => {
    await operationController.delete(ctx)
})
export default router

import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import OrderController from '../controllers/OrderController'

const router = new Router()
const tokenMw = RdsToken()

const orderController = new OrderController()
// 查询订单，支持不同排序方法，支持分页
router.get('/api/v1/orders', tokenMw, async (ctx, next) => {
    await orderController.index(ctx)
})
// 下订单
router.post('/api/v1/orders', tokenMw, async (ctx, next) => {
    await orderController.create(ctx)
})
// 取消订单
router.put('/api/v1/orders/:id/withdraw', tokenMw, async (ctx, next) => {
    await orderController.show(ctx)
})
// 订单支付
router.put('/api/v1/orders/:id/pay', tokenMw, async (ctx, next) => {
    await orderController.halt(ctx)
})
// 修改订单
router.put('/api/v1/orders/:id', tokenMw, async (ctx, next) => {
    await orderController.update(ctx)
})

export default router

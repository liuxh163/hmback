import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import OrderController from '../controllers/OrderController'
import PayController from '../controllers/PayController'
const router = new Router()
const tokenMw = RdsToken()
// const tokenMw = async (ctx,next)=>{
//     ctx.state.user = {
//         id:1
//     }
//     return next();
// }
const orderController = new OrderController()
const payController = new PayController()
// 查询订单，支持不同排序方法，支持分页

router.get('/api/v1/orders', tokenMw, async (ctx, next) => {
    await orderController.index(ctx)
})
// 下产品订单
router.post('/api/v1/orders/product', tokenMw, async (ctx, next) => {
    await orderController.productOrder(ctx)
})
// 取消订单
router.post('/api/v1/orders/withdraw', tokenMw, async (ctx, next) => {
    await orderController.withdraw(ctx)
})
// 订单支付
router.post('/api/v1/orders/wxpay', tokenMw, async (ctx, next) => {
    await payController.wx_pay(ctx);
})

//支付通知
router.post('/api/v1/orders/wx_notify', async (ctx, next) => {
    await payController.wx_notify(ctx);
})
router.post('/api/v1/orders/wxpay', tokenMw, async (ctx, next) => {
    await payController.wx_pay(ctx);
})
// 修改订单
router.put('/api/v1/orders/:id', tokenMw, async (ctx, next) => {
    await orderController.update(ctx)
})
//查询订单 详情
router.get('/api/v1/orders/getOrderFullInfo',tokenMw,async(ctx,next)=>{
    await orderController.getOrderFullInfo(ctx);
})
export default router

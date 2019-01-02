import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import ProductController from '../controllers/ProductController'

const router = new Router()
const tokenMw = RdsToken()

const productController = new ProductController()
// 获取指定国家产品，支持不同排序方法，支持分页
router.get('/api/v1/products', tokenMw, async (ctx, next) => {
    await productController.index(ctx)
})
// 新增产品
router.post('/api/v1/products', tokenMw, async (ctx, next) => {
    await productController.create(ctx)
})
// 查看指定产品
router.get('/api/v1/products/:id', tokenMw, async (ctx, next) => {
    await productController.show(ctx)
})
// 更新指定产品
router.put('/api/v1/products/:id', tokenMw, async (ctx, next) => {
    await productController.update(ctx)
})
// 删除指定产品
router.delete('/api/v1/products/:id', tokenMw, async (ctx, next) => {
    await productController.delete(ctx)
})
// 停用产品信息
router.put('/api/v1/products/:id/halt', tokenMw, async (ctx, next) => {
    await productController.halt(ctx)
})
// 启用产品信息
router.put('/api/v1/products/:id/awaken', tokenMw, async (ctx, next) => {
    await productController.awaken(ctx)
})
export default router

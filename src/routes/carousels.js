import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import CarouselController from '../controllers/CarouselController'

const router = new Router()
const tokenMw = RdsToken()

const carouselController = new CarouselController()
// 查询轮播图
router.get('/v1/carousels/{?location=01,productId=p11}', tokenMw, async (ctx, next) => {
    await carouselController.index(ctx)
})
// 新建轮播图
router.post('/v1/carousels', tokenMw, async (ctx, next) => {
    await carouselController.create(ctx)
})

// 更新轮播图
router.put('/v1/carousels/:id', tokenMw, async (ctx, next) => {
    await carouselController.update(ctx)
})
// 停用轮播图
router.put('/v1/carousels/:id/halt', tokenMw, async (ctx, next) => {
    await carouselController.halt(ctx)
})
// 启用轮播图
router.put('/v1/carousels/:id/awaken', tokenMw, async (ctx, next) => {
    await carouselController.awaken(ctx)
})
// 删除轮播图
router.delete('/v1/carousels/:id', tokenMw, async (ctx, next) => {
    await carouselController.delete(ctx)
})

export default router

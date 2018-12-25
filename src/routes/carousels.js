import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import CarouselController from '../controllers/CarouselController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const carouselController = new CarouselController()

router.get('/api/v1/carousels', jwtMiddleware, async (ctx, next) => {
    await carouselController.index(ctx)
})

router.post('/api/v1/carousels', jwtMiddleware, async (ctx, next) => {
    await carouselController.create(ctx)
})

router.get('/api/v1/carousels/:id', jwtMiddleware, async (ctx, next) => {
    await carouselController.show(ctx)
})

router.put('/api/v1/carousels/:id', jwtMiddleware, async (ctx, next) => {
    await carouselController.update(ctx)
})

router.delete('/api/v1/carousels/:id', jwtMiddleware, async (ctx, next) => {
    await controller.delete(ctx)
})

export default router

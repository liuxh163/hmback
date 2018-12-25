import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import ServantController from '../controllers/ServantController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const servantController = new ServantController()

router.get('/api/v1/translators', jwtMiddleware, async (ctx, next) => {
    await servantController.index(ctx)
})

router.post('/api/v1/translators', jwtMiddleware, async (ctx, next) => {
    await servantController.create(ctx)
})

router.get('/api/v1/translators/:id', jwtMiddleware, async (ctx, next) => {
    await servantController.show(ctx)
})

router.put('/api/v1/translators/:id', jwtMiddleware, async (ctx, next) => {
    await servantController.update(ctx)
})

router.delete('/api/v1/translators/:id', jwtMiddleware, async (ctx, next) => {
    await servantController.delete(ctx)
})

export default router

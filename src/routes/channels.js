import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import ChannelController from '../controllers/ChannelController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const channelController = new ChannelController()

router.get('/api/v1/channels', jwtMiddleware, async (ctx, next) => {
    await channelController.index(ctx)
})

router.post('/api/v1/channels', jwtMiddleware, async (ctx, next) => {
    await channelController.create(ctx)
})

router.get('/api/v1/channels/:id', jwtMiddleware, async (ctx, next) => {
    await channelController.show(ctx)
})

router.put('/api/v1/channels/:id', jwtMiddleware, async (ctx, next) => {
    await channelController.update(ctx)
})

router.delete('/api/v1/channels/:id', jwtMiddleware, async (ctx, next) => {
    await channelController.delete(ctx)
})

export default router

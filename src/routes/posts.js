import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import PostController from '../controllers/PostController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const postController = new PostController()

router.get('/api/v1/topics/:id/posts', jwtMiddleware, async (ctx, next) => {
    await postController.index(ctx)
})

router.post('/api/v1/topics/:id/posts', jwtMiddleware, async (ctx, next) => {
    await postController.create(ctx)
})

router.get('/api/v1/topics/:id/posts/:id', jwtMiddleware, async (ctx, next) => {
    await postController.show(ctx)
})

router.put('/api/v1/topics/:id/posts/:id', jwtMiddleware, async (ctx, next) => {
    await postController.update(ctx)
})

router.delete('/api/v1/topics/:id/posts/:id', jwtMiddleware, async (ctx, next) => {
    await postController.delete(ctx)
})

export default router

import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import CommentController from '../controllers/CommentController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const commentController = new CommentController()

router.get('/api/v1/topics/:id/posts/:id/comments', jwtMiddleware, async (ctx, next) => {
    await commentController.index(ctx)
})

router.post('/api/v1/topics/:id/posts/:id/comments', jwtMiddleware, async (ctx, next) => {
    await commentController.create(ctx)
})

router.get('/api/v1/topics/:id/posts/:id/comments/:id', jwtMiddleware, async (ctx, next) => {
    await commentController.show(ctx)
})

router.put('/api/v1/topics/:id/posts/:id/comments/:id', jwtMiddleware, async (ctx, next) => {
    await commentController.update(ctx)
})

router.delete('/api/v1/topics/:id/posts/:id/comments/:id', jwtMiddleware, async (ctx, next) => {
    await commentController.delete(ctx)
})

export default router

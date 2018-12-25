import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import ProductController from '../controllers/ProductController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const productController = new ProductController()

router.get('/api/v1/products', jwtMiddleware, async (ctx, next) => {
    await productController.index(ctx)
})

router.post('/api/v1/products', jwtMiddleware, async (ctx, next) => {
    await productController.create(ctx)
})

router.get('/api/v1/products/:id', jwtMiddleware, async (ctx, next) => {
    await productController.show(ctx)
})

router.put('/api/v1/products/:id', jwtMiddleware, async (ctx, next) => {
    await productController.update(ctx)
})

router.delete('/api/v1/products/:id', jwtMiddleware, async (ctx, next) => {
    await productController.delete(ctx)
})

export default router

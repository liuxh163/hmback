import Router from 'koa-router'
import jwt from '../middleware/jwt'
import logger from '../logs/log'

import LoanController from '../controllers/LoanController'

const router = new Router()
const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET })

const loanController = new LoanController()

router.get('/api/v1/loans', jwtMiddleware, async (ctx, next) => {
    await loanController.index(ctx)
})

router.post('/api/v1/loans', jwtMiddleware, async (ctx, next) => {
    await loanController.create(ctx)
})

router.get('/api/v1/loans/:id', jwtMiddleware, async (ctx, next) => {
    await loanController.show(ctx)
})

router.put('/api/v1/loans/:id', jwtMiddleware, async (ctx, next) => {
    await loanController.update(ctx)
})

router.delete('/api/v1/loans/:id', jwtMiddleware, async (ctx, next) => {
    await loanController.delete(ctx)
})

export default router

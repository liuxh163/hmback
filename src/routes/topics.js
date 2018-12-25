import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'
import logger from '../logs/log'

import TopicController from '../controllers/TopicController'

const router = new Router()
const tokenMw = RdsToken()

const topicController = new TopicController()

router.get('/api/v1/topics', tokenMw, async (ctx, next) => {
    await topicController.index(ctx)
})

router.post('/api/v1/topics', tokenMw, async (ctx, next) => {
    await topicController.create(ctx)
})

router.get('/api/v1/topics/:id', tokenMw, async (ctx, next) => {
    await topicController.show(ctx)
})

router.delete('/api/v1/topics/:id', tokenMw, async (ctx, next) => {
    await topicController.delete(ctx)
})

export default router

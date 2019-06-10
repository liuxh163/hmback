import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import TopicController from '../controllers/TopicController'
import WeakToken from '../middleware/weakToken'

const router = new Router();
const tokenMw = RdsToken();
const weakMW = WeakToken();

const topicController = new TopicController()
// 获取所有话题
router.get('/api/v1/topics', weakMW, async (ctx, next) => {
    await topicController.index(ctx)
})
// 创建新话题
router.post('/api/v1/topics', tokenMw, async (ctx, next) => {
    await topicController.create(ctx)
})
// 更新话题信息
router.put('/api/v1/topics/:id', tokenMw, async (ctx, next) => {
    await topicController.update(ctx)
})

// 关闭指定话题
router.put('/api/v1/topics/:id/halt', tokenMw, async (ctx, next) => {
    await topicController.halt(ctx)
})

// 启用指定话题
router.put('/api/v1/topics/:id/awaken', tokenMw, async (ctx, next) => {
    await topicController.awaken(ctx)
})

export default router

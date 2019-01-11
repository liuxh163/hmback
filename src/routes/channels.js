import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import ChannelController from '../controllers/ChannelController'

const router = new Router()
const tokenMw = RdsToken()

const channelController = new ChannelController()
// 获取所有渠道
router.get('/api/v1/channels', tokenMw, async (ctx, next) => {
    await channelController.index(ctx)
})
// 新增渠道
router.post('/api/v1/channels', tokenMw, async (ctx, next) => {
    await channelController.create(ctx)
})
// 修改渠道信息
router.put('/api/v1/channels/:id', tokenMw, async (ctx, next) => {
    await channelController.update(ctx)
})

// 停用渠道信息
router.put('/api/v1/channels/:id/halt', tokenMw, async (ctx, next) => {
    await channelController.halt(ctx)
})
// 启用渠道信息
router.put('/api/v1/channels/:id/awaken', tokenMw, async (ctx, next) => {
    await channelController.awaken(ctx)
})

export default router

import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'
import logger from '../logs/log'

import PostController from '../controllers/PostController'

const router = new Router()
const tokenMw = RdsToken()

const postController = new PostController()
// 获取指定话题下所有帖子
router.get('/v1/topics/:id/posts', tokenMw, async (ctx, next) => {
    await postController.index(ctx)
})
// 在指定话题下新建帖子
router.post('/v1/topics/:id/posts', tokenMw, async (ctx, next) => {
    await postController.create(ctx)
})
// 查询指定话题下的指定帖子
router.get('/v1/topics/:id/posts/:id', tokenMw, async (ctx, next) => {
    await postController.show(ctx)
})
// 更新指定话题下的指定帖子
router.put('/v1/topics/:id/posts/:id', tokenMw, async (ctx, next) => {
    await postController.update(ctx)
})
// 删除指定话题下的指定帖子
router.delete('/v1/topics/:id/posts/:id', tokenMw, async (ctx, next) => {
    await postController.delete(ctx)
})

export default router

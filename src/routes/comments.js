import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import CommentController from '../controllers/CommentController'

const router = new Router()
const tokenMw = RdsToken()

const commentController = new CommentController()
// 获取评论列表
router.get('/v1/comments/{?target=01,targetId=123,pages=1,pageNum=10}', tokenMw, async (ctx, next) => {
    await commentController.index(ctx)
})
// 发表评论
router.post('/v1/comments', tokenMw, async (ctx, next) => {
    await commentController.create(ctx)
})
// 删除评论
router.delete('/v1/comments/:id', tokenMw, async (ctx, next) => {
    await commentController.delete(ctx)
})
// 更新评论
router.put('/v1/comments/:id', tokenMw, async (ctx, next) => {
    await commentController.update(ctx)
})

export default router

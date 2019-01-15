import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import PostController from '../controllers/PostController'

const router = new Router()
const tokenMw = RdsToken()

const postController = new PostController()
// 获取指定话题下所有帖子
router.get('/api/v1/topics/:id/posts', tokenMw, async (ctx, next) => {
    await postController.index(ctx)
})
// 在指定话题下发帖
router.post('/api/v1/topics/:id/posts', tokenMw, async (ctx, next) => {
    await postController.create(ctx)
})
// 查询指定帖子的详细信息，每次查询阅读数加1
router.get('/api/v1/posts/:id', tokenMw, async (ctx, next) => {
    await postController.show(ctx)
})
// 更新指定帖子
router.put('/api/v1/posts/:id', tokenMw, async (ctx, next) => {
    await postController.update(ctx)
})
// 删除指定帖子
router.delete('/api/v1/posts/:id', tokenMw, async (ctx, next) => {
    await postController.delete(ctx)
})

//查询我的帖子
router.get('/api/v1/posts/get/mine',tokenMw,async (ctx,next)=>{
    await postController.mine(ctx);
})
//查询帖子
router.get('/api/vi/posts/get/getLikerList',tokenMw,async (ctx,next)=>{
    await postController.getLikers(ctx);
})
export default router

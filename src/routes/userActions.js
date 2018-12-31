import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import UserActionController from '../controllers/UserActionController'

const router = new Router()
const tokenMw = RdsToken()

router.get('/', async (ctx, next, opt) => {
    ctx.body = { message: 'Hi there. ' + process.env.npm_package_version}
})

// 初始化用户控制器
const userActionController = new UserActionController()

// 用户登录
router.put('/api/v1/user/login', async (ctx, next) => {
    await userActionController.login(ctx)
})
// 用户信息修改
router.put('/api/v1/users/:id', tokenMw, async (ctx, next) => {
    await userActionController.update(ctx)
})
// 用户登出
router.put('/api/v1/user/logout', tokenMw, async (ctx, next) => {
    await userActionController.logout(ctx)
})
// 查询所有用户，分页，查询条件
router.get('/api/v1/users', tokenMw, async (ctx, next) => {
    await userActionController.index(ctx)
})
// 停用用户
router.put('/api/v1/users/:id/halt', tokenMw, async (ctx, next) => {
    await userActionController.halt(ctx)
})
// 启用用户
router.put('/api/v1/users/:id/awaken', tokenMw, async (ctx, next) => {
    await userActionController.awaken(ctx)
})
// 发送手机验证短信
router.post('/api/v1/users/sendSms', async (ctx, next) => {
    await userActionController.sendSms(ctx)
})

export default router

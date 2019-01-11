import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import AdminController from '../controllers/AdminController'

const router = new Router()
const tokenMw = RdsToken()


// 初始化用户控制器
const adminController = new AdminController()

// 创建管理员
router.post('/api/v1/admins', async (ctx, next) => {
    await adminController.create(ctx)
})
// 管理员登录
router.put('/api/v1/admins/login', async (ctx, next) => {
    await adminController.login(ctx)
})
// 管理员登出
router.put('/api/v1/admins/logout', tokenMw, async (ctx, next) => {
    await adminController.logout(ctx)
})
// 管理员密码修改
router.put('/api/v1/admins', tokenMw, async (ctx, next) => {
    await adminController.chpwd(ctx)
})

export default router

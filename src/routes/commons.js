import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import CommonController from '../controllers/CommonController'

const router = new Router()
const tokenMw = RdsToken()

const commonController = new CommonController()

// 获取系统码表
router.get('/api/v1/codes', tokenMw, async (ctx, next) => {
    await commonController.codesIndex(ctx)
})

export default router

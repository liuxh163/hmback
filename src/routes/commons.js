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
// eureka 心跳路由
router.get('/info', (req, res) => {
    res.json({ name: serviceName, status: 'UP' });
  });
  
// spring admin 心跳路由
router.get('/health', (req, res) => {
    res.json({
        description: 'Spring Cloud Eureka Discovery Client',
        status: 'UP',
        hystrix: {
        status: 'UP',
        },
    });
});
export default router

import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import GoodEstimateController from '../controllers/GoodEstimateController'
const router = new Router()
const tokenMw = RdsToken()

const ctrl = new GoodEstimateController()

router.get('/api/v1/goodestimate/all', tokenMw, async (ctx, next) => {
    await ctrl.all(ctx)
})

// 评价
router.post('/api/v1/goodestimate/commit', tokenMw, async (ctx, next) => {
    await ctrl.commit(ctx)
})

export default router

import Router from 'koa-router'
import RdsToken from '../middleware/rdsToken'

import CommonlyTravelerController from '../controllers/CommonlyTravelerController'
const router = new Router()
const tokenMw = RdsToken()
// const tokenMw = async (ctx,next)=>{
//     ctx.state.user = {
//         id:1
//     }
//     return next();
// }
const ctCtrl = new CommonlyTravelerController()

// 查询出行人
router.get('/api/v1/commonlytravelers/all', tokenMw, async (ctx, next) => {
    await ctCtrl.all(ctx)
})

// 新增出行人
router.post('/api/v1/commonlytravelers/add', tokenMw, async (ctx, next) => {
    await ctCtrl.add(ctx)
})

// 删除出行人
router.post('/api/v1/commonlytravelers/del', tokenMw, async (ctx, next) => {
    await ctCtrl.del(ctx)
})

// 更新出行人 
router.post('/api/v1/commonlytravelers/update', tokenMw, async (ctx, next) => {
    await ctCtrl.update(ctx);
})

export default router

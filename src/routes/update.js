import Router from 'koa-router'

import UpdateController from '../controllers/UpdateController'

const router = new Router()


const updCtrl = new UpdateController()
// 打标签
router.post('/api/v1/update/getVersionInfo', async (ctx, next) => {
    await updCtrl.getNewest(ctx);
})


export default router

import Router from 'koa-router'
import OLServiceController from '../controllers/OLServiceController'
import RdsToken from '../middleware/rdsToken'


const tokenMw = RdsToken();

const router = new Router();
const ctrl = new OLServiceController();
// 上传文件
router.get('/api/v1/olservice/address' ,tokenMw,async (ctx, next) => {
    await ctrl.getAddress(ctx)
})


export default router;

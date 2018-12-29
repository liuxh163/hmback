import Router from 'koa-router'
import FileController from '../controllers/FileController'
import RdsToken from '../middleware/rdsToken'

const koaBody = require('koa-body');
const tokenMw = RdsToken();

const router = new Router();
const ctrl = new FileController();
// 上传文件
router.post('/api/v1/upload', tokenMw, koaBody({
    multipart:true,
    formidable:{
        multipart:true,
        onFileBegin(name,file){
            console.log(file.name);
        }
    },
    onError:()=>{
        logger.log("koa body on error")
    }
}),async (ctx, next) => {
    await ctrl.upload(ctx)
})


export default router;

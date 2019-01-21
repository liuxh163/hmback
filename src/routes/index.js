// 导入路由及权限验证中间件
import Router from 'koa-router';
import RdsToken from '../middleware/rdsToken';
const router = new Router();
const tokenMw = RdsToken();

// 跟目录路由
router.get('/', async (ctx) => {
    ctx.body = { message: 'Hi there. ' + process.env.npm_package_version}
});
/**
 * 用户路由 
 */ 
// 导入用户控制器
import UserActionController from '../controllers/UserActionController';
const userCtrl = new UserActionController();
// 用户登录
router.put('/api/v1/user/login', async (ctx) => {
    await userCtrl.login(ctx);
});
// 用户信息修改
router.put('/api/v1/users', tokenMw, async (ctx) => {
    await userCtrl.update(ctx);
});
// 查询用户列表
router.get('/api/v1/users', tokenMw, async (ctx) => {
    await userCtrl.index(ctx);
})
// 停用用户
router.put('/api/v1/users/:id/halt', tokenMw, async (ctx) => {
    await userCtrl.halt(ctx);
});
// 启用用户
router.put('/api/v1/users/:id/awaken', tokenMw, async (ctx) => {
    await userCtrl.awaken(ctx);
});
// 发送手机短信
router.post('/api/v1/users/sendSms', async (ctx) => {
    await userCtrl.sendSms(ctx);
});
// 查询我的信息
router.get('/api/v1/users/mine',tokenMw,async (ctx,next)=>{
   await userCtrl.mine(ctx);
});
/**
 * 管理员路由
 */
import AdminController from '../controllers/AdminController';
const adminCtrl = new AdminController();
// 创建管理员
router.post('/api/v1/admins', async (ctx, next) => {
    await adminCtrl.create(ctx);
});
// 管理员登录
router.put('/api/v1/admins/login', async (ctx, next) => {
    await adminCtrl.login(ctx);
});
// 管理员登出
router.put('/api/v1/admins/logout', tokenMw, async (ctx, next) => {
    await adminCtrl.logout(ctx);
});
// 管理员密码修改
router.put('/api/v1/admins', tokenMw, async (ctx, next) => {
    await adminCtrl.chpwd(ctx);
});

export default router;
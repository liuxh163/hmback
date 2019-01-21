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
 * 通用部分路由
 */
import CommonController from '../controllers/CommonController';
const commonCtrl = new CommonController();
// 获取系统码表
router.get('/api/v1/codes', tokenMw, async (ctx) => {
    await commonCtrl.codesIndex(ctx);
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
router.get('/api/v1/users/mine',tokenMw,async (ctx)=>{
   await userCtrl.mine(ctx);
});

/**
 * 管理员路由
 */
import AdminController from '../controllers/AdminController';
const adminCtrl = new AdminController();
// 创建管理员
router.post('/api/v1/admins', async (ctx) => {
    await adminCtrl.create(ctx);
});
// 管理员登录
router.put('/api/v1/admins/login', async (ctx) => {
    await adminCtrl.login(ctx);
});
// 管理员登出
router.put('/api/v1/admins/logout', tokenMw, async (ctx) => {
    await adminCtrl.logout(ctx);
});
// 管理员密码修改
router.put('/api/v1/admins', tokenMw, async (ctx) => {
    await adminCtrl.chpwd(ctx);
});

/**
 * 产品路由
 */
import ProductController from '../controllers/ProductController';
const productCtrl = new ProductController();
// 获取产品列表
router.get('/api/v1/products', tokenMw, async (ctx) => {
    await productCtrl.index(ctx);
});
// 新增产品
router.post('/api/v1/products', tokenMw, async (ctx) => {
    await productCtrl.create(ctx);
});
// 查看指定产品
router.get('/api/v1/products/:id', tokenMw, async (ctx) => {
    await productCtrl.show(ctx);
});
// 更新产品
router.put('/api/v1/products/:id', tokenMw, async (ctx) => {
    await productCtrl.update(ctx);
});
// 删除产品
router.delete('/api/v1/products/:id', tokenMw, async (ctx) => {
    await productCtrl.delete(ctx);
});
// 停用产品
router.put('/api/v1/products/:id/halt', tokenMw, async (ctx) => {
    await productCtrl.halt(ctx);
});
// 启用产品
router.put('/api/v1/products/:id/awaken', tokenMw, async (ctx) => {
    await productCtrl.awaken(ctx);
});

/**
 * 服务人员路由
 */
import ServantController from '../controllers/ServantController';
const servantCtrl = new ServantController();
// 获取服务人员列表
router.get('/api/v1/servants', tokenMw,async (ctx) => {
    await servantCtrl.index(ctx);
});
// 创建新服务人员
router.post('/api/v1/servants', tokenMw, async (ctx) => {
    await servantCtrl.create(ctx);
});
// 获取服务人员详情
router.get('/api/v1/servants/:id',tokenMw, async (ctx) => {
    await servantCtrl.show(ctx);
});
// 修改服务人员信息
router.put('/api/v1/servants/:id', tokenMw, async (ctx) => {
    await servantCtrl.update(ctx);
});
// 停用渠道信息
router.put('/api/v1/servants/:id/halt', tokenMw, async (ctx) => {
    await servantCtrl.halt(ctx);
});
// 启用渠道信息
router.put('/api/v1/servants/:id/awaken', tokenMw, async (ctx) => {
    await servantCtrl.awaken(ctx);
});

/**
 * 渠道商路由
 */
import ChannelController from '../controllers/ChannelController';
const channelCtrl = new ChannelController();
// 获取所有渠道
router.get('/api/v1/channels', tokenMw, async (ctx) => {
    await channelCtrl.index(ctx);
});
// 新增渠道
router.post('/api/v1/channels', tokenMw, async (ctx) => {
    await channelCtrl.create(ctx);
});
// 修改渠道信息
router.put('/api/v1/channels/:id', tokenMw, async (ctx) => {
    await channelCtrl.update(ctx);
});
// 停用渠道信息
router.put('/api/v1/channels/:id/halt', tokenMw, async (ctx) => {
    await channelCtrl.halt(ctx);
});
// 启用渠道信息
router.put('/api/v1/channels/:id/awaken', tokenMw, async (ctx) => {
    await channelCtrl.awaken(ctx);
});

/**
 * 附加项路由
 */
import AttendantController from '../controllers/AttendantController';
const attendantCtrl = new AttendantController();
// 获取所有附加项列表
router.get('/api/v1/attendants', tokenMw, async (ctx) => {
    await attendantCtrl.index(ctx);
});
// 新建产品附加项
router.post('/api/v1/attendants', tokenMw, async (ctx) => {
    await attendantCtrl.create(ctx);
});
// 更新产品附加项
router.put('/api/v1/attendants/:id', tokenMw, async (ctx) => {
    await attendantCtrl.update(ctx);
});
// 停用产品附加项
router.put('/api/v1/attendants/:id/halt', tokenMw, async (ctx) => {
    await attendantCtrl.halt(ctx);
});
// 启用产品附加项
router.put('/api/v1/attendants/:id/awaken', tokenMw, async (ctx) => {
    await attendantCtrl.awaken(ctx);
});

/**
 * 话题路由
 */
import TopicController from '../controllers/TopicController';
const topicCtl = new TopicController();
// 获取所有话题
router.get('/api/v1/topics', tokenMw, async (ctx) => {
    await topicController.index(ctx);
});
// 创建新话题
router.post('/api/v1/topics', tokenMw, async (ctx) => {
    await topicController.create(ctx);
});
// 更新话题信息
router.put('/api/v1/topics/:id', tokenMw, async (ctx) => {
    await topicController.update(ctx);
});
// 关闭指定话题
router.put('/api/v1/topics/:id/halt', tokenMw, async (ctx) => {
    await topicController.halt(ctx);
});
// 启用指定话题
router.put('/api/v1/topics/:id/awaken', tokenMw, async (ctx) => {
    await topicController.awaken(ctx);
});

/**
 * 帖子路由
 */
import PostController from '../controllers/PostController';
const postCtrl = new PostController();
// 获取指定话题下所有帖子
router.get('/api/v1/topics/:id/posts', tokenMw, async (ctx) => {
    await postCtrl.index(ctx);
});
// 在指定话题下发帖
router.post('/api/v1/topics/:id/posts', tokenMw, async (ctx) => {
    await postCtrl.create(ctx);
});
// 查询指定帖子的详细信息，每次查询阅读数加1
router.get('/api/v1/posts/:id', tokenMw, async (ctx) => {
    await postCtrl.show(ctx);
});
// 更新指定帖子
router.put('/api/v1/posts/:id', tokenMw, async (ctx) => {
    await postCtrl.update(ctx);
});
// 删除指定帖子
router.delete('/api/v1/posts/:id', tokenMw, async (ctx) => {
    await postCtrl.delete(ctx);
});
//查询我的帖子
router.get('/api/v1/posts/get/mine',tokenMw,async (ctx)=>{
    await postCtrl.mine(ctx);
});
//查询帖子
router.get('/api/vi/posts/get/getLikerList',tokenMw,async (ctx)=>{
    await postCtrl.getLikers(ctx);
});

/**
 * 轮播图路由
 */
import CarouselController from '../controllers/CarouselController';
const carouselCtrl = new CarouselController();
// 查询轮播图
router.get('/api/v1/carousels', tokenMw, async (ctx) => {
    await carouselCtrl.index(ctx);
});
// 新建轮播图
router.post('/api/v1/carousels', tokenMw,  async (ctx) => {
    await carouselCtrl.create(ctx);
});
// 更新轮播图
router.put('/api/v1/carousels/:id', tokenMw, async (ctx) => {
    await carouselCtrl.update(ctx);
});
// 停用轮播图
router.put('/api/v1/carousels/:id/halt', tokenMw, async (ctx) => {
    await carouselCtrl.halt(ctx);
});
// 启用轮播图
router.put('/api/v1/carousels/:id/awaken', tokenMw, async (ctx) => {
    await carouselCtrl.awaken(ctx);
});
// 删除轮播图
router.delete('/api/v1/carousels/:id', tokenMw, async (ctx) => {
    await carouselCtrl.delete(ctx);
});

/**
 * 评论路由
 */
import CommentController from '../controllers/CommentController';
const commentCtrl = new CommentController();
// 获取评论列表
router.get('/api/v1/comments', tokenMw, async (ctx) => {
    await commentCtrl.index(ctx);
});
// 发表评论
router.post('/api/v1/comments', tokenMw, async (ctx) => {
    await commentCtrl.create(ctx);
});
// 删除评论
router.delete('/api/v1/comments/:id', tokenMw, async (ctx) => {
    await commentCtrl.delete(ctx);
});
// 更新评论
router.put('/api/v1/comments/:id', tokenMw, async (ctx) => {
    await commentCtrl.update(ctx);
});

/**
 * 点赞/取消路由
 */
import ThumbController from '../controllers/ThumbController';
const thumbCtrl = new ThumbController();
// 点赞/取消
router.put('/api/v1/thumbs', tokenMw, async (ctx) => {
    await thumbCtrl.toggle(ctx);
});

/**
 * 标签路由
 */
import TagController from '../controllers/TagController';
const tagCtrl = new TagController();
// 打标签
router.post('/api/v1/tags', tokenMw, async (ctx) => {
    await tagCtrl.create(ctx);
});
// 查询标签
router.get('/api/v1/tags', tokenMw, async (ctx) => {
    await tagCtrl.index(ctx);
});
// 删除标签
router.delete('/api/v1/tags/:id', tokenMw, async (ctx) => {
    await tagCtrl.delete(ctx);
});

/**
 * 订单相关路由
 */
import OrderController from '../controllers/OrderController';
import PayController from '../controllers/PayController';
const orderCtrl = new OrderController();
const payCtrl = new PayController();
// 查询订单，支持不同排序方法，支持分页
/**
 * 对应我的订单，根据订单状态查询
 * 待付款 02
 * 以付款 01
 * 退款单 
 * 待点评 03
 * 已取消 10
 */
router.get('/api/v1/orders', tokenMw, async (ctx) => {
    await orderCtrl.index(ctx);
});
// 下订单
router.post('/api/v1/orders', tokenMw, async (ctx) => {
    await orderCtrl.create(ctx);
});
// 取消订单
router.put('/api/v1/orders/:id/withdraw', tokenMw, async (ctx) => {
    await orderCtrl.withdraw(ctx);
});
// 订单支付
router.post('/api/v1/orders/wxpay', tokenMw, async (ctx) => {
    await payCtrl.wx_pay(ctx);
});
// 修改订单
router.put('/api/v1/orders/:id', tokenMw, async (ctx) => {
    await orderCtrl.update(ctx);
});

/**
 * 文件路由
 */
import FileController from '../controllers/FileController';
const koaBody = require('koa-body');
const fileCtrl = new FileController();
// 上传文件
router.post('/api/v1/upload', tokenMw, koaBody({
    multipart:true,
    formidable:{
        multipart:true,
        onFileBegin(name,file){
            console.log("文件-"+name+"-正在开始上传..."+file.name);
        }
    },
    onError:()=>{
        logger.log("koa body on error")
    }
}),async (ctx) => {
    await fileCtrl.upload(ctx)
});

export default router;
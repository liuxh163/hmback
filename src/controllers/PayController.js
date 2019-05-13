import Axios from "axios";
import {Order ,findByNumber} from '../models/Order'
var xmlreader = require("xmlreader");
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser({
    explicitArray:false,
    ignoreAttrs:true,
    trim:true
});
import {wxpay,WXPay} from '../models/WXPay'
import db from '../db/db'
function getRemoteIP(ctx){
    return ctx.headers['x-forwarded-for'] ||
        ctx.socket.remoteAddress 
}

const appid = "wx95c8cd3694e4df4e";
const mch_id = "1532194821";
//要在微信支付平台设置
const mchkey = "1323c74768ba5497dea2078a27d19fa8";
// const notify_url = "https://app.haima101.com/api/v1/orders/wx_notify";
const notify_url = "http://app.haima101.com/api/v1/orders/wx_notify";
const trade_type = 'APP';
class PayController {
    async wx_pay(ctx){
        await this.wx_unifiedorder1(ctx);
    }
    async wx_close(payObj){
        let ctrl = this;
        await db.transaction(async function(trx){
            try{
                await ctrl.__wx_close_order(payObj,trx)
                return trx.commit();
            }catch(error){
                return trx.rollback(error);
            }
        })
    }
    async __wx_close_order(payObj,trx){
        let updateData = {
            result_code:'CLOSED',
            operator:'system',
            operateFlag:'D',
            updatedAt:new Date()
        }
        await payObj.update(updateData,trx)
        let nonce_str = wxpay.createNonceStr();
        let inParam = {
            appid:payObj.appid,
            mch_id:payObj.mch_id,
            nonce_str:nonce_str,
            out_trade_no:payObj.out_trade_no
        }
        let sign = wxpay.paysignapi(mchkey,inParam);
        var formData  = "<xml>";
        formData  += "<appid>"+inParam.appid+"</appid>";  //appid
        formData  += "<mch_id>"+inParam.mch_id+"</mch_id>";  //商户号
        formData  += "<nonce_str>"+inParam.nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
        formData  += "<out_trade_no>"+inParam.out_trade_no+"</out_trade_no>";       
        formData  += "<sign>"+sign+"</sign>";
        formData  += "</xml>";
        let response = await  Axios.post('https://api.mch.weixin.qq.com/pay/closeorder',formData,{headers: {'Content-Type': 'text/xml'}});
        do{
            if(response.status != 200) {
                throw new Error('访问微信服务器失败,无法关闭原单');
            }
            let xmlobj = null;
            xmlParser.parseString(response.data.toString("utf-8"),function(errors,xml){
                if (null !== errors) {
                    console.error(errors)
                    return;
                }
                xmlobj = xml.xml;
            })
            if( xmlobj == null) {
                throw new Error('xml解析失败');
            }
            if(!this.checkWXNotifySign(xmlobj,mchkey)){
                throw new Error('签名校验失败，微信服务被劫持了?');
            }
            //微信写的
            if( xmlobj.return_code === "FAIL") {
                console.error(xmlobj.return_msg);
                throw new Error('调用微信关单失败')
            }


            if( xmlobj.result_code === "FAIL") {
                console.error(xmlobj.err_code);
                console.error(xmlobj.err_code_des);
                if(xmlobj.err_code == 'SYSTEMERROR'){
                    throw new Error('微信支付系统异常');
                }else if(xmlobj.err_code == 'ORDERPAID'){
                    throw new Error('订单已支付，不能发起关单');
                }
                break;
            }
        }while(0);

    }
    //下单逻辑流，会很复杂
    async wx_unifiedorder1(ctx){
        let params = ctx.request.body;
        let number = params.number;
        let order = await findByNumber(number);
        
        let payParams = order.getPayParamsForWX();
        let payObj = await WXPay.getByPayParam(payParams);

        let total_fee = wxpay.getmoney(payParams.fee);
        let body = payParams.body;

        let prepayId = null;
        //没有下过单
        if(!payObj){
            //开始一个新的下单
            console.debug('开始一个新的微信下单')
            prepayId = await this.wx_neworder(order,ctx);
        }else{
            //检查参数是否对应
            //需要检查 总金额 body 商户号 appid
            if(!payObj.checkParams(total_fee,body,mch_id,appid)){
                console.debug('检查失败,转入微信关单流程')

                //检查失败,转入关单流程
                //关单里任何异常都会强制中断此次支付流程
                await this.wx_close(payObj,ctx);
                prepayId = await this.wx_neworder(order,ctx);
            }else{
                console.debug('继续使用原参数下单')
                prepayId = await this.wx_continueOrder(order,payObj,ctx);
            }

        }
        let result = null;
        let nonce_str = wxpay.createNonceStr();
        if(prepayId){
            result = wxpay.paysignjsapifinal(appid,mch_id,prepayId,nonce_str,mchkey);
        }
        if(!result){
            throw new Error('cannot get prepayID');
        }
        ctx.body = result;
    }
    async wx_neworder(order,ctx){
        let payParams = order.getPayParamsForWX();
        let payObj = new WXPay({
            type:payParams.type,
            userId:ctx.state.user.id,
            number:order.number,
            appid: appid,
            mch_id: mch_id,
            body: payParams.body,
            out_trade_no: payParams.trade_no,
            total_fee: payParams.fee,
            trade_type: trade_type
        })
        await payObj.fillForInsert();
        let prepayId = await this.wx_getPrepayId(payObj,ctx);
        if(prepayId){
            await payObj.store();
        }
        return prepayId;
    }
    async wx_continueOrder(order,payObj,ctx){
        let prepayId = await this.wx_getPrepayId(payObj,ctx);
        if(!prepayId){
            console.debug('原obj得不到id，只能从新来了')
            await this.wx_close(payObj,ctx);
            prepayId = await this.wx_neworder(order,ctx);
        }
        return prepayId;
    }
    async wx_getPrepayId(payObj,ctx){
        let nonce_str = wxpay.createNonceStr();
        let inParam = {
            appid: payObj.appid,
            mch_id: payObj.mch_id,
            nonce_str: nonce_str,
            body: payObj.body,
            notify_url: notify_url,
            out_trade_no: payObj.out_trade_no,
            spbill_create_ip: getRemoteIP(ctx),
            total_fee: payObj.total_fee,
            trade_type: payObj.trade_type,
            attach:payObj.id
        }
        let sign = wxpay.paysignapi(mchkey,inParam);
        var formData  = "<xml>";
        formData  += "<appid>"+inParam.appid+"</appid>";  //appid
        formData  += "<body><![CDATA["+inParam.body+"]]></body>";
        formData  += "<mch_id>"+inParam.mch_id+"</mch_id>";  //商户号
        formData  += "<nonce_str>"+inParam.nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
        formData  += "<notify_url>"+inParam.notify_url+"</notify_url>";
        formData  += "<out_trade_no>"+inParam.out_trade_no+"</out_trade_no>";
        formData  += "<spbill_create_ip>"+inParam.spbill_create_ip+"</spbill_create_ip>";
        formData  += "<total_fee>"+inParam.total_fee+"</total_fee>";
        formData  += "<trade_type>"+inParam.trade_type+"</trade_type>";
        formData  += "<sign>"+sign+"</sign>";
        formData  += "<attach>"+inParam.attach+"</attach>"
        formData  += "</xml>";
        console.log("微信支付的时候发给微信的都是些什么呀，来看看看看看-"+formData);
        let response = await  Axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder',formData,{headers: {'Content-Type': 'text/xml'}});
        let result = null;
        do{
            if(response.status != 200) {
                throw new Error('访问微信服务器失败');

            }
            let xmlobj = null;
            
            xmlParser.parseString(response.data.toString("utf-8"), function (errors, xml) {
                if (null !== errors) {
                    console.debug(errors)
                    return;
                }
                xmlobj = xml.xml;
            });
            if( xmlobj == null) {
                throw new Error('xml解析失败');
            }
            if(!this.checkWXNotifySign(xmlobj,mchkey)){
                throw new Error('签名校验失败，微信服务被劫持了?');
            }
            //微信写的
            if( xmlobj.return_code === "FAIL") {
                console.error(xmlobj.return_msg);
                break;
            }
            if( xmlobj.result_code === "FAIL") {
                console.error(xmlobj.err_code);
                console.error(xmlobj.err_code_des);
                if(xmlobj.err_code == 'SYSTEMERROR'){
                    throw new Error('微信支付系统异常');
                }else if(xmlobj.err_code == 'ORDERPAID'){
                    throw new Error('订单已支付,耐心等待结果');
                }
                
                break;
            }
            var prepay_id = xmlobj.prepay_id;
            console.debug('解析后的prepay_id=='+prepay_id);
            result = prepay_id;
        }while(0);
        // console.log('hello world')
        // console.log(result)
        return result;
    }
    async wx_unifiedorder(ctx){
        let params = ctx.request.body;
        let number = params.number;
        let order = await findByNumber(number);

        //从数据库取到对应的微信商品代码，商品价格
        let payParams = order.getPayParamsForWX();
        let total_fee = wxpay.getmoney(payParams.fee);
        //total_fee = '123'
        //这个是我们自己的订单号，需要插库取ID
        let out_trade_no = payParams.trade_no;

        let nonce_str = wxpay.createNonceStr();

        let body = '商品名';
 
        let spbill_create_ip = getRemoteIP(ctx);
       //let spbill_create_ip = '123.123.123.123'
        //let notify_url = "http://47.92.131.110:24651/api/v1/orders/wx_notify";
        // let notify_url = "https://app.haima101.com/api/v1/orders/wx_notify";
        let notify_url = "http://app.haima101.com/api/v1/orders/wx_notify";

        let inParam = {
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            body: body,
            notify_url: notify_url,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        }
        let payObj = new WXPay(inParam);
        payObj.type = payParams.type;
        payObj.userId = ctx.state.user.id;
        payObj.number = order.number;
        await payObj.fillForInsert();
        let attach = payObj.id;
        
        inParam.out_trade_no = payObj.out_trade_no;
        inParam.attach = attach;
        let sign = wxpay.paysignapi(mchkey,inParam);
        //let sign = wxpay.paysignjsapi(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);
    
        console.debug('sign=='+sign);
    
        //组装xml数据
        var formData  = "<xml>";
        formData  += "<appid>"+inParam.appid+"</appid>";  //appid
        formData  += "<body><![CDATA["+inParam.body+"]]></body>";
        formData  += "<mch_id>"+inParam.mch_id+"</mch_id>";  //商户号
        formData  += "<nonce_str>"+inParam.nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
        formData  += "<notify_url>"+inParam.notify_url+"</notify_url>";
        formData  += "<out_trade_no>"+inParam.out_trade_no+"</out_trade_no>";
        formData  += "<spbill_create_ip>"+inParam.spbill_create_ip+"</spbill_create_ip>";
        formData  += "<total_fee>"+inParam.total_fee+"</total_fee>";
        formData  += "<trade_type>"+inParam.trade_type+"</trade_type>";
        formData  += "<sign>"+sign+"</sign>";
        formData  += "<attach>"+attach+"</attach>"
        formData  += "</xml>";

        let response = await  Axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder',formData,{headers: {'Content-Type': 'text/xml'}});
        let result = null;
        do{
            if(response.status != 200) break;
            let xmlobj = null;
            xmlreader.read(response.data.toString("utf-8"), function (errors, xml) {
                if (null !== errors) {
                    console.debug(errors)
                    return;
                }
                xmlobj = xml;
            });
            if( xmlobj == null) break;
            //微信写的
            if( xmlobj.xml.return_code.text() === "FAIL") {
                console.debug(xmlobj.xml.return_code.return_msg.text());
                break;
            }

            if( xmlobj.xml.result_code.text() === "FAIL") {
                console.debug(xmlobj.xml.return_code.err_code.text());
                console.debug(xmlobj.xml.return_code.err_code_des.text());
                break;
            }

            var prepay_id = xmlobj.xml.prepay_id.text();
            console.debug('解析后的prepay_id=='+prepay_id);

            //将预支付订单和其他信息一起签名后返回给前端
            result = wxpay.paysignjsapifinal(appid,mch_id,prepay_id,nonce_str,mchkey);

        }while(0);
        if(!result){
            throw new Error("can not get prepay id");
        }
        payObj.sign = sign;
        //await payObj.store();
        ctx.body=result;
    }
    /**
     * 查询支付状态
     * 参考https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2
     * 根据 out_trade_no或transaction_id 二选一
     */

    wx_orderquery(ctx){

    }
    /**
     * 收到微信支付的通知接口
     * 参考https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
     * 取出  out_trade_no=> 表ID
     * 写入=>transaction_id
     */
    checkWXNotifySign(xmlObj, PAY_API_KEY) {
        let string = ''
        const keys = Object.keys(xmlObj)
        keys.sort()
        keys.forEach(key => {
            if (xmlObj[key] && key !== 'sign') {
                string = string + key + '=' + xmlObj[key] + '&'
            }
        })
        string = string + 'key=' + PAY_API_KEY
        console.log("微信callback中校验微信签名的串串-------"+string)
        var crypto = require('crypto');
        let localSign = crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
        console.log(localSign);
        return localSign === xmlObj.sign
    }
    async wx_notify(ctx){
        console.log("微信callback我啦，啦啦啦啦啦发来的Xml内容----"+ctx.request.body.xml);
        let wx_code = 'FAIL';
        let wx_msg = '系统处理异常';
        let wx_isResend = false;
        let xmlobj = ctx.request.body.xml;
        let v = this.checkWXNotifySign(xmlobj,mchkey);
        console.log("微信callback中检验签名结果----"+v);
        //测试代码
        //todo
        //v = true;
        if(!v){
            wx_code = 'FAIL'
            wx_msg = '签名校验失败'
        }else{
            let inParam = {
                return_code:xmlobj.return_code,
                return_msg:xmlobj.return_msg
            }
            if(inParam.return_code == 'SUCCESS'){
                inParam.attach=xmlobj.attach;

                inParam.result_code=xmlobj.result_code;
                inParam.openid=xmlobj.openid;
                inParam.is_subscribe=xmlobj.is_subscribe;
                inParam.trade_type=xmlobj.trade_type;
                inParam.bank_type=xmlobj.bank_type;
                inParam.total_fee=xmlobj.total_fee;
                inParam.cash_fee=xmlobj.cash_fee;
                inParam.transaction_id=xmlobj.transaction_id;
                inParam.out_trade_no=xmlobj.out_trade_no;
                inParam.time_end=xmlobj.time_end;
                if(inParam.result_code === 'FAIL'){
                    inParam.err_code = xmlobj.err_code
                    inParam.err_code_des = xmlobj.err_code_des
                }
            }else{
                console.log("微信支付通知接口中返回码为空，出现异常");
                wx_msg = "这是什么意思";
                var formData  = "<xml>";
                formData += "<return_code><![CDATA["+wx_code+"]]></return_code>";  //appid
                formData += "<return_msg><![CDATA["+wx_msg+"]]></return_msg>";
                formData += "</xml>";
                ctx.set('Content-Type', 'application/xml')
                ctx.body = formData;
                return;
            }
 
            //核心原则就是
            //在处理失败并且入队失败的情况下
            await WXPay.checkFromWX(inParam,function(code,msg,isResend){
                wx_code = code;
                wx_msg =  msg;
                wx_isResend = isResend;
            });
        }
        //收到 就尽量回吧
        var formData  = "<xml>";
        formData += "<return_code><![CDATA["+wx_code+"]]></return_code>";  //appid
        formData += "<return_msg><![CDATA["+wx_msg+"]]></return_msg>";
        formData += "</xml>";
        ctx.set('Content-Type', 'application/xml')
        if(wx_isResend){
            ctx.body = '瞎回点让微信重发吧';
        }
        ctx.body = formData;
    }
}

export default PayController

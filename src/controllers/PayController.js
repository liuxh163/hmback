import Axios from "axios";
import {Order ,findByNumber} from '../models/Order'
var xmlreader = require("xmlreader");

import {wxpay,WXPay} from '../models/WXPay'
import { loadavg } from "os";

function getRemoteIP(ctx){
    return ctx.headers['x-forwarded-for'] ||
        ctx.socket.remoteAddress 
}

const appid = "wx0d83ef9bd8190fe0";
const mch_id = "1501887481";
//要在微信支付平台设置
const mchkey = "q2eu8pxycp2018CP0418Irt1650BjLxh";

class PayController {
    async wx_pay(ctx){
        await this.wx_unifiedorder(ctx);
    }
    async wx_unifiedorder(ctx){
        let params = ctx.request.body;
        let number = params.number;
        let order = await findByNumber(number);

        //从数据库取到对应的微信商品代码，商品价格
        let payParams = order.getPayParamsForWX();
        let total_fee = wxpay.getmoney(payParams.fee);
        //这个是我们自己的订单号，需要插库取ID
        let out_trade_no = payParams.trade_no;

        let nonce_str = wxpay.createNonceStr();

        let body = '商品名';
 
        let spbill_create_ip = getRemoteIP(ctx);
        //let notify_url = "http://47.92.131.110:24651/api/v1/orders/wx_notify";
        let notify_url = "https://app.haima101.com/api/v1/orders/wx_notify";
        let trade_type = 'APP';
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
            if( xmlobj.xml.return_code.text() === "FAIL") break;

            if( xmlobj.xml.result_code.text() === "FAIL") break;

            var prepay_id = xmlobj.xml.prepay_id.text();
            console.debug('解析后的prepay_id=='+prepay_id);

            //将预支付订单和其他信息一起签名后返回给前端
            result = wxpay.paysignjsapifinal(appid,mch_id,prepay_id,nonce_str,mchkey);

        }while(0);
        if(!result){
            throw new Error("can not get prepay id");
        }
        payObj.sign = sign;
        await payObj.store();
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
        //keys.sort()
        keys.forEach(key => {
            if (xmlObj[key] && key !== 'sign') {
                string = string + key + '=' + xmlObj[key] + '&'
            }
        })
        string = string + 'key=' + PAY_API_KEY
        console.debug(string)
        var crypto = require('crypto');
        let localSign = crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
        return localSign === xmlObj.sign
    }
    async wx_notify(ctx){
        console.debug(ctx.request.body.xml)
        let wx_code = 'FAIL';
        let wx_msg = '系统处理异常';
        let wx_isResend = false;
        let xmlobj = ctx.request.body.xml;
        let v = this.checkWXNotifySign(xmlobj,mchkey)
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
                console.error("微信支付，没值掉你妈呢");
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

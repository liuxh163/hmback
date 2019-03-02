import Axios from "axios";
import {Order ,findByNumber} from '../models/Order'
var xmlreader = require("xmlreader");

import {wxpay,WXPay} from '../models/WXPay'
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
        console.log(order);
        //从数据库取到对应的微信商品代码，商品价格
        let payParams = order.getPayParamsForWX();
        let total_fee = wxpay.getmoney(payParams.fee);
        //这个是我们自己的订单号，需要插库取ID
        let out_trade_no = payParams.trade_no;

        let nonce_str = wxpay.createNonceStr();

        let body = '商品名';
 
        let spbill_create_ip = getRemoteIP(ctx);
        let notify_url = "http://49.72.131.110:24651/api/v1/wx_notify";
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
        payObj.code = payParams.code;
        payObj.userId = ctx.state.user.id;
        payObj.number = order.number;
        await payObj.fillForInsert();
        let attach = payObj.id;
        
        inParam.out_trade_no = payObj.out_trade_no;
        console.log(payObj)
        let sign = wxpay.paysignapi(mchkey,inParam);
        //let sign = wxpay.paysignjsapi(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);
    
        console.log('sign=='+sign);
    
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
        formData  += "</xml>";

        let response = await  Axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder',formData,{headers: {'Content-Type': 'text/xml'}});
        let result = {};
        let prepayId = null; 
        do{
            if(response.status != 200) break;
            let xmlobj = null;
            console.log(response.data.toString('utf-8'));
            xmlreader.read(response.data.toString("utf-8"), function (errors, xml) {
                if (null !== errors) {
                    console.log(errors)
                    return;
                }
                xmlobj = xml;
            });
            if( xmlobj == null) break;
            //微信写的
            if( xmlobj.xml.return_code.text() === "FAIL") break;

            if( xmlobj.xml.result_code.text() === "FAIL") break;

            var prepay_id = xmlobj.xml.prepay_id.text();
            console.log('解析后的prepay_id=='+prepay_id);

            //将预支付订单和其他信息一起签名后返回给前端
            //let finalsign = wxpay.paysignjsapifinal(appid,mch_id,prepay_id,nonce_str,timestamp,mchkey);

            //res.json({'appId':appid,'prepayId':prepay_id,'nonceStr':nonce_str,'timeStamp':timestamp,'package':'Sign=WXPay','sign':finalsign});
            prepayId = prepay_id;
        }while(0);
        if(!prepayId){
            throw new Error("can not get prepay id");
        }
        payObj.sign = sign;
        await payObj.store();
        ctx.body=prepayId;
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
    
    wx_notify(ctx){
        
    }
}

export default PayController

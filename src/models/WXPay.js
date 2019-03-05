const genLongID  = require('../genID/longID').genLongID
const G_MODULE_WXPAYCHECK_NAME =  'wxpaycheck'
const G_TABLE_NAME = 't_hm101_wxpaycheck'
import db from '../db/db'
import {sendToMQ,MsgNames,QueueName, sendToDelayMQ,sendToUNHandle} from '../msgcenter/msgCenter'
import { Order,OrderBill } from './Order';

var wxpay = {
 
    // 把金额转为分
    getmoney: function (money) {
        return parseInt(money);
    },
 
    // 随机字符串产生函数  
    createNonceStr: function () {
        return Math.random().toString(36).substr(2, 15);
    },
 
    // 时间戳产生函数  
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + '';
    },
    paysignapi: function(mchkey,params){
        var string = raw(params);
        var key = mchkey;
        string = string + '&key=' + key;
        console.debug('string='+string);
        var crypto = require('crypto');
        return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    },
    //签名加密算法
    paysignjsapi: function (appid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey) {
        var ret = {
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            body: body,
            notify_url: notify_url,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        };

        var string = raw(ret);
        var key = mchkey;
        string = string + '&key=' + key;
        console.debug('string=', string);
        var crypto = require('crypto');
        return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    },
//     "data":{"appid":"wx0411fa6a39d61297",
// "noncestr":"rQmjIap8rBQDcGqz",
// "package":"Sign=WXPay",
// "partnerid":"1230636401",
// "prepayid":"wx021858018462438ca95390f42791572790",
// "timestamp":1551524281,
// "sign":"8837C89A6128FECC8FACAC1546182711"
// },
    /**
     *签名加密算法,第二次的签名
     *看文档说5个参数https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
     *这个别人写有6个参数
     *多个 partnerid
     *todo
     */

    paysignjsapifinal: function (appid,mch_id,prepayid,noncestr,mchkey) {
        let date = new Date();
        let timestamp = parseInt(date.getTime()/1000).toString();
        var ret = {
            appid: appid,
            prepayid: prepayid,
            package: 'Sign=WXPay',
            noncestr: noncestr,
            partnerid:mch_id,
            timestamp: timestamp,
        };
        var string = raw(ret);
        var key = mchkey;
        string = string + '&key=' + key;
        console.debug('stringstringstring=', string);
        var crypto = require('crypto');
        let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
        ret.sign = sign;
        return ret;
    }

}
function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}

class WXPay{
    constructor(data){
        this.id  = data.id;


        this.userId = data.userId
        this.notify_url = data.notify_url;
        this.number = data.number;
        this.type = data.type;


        this.nonce_str = data.nonce_str;
        this.body = data.body;
        this.out_trade_no = data.out_trade_no;
        this.spbill_create_ip = data.spbill_create_ip;
        this.total_fee = data.total_fee;
        this.trade_type = data.trade_type;
        this.result_code = data.result_code;
        this.err_code = data.err_code;
        this.err_code_desc = data.err_code_desc;
        this.transaction_id = data.transaction_id;
        this.openid = data.openid;
        this.is_subscribe = data.is_subscribe;
        this.bank_type = data.bank_type;
        this.cash_fee = data.cash_fee;
        this.time_end = data.time_end;

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
    async fillForInsert() {
        this.id = await genLongID(G_MODULE_WXPAYCHECK_NAME,'10',10);
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = this.userId;
        //to do
        this.operateFlag = 'A';
        this.out_trade_no = ''+this.id+"_"+this.number
    }
    async store(){
        await db(G_TABLE_NAME).insert(this);
    }
    static async find(id,allowNonExist = false){
        let [db_result] = await db(G_TABLE_NAME).select('*').where({id:id});
        if(! db_result && ! allowNonExist) throw new Error("微信支付未找到对账单:"+id);
        
        if(!db_result) return null;
        let payObj = new WXPay(db_result);
        return payObj;
    }
    async save(trx){
        trx = trx||db;
        await trx(G_TABLE_NAME).update(this).where({id:this.id})
    }
    async checkAndTranscation(inParam){
        let updObj = new WXPay(inParam);
        updObj.id = inParam.attach;
        delete updObj.out_trade_no;
        delete updObj.total_fee;
        delete updObj.trade_type
        let payObj = this;

        await db.transaction(async function(trx){
            try{
                await updObj.save(trx);

                do{
                    if(updObj.result_code != 'SUCCESS') break;
                    //支付成功的插入对账单
                    let bill = new OrderBill({
                        number:payObj.number,
                        type:payObj.type,
                        fee:payObj.total_fee,
                        paymentType:'01',
                        transaction_id:updObj.transaction_id,
                        out_trade_no:payObj.out_trade_no,
                        status:'01',
                        checkId:payObj.checkId
                    })
                    bill.fillForInsert();
                    await bill.save(trx);
                    //修改订单信息
                    let order = await Order.findNumber(payObj.number);
                    await order.updatePayedMoney(payObj.total_fee,payObj.type,bill.checkId,bill.paymentType,trx);
                }while(0);

                return trx.commit();
            }catch(error){
                return trx.rollback(error);
            }
        })
    }
    static async checkFromWX(inParam,nextNotifyFunction=null){
        let code = 'SUCCESS'
        let msg  = 'OK'
        let isResend = false;

        let payObj = await this.find(inParam.attach,true);
        if(!payObj){
            code = 'FAIL'
            msg = '未通过attach找到对账单'
            nextNotifyFunction&&nextNotifyFunction(code,msg,isResend);
            return;
        }
        //首先进行单号和金额确认
        do{
            if(payObj.out_trade_no != inParam.out_trade_no){
                code = 'FAIL'
                msg = "单号不对"
                break;
            }
            if(payObj.total_fee != inParam.total_fee){
                code = 'FAIL'
                msg = "金额不对"
                break;
            }
            if(payObj.result_code){
                code = 'FAIL'
                msg = '重复的消息'
                break;
            }
        }while(0);
        if(code != 'SUCCESS'){
            nextNotifyFunction&&nextNotifyFunction(code,msg,isResend);
            //投入死信队列
            sendToUNHandle(MsgNames.WXPayCheckFAIL,inParam,msg);
            return;
        }
        //进行订单支付相关事务性修改
        try{
            await payObj.checkAndTranscation(inParam);
        }catch(error){
            console.log('微信支付处理失败')
            console.log(error);
            //当捕捉到异常后尝试将该消息投放入订单延迟队列反复测试
            let isSend = await sendToDelayMQ(QueueName.OrderDelayQueue,MsgNames.WXPayNotify,inParam,10000);
            //如果投递失败那么就让微信重发吧
            if(!isSend){
                isResend = true;
            }
        }
        nextNotifyFunction&&nextNotifyFunction(code,msg,isResend);
    }
    //从延迟队列来的消息
    static async checkFromQueue(inParam){
        let result  = false;
        try{
            let payObj = await this.find(inParam.attach);
            await payObj.checkAndTranscation(inParam);

            result = true;
        }catch(err){
            console.error("从队列里取到的微信支付检查失败")
            console.error(err);
            let isSend = await sendToDelayMQ(QueueName.OrderDelayQueue,MsgNames.WXPayNotify,inParam,10000);
            if(isSend) result = true;
        }
        return result;
    }
}
export  {wxpay,WXPay};
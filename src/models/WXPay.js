const genLongID  = require('../genID/longID').genLongID
const G_MODULE_WXPAYCHECK_NAME =  'wxpaycheck'
const G_TABLE_NAME = 't_hm101_wxpaycheck'
import db from '../db/db'
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
        console.log(params);
        console.log('string='+string);
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
        console.log('string=', string);
        var crypto = require('crypto');
        return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    },
    /**
     *签名加密算法,第二次的签名
     *看文档说5个参数https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
     *这个别人写有6个参数
     *多个 partnerid
     *todo
     */

    paysignjsapifinal: function (appid,mch_id,prepayid,noncestr,timestamp,mchkey) {
        var ret = {
            appid: appid,
            prepayid: prepayid,
            package: 'Sign=WXPay',
            noncestr: noncestr,
            timestamp: timestamp,
        };
        console.log('retretret=='+ret);
        var string = raw(ret);
        var key = mchkey;
        string = string + '&key=' + key;
        console.log('stringstringstring=', string);
        var crypto = require('crypto');
        return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    },
    getXMLNodeValue: function (xml) {
        // var tmp = xml.split("<"+node_name+">");
        // console.log('tmp',tmp);
        // var _tmp = tmp[1].split("</"+node_name+">");
        // console.log('_tmp',_tmp);
        // return _tmp[0];
        xmlreader.read(xml, function (errors, response) {
            if (null !== errors) {
                console.log(errors)
                return;
            }
            console.log('长度===', response.xml.prepay_id.text().length);
            var prepay_id = response.xml.prepay_id.text();
            console.log('解析后的prepay_id==',prepay_id);
            return prepay_id;
        });
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

        this.nonce_str = data.nonce_str;
        this.body = data.body;
        this.out_trade_no = data.out_trade_no;
        this.spbill_create_ip = data.spbill_create_ip;
        this.total_fee = data.total_fee;
        this.trade_type = data.trade_type;
        this.userId = data.userId
        this.notify_url = data.notify_url;
        this.code = data.code;
        this.number = data.number;
        this.err_code = data.err_code;
        this.err_code_desc = data.err_code_desc;
        this.transcation_id = data.transcation_id;
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
        this.status = '01';
        this.operateFlag = 'A';
        this.out_trade_no = ''+this.id+"_"+this.number
    }
    async store(){
        await db(G_TABLE_NAME).insert(this);
    }
    static async find(id){
        let db_results = await db(G_TABLE_NAME).select('*').where({id:id});
        if(db_results[0].length != 1) throw new Error("微信支付未找到对账单:"+id);
        let payObj = new WXPay(db_results[0]);
        return payObj;
    }
}
export  {wxpay,WXPay};
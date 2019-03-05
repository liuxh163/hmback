
import redisdb from '../db/redis'
import dateFormat from 'date-fns/format'
import {sendToMQ,MsgNames,QueueName} from '../msgcenter/msgCenter'
//订单号
const G_MODULE_ORDERNUMBER_NAME = "ordernumber"
//出行订单人员号
const G_MODULE_ORDERPEOPLE_NAME = "orderpeople"

/**
 * 模块名映射，
 * 目前不做校验，但是必须为3位数字
 */



function prefixInteger(num,length) {
    return (Array(length).join('0') + num).slice(-length);
}
async function genLongID(module_name,prefix,digit){
    let idStr = '';
    idStr += prefix;
    if(idStr.length > digit) throw new Error('genLong overflow');
    let key = module_name+"_"+prefix+"_id";
    let incID = await redisdb.incr(key);
    idStr += prefixInteger(incID,digit-idStr.length);
    console.debug('genid:'+idStr+" key:"+key);
    sendToMQ(QueueName.LongIDQueue,MsgNames.SaveID,{name:key});
    return idStr;
}
/**
 * 
 * @param {*} module_name 
 * @param {*} tag  自定义标识
 * @param {*} prefix 前缀号,必须为2位数字,目前用做分库号
 *    前缀2  自有标识3   年月日6      自增号
 *   | --- | --- | -------- | ---------- |
 */
async function genOrderID(tag = '01',fkh = 10){
    let prefix = '';
    prefix += fkh;
    prefix += tag;
    let date = new Date;
    let dateStr = dateFormat(date,"YYMMDD");
    prefix += dateStr;
    return await genLongID(G_MODULE_ORDERNUMBER_NAME,prefix,19);
}
async function genOrderPeopleID(){
    return await genLongID(G_MODULE_ORDERNUMBER_NAME,'10',10);
}
module.exports = {
    genLongID:genLongID,
    genOrderPeopleID:genOrderPeopleID,
    genOrderID:genOrderID
}
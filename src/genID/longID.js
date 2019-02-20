
import redisdb from '../db/redis'
import dateFormat from 'date-fns/format'

//订单号
const G_MODULE_ORDERNUMBER_NAME = "ordernumber"
//出行订单人员号
const G_MODULE_ORDERPEOPLE_NAME = "orderpeople"

/**
 * 模块名映射，
 * 目前不做校验，但是必须为3位数字
 */

let ModuleMap = {};
ModuleMap[G_MODULE_ORDERNUMBER_NAME] = '001';
ModuleMap[G_MODULE_ORDERPEOPLE_NAME] = '002';
function prefixInteger(num,length) {
    return (Array(length).join('0') + num).slice(-length);
}
/**
 * 
 * @param {*} module_name 
 * @param {*} digit  位数,默认为19
 * @param {*} prefix 前缀号,必须为2位数字,目前用做分库号
 *    前缀2  模块3   年月日6      自增号
 *   | --- | --- | -------- | ---------- |
 */
async function genLongID19(module_name,prefix=20) {
    let modulecode = ModuleMap[module_name];
    if(!modulecode) throw('unexpect module name')
    let idStr = '';
    idStr += prefix;
    idStr += modulecode;
    let date = new Date;
    let dateStr = dateFormat(date,"YYMMHH");
    idStr += dateStr;
    let key = module_name+"_"+prefix+"_"+dateStr+"_id";
    let incID = await redisdb.incr(key);
    idStr += prefixInteger(incID,8);
    return idStr;
//    return 1000000000 + await redisdb.incr(module_name+prefix+"_id");
}


async function genOrderID(prefix = 10){
    return await genLongID19(G_MODULE_ORDERNUMBER_NAME,prefix);
}
module.exports = {
    genOrderID:genOrderID
}
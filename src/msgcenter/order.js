import {Order} from '../models/Order'
import {WXPay} from '../models/WXPay'
import {ProcesserACK} from '../amqp/ProcesserFactory'

async function prepayExpire(data){
    let order = await Order.findNumber(data.number);
    await order.prepayExpire();
}

async function wxpay_notify(data){
    let result = await WXPay.checkFromQueue(data);
    if(!result) return  ProcesserACK.REQUE
}
export {prepayExpire,wxpay_notify}
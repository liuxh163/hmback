import {Order} from '../models/Order'
import {WXPay} from '../models/WXPay'
import {ProcesserACK} from '../amqp/ProcesserFactory'

async function prepayExpire(data){
    let order = await Order.findNumber(data.number);
    await order.prepayExpire();
}
async function postpayExpire(data){
    let order = await Order.findNumber(data.number);
    await order.postpayExpire();
}
async function wxpay_notify(data){
    let result = await WXPay.checkFromQueue(data);
    if(!result) return  ProcesserACK.REQUE
}
async function ended(data){
    let order = await Order.findNumber(data.number);
    await order.ended();
}
export {prepayExpire,wxpay_notify,postpayExpire,ended}
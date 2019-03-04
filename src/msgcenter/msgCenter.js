import  {initQueue,QueueName} from '../amqp/initQueue'
import  {initConsumer} from '../amqp/initConsumer'
import {registProcesser,MsgNames} from '../amqp/ProcesserFactory'
import {sendToMQ,sendToDelayMQ,sendToUNHandle} from '../amqp/publisher'
import saveID from './saveID'
import {prepayExpire,wxpay_notify} from './order'

let isMQStarted = false;
async function startMQ(){
    try{
        registProcesser(QueueName.LongIDQueue,MsgNames.SaveID,saveID);
        registProcesser(QueueName.OrderDelayQueue,MsgNames.PrepayExpire,prepayExpire);
        registProcesser(QueueName.OrderDelayQueue,MsgNames.WXPayNotify,wxpay_notify)
        await initQueue();
        await initConsumer();
        isMQStarted = true;
    }catch(error){
        console.error(error);
        process.exit(2);
    };
}

export {startMQ,sendToMQ,sendToDelayMQ,sendToUNHandle,MsgNames,QueueName};
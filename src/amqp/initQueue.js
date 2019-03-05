const AMQP = require('amqplib')
import getAMQPConfig from './amqp'
let QueueName = {
    UnHandle:"UnHandle",
    OrderDelayQueue:"orderDelay",
    DelayOrderQueue:"delayOrder",
    LongIDQueue:"LongID"
}
let Exchanges = {
    DLXExchange:"DLX"
}
//delayq = q;
let open = null;
let channel = null;
async function openQueue(){
    const conf = getAMQPConfig();
    open = await AMQP.connect(conf);
    channel = await open.createChannel();
}
async function declareDLX(){
    let exchange = await channel.assertExchange(Exchanges.DLXExchange,"direct");
}
async function declareNormalQueue(qName){
    let ret = await channel.assertQueue(qName,{
        deadLetterExchange: Exchanges.DLXExchange,
        deadLetterRoutingKey: QueueName.UnHandle        
    });
}
async function declareDelayQueue(qName){
    let stroe_qName = qName+"_store";
    let ret = await channel.assertQueue(stroe_qName,{
        deadLetterExchange: Exchanges.DLXExchange,
        deadLetterRoutingKey:qName       
    });
    await declareNormalQueue(qName);
    await channel.bindQueue(qName,Exchanges.DLXExchange,qName);
}
async function declareUnHandleQueue(){
    let ret = await channel.assertQueue(QueueName.UnHandle);
    await channel.bindQueue(QueueName.UnHandle,Exchanges.DLXExchange,QueueName.UnHandle);
}

async function initQueue(){
    await openQueue();
    await declareDLX();
    await declareUnHandleQueue();

    await declareDelayQueue(QueueName.OrderDelayQueue)
    await declareNormalQueue(QueueName.LongIDQueue);
}

export {initQueue,channel,QueueName,Exchanges};


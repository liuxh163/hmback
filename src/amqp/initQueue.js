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
// async function declareDelayQueue(){
//     //订单的延迟初始化队列
//     let ret = await channel.assertQueue(QueueName.DelayOrderSaveQueue,{
//         deadLetterExchange: Exchanges.DLXExchange,
//         deadLetterRoutingKey: RoutingKeys.DLX        
//     });
    //订单的延迟队列
//     //
//     ret = await channel.assertQueue(QueueName.DelayQueue,{
//         deadLetterExchange: Exchanges.DLXExchange,
//         deadLetterRoutingKey: RoutingKeys.UnHandle        
//     });
//     ret = await channel.bindQueue(QueueName.DelayQueue,Exchanges.DLXExchange,RoutingKeys.DLX);


//     ret = await channel.assertQueue(QueueName.LongIDQueue,{
//         deadLetterExchange: Exchanges.DLXExchange,
//         deadLetterRoutingKey: RoutingKeys.UnHandle        
//     });


//     ret = await channel.assertQueue(QueueName.UnHandleQueue);
//     ret = await channel.bindQueue(QueueName.UnHandleQueue,Exchanges.DLXExchange,RoutingKeys.UnHandle)
// }
async function consumer(){
    try{
        let channel = await open.createChannel();
        let ret = await channel.assertQueue(realQ);
        ret = await channel.consume(realQ,function(msg){
            if (msg !== null) {
                console.log(123);
                console.log(msg.content.toString());
                console.log(msg.properties.headers)
                channel.ack(msg);
              }
        })
        console.log(ret)
    }catch(e){
        console.log(e);
    };
}
async function initQueue(){
    await openQueue();
    await declareDLX();
    await declareUnHandleQueue();

    await declareDelayQueue(QueueName.OrderDelayQueue)
    await declareNormalQueue(QueueName.LongIDQueue);
}

export {initQueue,channel,QueueName,Exchanges};


/*
        console.log(ret)
        ret = await channel.assertQueue(realQ);
        console.log(ret)
        ret = await channel.bindQueue(realQ,DLXExchange,DLXExchange);
        ret = await channel.sendToQueue(delayq,Buffer.from(JSON.stringify({a:"bweihuweiclewubcek"})),
        {expiration:10000,headers:{a:"b",c:"d"}})
        */
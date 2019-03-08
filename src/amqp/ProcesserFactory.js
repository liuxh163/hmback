


let factory = {}
const ProcesserACK = {
    OK:0,///< 接受消息
    REQUE:1///<放回队列
}

function registProcesser(qName,msgName,processer){
    let qFactory = factory[qName];
    if(!qFactory) {
        qFactory = {};
        factory[qName] = qFactory;
    }
    qFactory[msgName] = processer;
}
function getProcesser(qName,msgName){
    let qFactory = factory[qName];
    if(!qFactory) return null;
    let processer = qFactory[msgName];
    if(!processer) return null;
    return processer;
}
function getInterstingQueues(){
    return Object.keys(factory);
}
const MsgNames={
    SaveID:"saveID",


    //orders
    PrepayExpire:"PrepayExpire",
    PostpayExpire:"PostpayExpire",
    WXPayCheckFAIL:"WXPayCheckFail",
    WXPayNotify:"WXPayNotify",
    OrderStatusFlowException:"OrderStatusFlowException"
}
export  {registProcesser,getProcesser,ProcesserACK,getInterstingQueues,MsgNames}
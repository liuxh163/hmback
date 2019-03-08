import  {channel,QueueName} from './initQueue'
import {registProcesser,getProcesser,ProcesserACK,getInterstingQueues} from './ProcesserFactory'


async function initConsumer(){
    let queues = getInterstingQueues();
    for(let i = 0 ; i < queues.length ; ++i){
        let qName = queues[i];
        let ret = await channel.consume(qName,async function(msg){
            if (msg !== null) {
                let content = null;
                try{
                    content = JSON.parse(msg.content.toString());
                }catch(error){
                    console.error('not valid msg');
                    channel.ack(msg);
                    return;
                }
                console.debug(content);
                if(!content.name || !content.data){
                    console.error('not valid msg');
                    channel.ack(msg);
                    return;
                }
                let processer = getProcesser(qName,content.name);
                if(!processer){
                    console.error("自动应答没有消费者:"+qName+" name:"+content.name);
                    channel.ack(msg);
                    return;
                }
                try{
                    let result = await processer(content.data);
                    if(result == ProcesserACK.OK){
                        channel.ack(msg);
                    } else if(result == ProcesserACK.REQUE){
                        channel.nack(msg);
                    } else {
                        channel.ack(msg);
                    }
                }catch(error){
                    console.error("消费处理器异常:"+qName+" name:"+content.name);
                    console.error(error);
                    console.error("将该消息放入异常队列")
                    channel.reject(msg,false);
                }
            }
        })
    }
    
}
export {initConsumer}
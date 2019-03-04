import  {channel} from '../amqp/initQueue'
import { QueueName } from '../msgcenter/msgCenter';

async function sendToMQ(qName,msgName,data){
    let result = false;
    try{
        let param = {
            name:msgName,
            data:data
        }
        result = await channel.sendToQueue(qName,Buffer.from(JSON.stringify(param)));
    }catch(error){
        console.error(error)
    }
    return result;
}
async function sendToDelayMQ(qName,msgName,data,expiration){
    qName = qName + '_store';
    let result = false;
    try{
        let param = {
            name:msgName,
            data:data
        }
        console.debug(param)
        result = await channel.sendToQueue(qName,Buffer.from(JSON.stringify(param)),
        {expiration:expiration});
    }catch(error){
        console.error(error)
    }
    return result;
}
async function sendToUNHandle(msgName,data,reason){
    let result = false;
    try{
        let param = {
            name:msgName,
            data:data,
            reason:reason
        }
        result = await channel.sendToQueue(QueueName.UnHandle,Buffer.from(JSON.stringify(param)));
    }catch(error){
        console.error(error)
    }
    return result;
}
export  {sendToMQ,sendToDelayMQ,sendToUNHandle}
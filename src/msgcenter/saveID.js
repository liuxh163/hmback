import {ProcesserACK} from '../amqp/ProcesserFactory'
import SaveID from '../models/SaveID'

async function saveID(data){
    try{
        let obj = new SaveID(data);
        await obj.save();
    }catch(error){
        console.error(error);
    };
    return ProcesserACK.OK;
}

export default saveID

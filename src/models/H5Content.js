import db from '../db/db'
async function getH5Content(id,trx){
    let retVal = "";
    if(!id) return retVal;
    let curDB = trx||db;
    let x = await curDB('t_hm101_htmls').select('content').where({id:id});
    
    if(x.length >0 ){
        retVal = x[0].content;
    }
    return retVal;
}
export {getH5Content};
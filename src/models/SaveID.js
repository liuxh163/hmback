const redis = require('../db/redis')
const db = require('../db/db')

const G_TABLE_NAME = "t_hm101_longid";
class SaveID{
    constructor(data){
        this.id = data.id;
        this.name = data.name;
        this.value = data.value;
    }
    async save(){
        let val = await redis.get(this.name);
        if(!val) return;
        this.value = val;
        let [result] = await db(G_TABLE_NAME).select('*').where({name:this.name});
        if(!result){
            await db(G_TABLE_NAME).insert(this);
        }else{
            await db(G_TABLE_NAME).update({value:this.value});
        }
    }
}
export default SaveID;
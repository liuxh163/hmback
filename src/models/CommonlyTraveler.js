import db from '../db/db'
import LongID from '../genID/longID'
import dateFormat from 'date-fns/format';
import hmpinyin from '../pinyin'
const G_TABLE_NAME = 't_hm101_commonlytraveler'

class CommonlyTraveler {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.userId = data.userId

        this.firstName = data.firstName
        this.lastName = data.lastName
        this.firstPinyin = data.firstPinyin
        this.lastPinyin = data.lastPinyin
        this.passport = data.passport
        this.passExpiry = data.passExpiry
        this.birthday = data.birthday
        this.gender = data.gender
        this.travelType = data.travelType

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
    /**
     * 查询所有常用出行人
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    static async all(userId) {
        let result = [];
        let dbResult = await db(G_TABLE_NAME).select('*').where({userId:userId}).whereNot({operateFlag:'D'});
        for(let i = 0 ; i < dbResult.length ; ++i){
            let ct = new CommonlyTraveler(dbResult[i]);
            ct.formatToClient();
            result.push(ct);
        }
        return result;
    }
    async save(userId){
        this.id = await LongID.genOrderPeopleID();
        this.userId = userId;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = userId;
        this.operateFlag = 'A';
        this.firstPinyin = hmpinyin(this.firstName);
        this.lastPinyin = hmpinyin(this.lastName);
        await db(G_TABLE_NAME).insert(this);
    }
    async store(userId){
        let id = this.id;
        delete this.id;
        delete this.userId;
        delete this.createdAt;
        delete this.age;

        this.updatedAt = new Date();
        this.operator = userId;
        this.operateFlag = 'U';
        if(this.firstName){
            this.firstPinyin = hmpinyin(this.firstName);
        }
        if(this.lastName){
            this.lastPinyin = hmpinyin(this.lastName);
        }

        await db(G_TABLE_NAME).update(this).where({id:id});
        this.id = id;
    }
    async del(userId){
        await db(G_TABLE_NAME).update({operateFlag:'D'}).where({id:this.id});
    }
    formatToClient(){
        this.birthday = dateFormat(new Date(this.birthday), 'YYYY-MM-DD');
        this.passExpiry = dateFormat(new Date(this.passExpiry), 'YYYY-MM-DD');
        let birthday = new Date(this.birthday);
        let age = Date.now() - birthday;
        let date_age = new Date(age);
        age = date_age.getFullYear()-1970;
        this.age = age;
    }
    static async find(id,allowNonExist = false){
        return await findById(id);
    }
}

async function findById(id,allowNonExist = false) {
   
    let [dbct] = await db(G_TABLE_NAME)
        .select('*')
        .where({ id: id })
    if(!dbct && !allowNonExist) throw new Error("no commonlyTraveler:"+id);
    if(!dbct) return null;
    let ct = new CommonlyTraveler(dbct);
    return ct;

}

export { CommonlyTraveler, findById }

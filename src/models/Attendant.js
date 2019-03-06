import db from '../db/db'

class Attendant {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.price = data.price
        this.gender = data.gender
        this.status = data.status
        this.type = data.type

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
    /**
     * 查询所有附加项
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    static async all(request) {
        // 构建查询where条件
        let conditions = {
            status:'01',
            hospitalId:request.hospitalId
        };
        let notConditions = {
            operateFlag:"D"
        };
        
        let db_results = await db('t_hm101_attendants')
                .select('*')
                .where(conditions)
                .whereNot(notConditions);
        let results = [];
        for(let i = 0 ; i < db_results.length ; ++i){
            let att = new Attendant(db_results[i]);
            results.push(att);
        }
        return results;

    }
    static async find(id,allowNonExist = false) {
        return await findById(id,allowNonExist);
    }

    async store() {
        try {
            return await db('t_hm101_attendants').insert(this)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_attendants')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    formatForClient() {
        this.price = this.price/100;
    }

}

async function findById(id,allowNonExist = false) {
   
    let [contentData] = await db('t_hm101_attendants')
        .select('*')
        .where({ id: id })
    if(!contentData && !allowNonExist) throw new Error("no attendants:"+id);
    if(!contentData) return null;

    return new Attendant(contentData);

}

export { Attendant, findById }

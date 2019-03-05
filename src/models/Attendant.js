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
    async all(request) {
        try {
            // 构建查询where条件
            let conditions = {
                status:request.status
            };
            let notConditions = {
                operateFlag:"D"
            };
            // 删除不存在的条件
            Object.keys(conditions).forEach(function(param, index){
                if(undefined === conditions[param]){
                    delete conditions[param];
                }
            });
            if("{}" !== JSON.stringify(conditions)){
                return await db('t_hm101_attendants')
                    .select('*')
                    .where(conditions)
                    .whereNot(notConditions);
            }else{
                return await db('t_hm101_attendants')
                    .select('*')
                    .whereNot(notConditions);
            };
            
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    async find(id) {
        try {
            let result = await findById(id)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
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

}

async function findById(id) {
   
    let [contentData] = await db('t_hm101_attendants')
        .select('*')
        .where({ id: id })
    if(!contentData) throw new Error("no attendants:"+id);
    return contentData

}

export { Attendant, findById }

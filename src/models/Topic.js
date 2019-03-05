import db from '../db/db'

class Topic {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

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
                return await db('t_hm101_topics')
                    .select('*')
                    .where(conditions)
                    .whereNot(notConditions);
            }else{
                return await db('t_hm101_topics')
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
            return await db('t_hm101_topics').insert(this)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_topics')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [topicData] = await db('t_hm101_topics')
            .select('*')
            .where({ id: id })
        return topicData
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}

export { Topic, findById }

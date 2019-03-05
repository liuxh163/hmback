import db from '../db/db'

class Tag {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.target = data.target
        this.targetId = data.targetId
        this.name = data.name
        this.tagerId = data.tagerId

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            // 构建查询where条件
            let conditions = {
                target: request.target,
                targetId:request.targetId
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
                return await db('t_hm101_tags')
                    .select('*')
                    .where(conditions)
                    .whereNot(notConditions)
                    .orderBy('updatedAt', 'desc');
            }else{
                return await db('t_hm101_tags')
                    .select('*')
                    .whereNot(notConditions)
                    .orderBy('updatedAt', 'desc');
            };
            
        } catch (error) {
            console.loerrorg(error)
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
            return await db('t_hm101_tags').insert(this)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async destroy() {
        try {
            return await db('t_hm101_tags')
                .update({operateFlag: 'D',
                    updatedAt:this.updatedAt,
                    operator:this.operator})
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [tagData] = await db('t_hm101_tags')
            .select('*')
            .where({ id: id })
        return tagData
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}

async function findByPid(pid) {
    try {
        let tagData = await db('t_hm101_tags')
            .select('name')
            .where({ targetId: pid });
        return tagData;
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}
export { Tag, findById, findByPid }

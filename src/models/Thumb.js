import db from '../db/db'

class Thumb {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.target = data.target
        this.targetId = data.targetId
        this.likerId = data.likerId
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async find(request) {
        try {
            // 构建查询where条件
            let conditions = {
                target: request.target,
                targetId:request.targetId,
                likerId:request.likerId,
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
            let result;
            if("{}" !== JSON.stringify(conditions)){
                result = await db('t_hm101_thumbs')
                .select('*')
                .where(conditions)
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc');
            }else{
                result = await db('t_hm101_thumbs')
                .select('*')
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc');
            };

            if (!result) return {}
            this.constructor(result[0])
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('t_hm101_thumbs')
                .insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_thumbs')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

async function isLike(userId,target,targetId){
   let rows = await db('t_hm101_thumbs').select('id').where({likerId:userId,target:target,targetId:targetId});
   return rows.length>0;
}
export { Thumb ,isLike}

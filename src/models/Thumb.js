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
            let result = await db('t_hm101_thumbs')
                .select('*')
                .where({ target: request.target, targetId:request.targetId ,likerId:request.likerId})
                .orderBy('updatedAt', 'desc');
            // Object.keys(result[0]).forEach(function(param,index){
            //     console.log("result  attr "+param+" is "+result[0][param])
            // })
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

export { Thumb }

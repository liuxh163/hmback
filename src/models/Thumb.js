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

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async count(request) {
        try {
            return await db('t_hm101_thumbups')
                .where({ target: request.target, targetId:request.targetId })
                .count('1')
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async find(request) {
        try {
            return await db('t_hm101_thumbups')
                .select('*')
                .where({ target: request.target, targetId:request.targetId ,linkerId:request.likerId})
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('t_hm101_thumbups').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_thumbups')
                .delete()
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

export { Thumb }

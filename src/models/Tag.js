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
            return await db('t_hm101_tags')
                .select('*')
                .where({ target: request.target, targetId:request.targetId })
                .orderBy('updatedAt', 'desc')
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    async find(id) {
        try {
            let result = await findById(id)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    async store() {
        try {
            return await db('t_hm101_tags').insert(this)
        } catch (error) {
            console.log(error)
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
            console.log(error)
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
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Tag, findById }

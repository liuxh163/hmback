import db from '../db/db'
import rand from 'randexp'

class Note {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.productId = data.productId
        this.desc = data.desc
        this.picPath = data.picPath
        this.ranks = data.ranks
        this.name = data.name
        this.nation = data.nation

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_product_experts')
                .select('*')
                .where({ productId: request.productId })
                .orderBy('createdAt', 'desc')
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
            return await db('t_hm101_product_experts').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_product_experts')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_product_experts')
                .delete()
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [noteData] = await db('t_hm101_product_experts')
            .select('*')
            .where({ id: id })
        return noteData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Note, findById }

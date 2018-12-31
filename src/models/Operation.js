import db from '../db/db'

class Operation {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.target = data.target
        this.targetId = data.targetId
        this.contentH5Id = data.contentH5Id
        this.name = data.name
        this.content = data.content
        this.var1Name = data.var1Name
        this.var1Value = data.var1Value
        this.var2Name = data.var2Name
        this.var2Value = data.var2Value
        this.startTime = data.startTime
        this.endTime = data.endTime

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_product_operations')
                .select('*')
                .where({ target: request.target, targetId: request.targetId })
                .orderBy('updatedAt', request.order)
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
            return await db('t_hm101_product_operations').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_product_operations')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_product_operations')
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
        let [operationData] = await db('t_hm101_product_operations')
            .select('*')
            .where({ id: id })
        return operationData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Operation, findById }

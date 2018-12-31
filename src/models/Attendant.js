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
        this.target = data.target
        this.status = data.status
        this.type = data.type

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
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
            return await db('t_hm101_attendants').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_attendants')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

}

async function findById(id) {
    try {
        let [contentData] = await db('t_hm101_attendants')
            .select('*')
            .where({ id: id })
        return contentData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Attendant, findById }

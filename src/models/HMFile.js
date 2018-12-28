import db from '../db/db'

class HMFile {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.type = data.type
        this.path = data.path

        this.operator = data.operator
        this.operatorFlag = data.operatorFlag
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
            return await db('t_hm101_files').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

}

async function findById(id) {
    try {
        let [fileData] = await db('t_hm101_files')
            .select('id', 'name', 'type', 'path')
            .where({ id: id })
        return fileData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { HMFile, findById }

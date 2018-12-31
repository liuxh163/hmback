import db from '../db/db'

class H5content {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.desc = data.desc
        this.content = data.content

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
            return await db('contentData').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

}

async function findById(id) {
    try {
        let [contentData] = await db('t_hm101_htmls')
            .select('id', 'desc', 'content')
            .where({ id: id })
        return contentData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

async function findContentById(id) {
    try {
        let contentData = await db('t_hm101_htmls')
            .select('content')
            .where({ id: id })
        return contentData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { H5content, findById }

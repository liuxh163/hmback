import db from '../db/db'
import rand from 'randexp'

class Servant {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.intro = data.intro
        this.picPaht = data.picPaht
        this.type = data.type
        this.status = data.status
        this.nation = data.nation
        this.service = data.service
        this.introH5Id = data.introH5Id
        this.literPrice = data.literPrice
        this.followPrice = data.followPrice
        this.recepPrice = data.recepPrice

        this.operator = data.operator
        this.operatorFlag = data.operatorFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_servants')
                .select('*')
                .where({ type: request.type, nation: request.nation })
                .orderBy('updatedAt', 'desc')
                .offset(+request.pages * +request.pageNum)
                .limit(+request.pageNum)
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
            return await db('t_hm101_servants').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_servants')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_servants')
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
        let [servantData] = await db('t_hm101_servants')
            .select('*')
            .where({ id: id })
        return servantData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Servant, findById }

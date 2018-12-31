import db from '../db/db'

class Channel {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.channelNum = data.channelNum
        this.contact = data.contact
        this.telephone = data.telephone
        this.bizCode = data.bizCode

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_channels')
                .select('*')
                .orderBy('updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number)
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
            return await db('t_hm101_channels').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_channels')
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
        let [channelData] = await db('t_hm101_channels')
            .select('*')
            .where({ id: id })
        return channelData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Channel, findById }

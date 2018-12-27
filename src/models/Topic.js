import db from '../db/db'
import rand from 'randexp'

class Topic {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.description = data.description
    }

    async all(request) {
        try {
            return await db('t_hm101_topics')
                .select('id', 'name', 'description')
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
            return await db('t_hm101_topics').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_topics')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_topics')
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
        let [noteData] = await db('t_hm101_topics')
            .select('id', 'name', 'description')
            .where({ id: id })
        return noteData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Topic, findById }

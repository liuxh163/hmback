import db from '../db/db'
import rand from 'randexp'

class Note {
    constructor(data) {
        if (!data) {
            return
        }

        this.id = data.id
        this.topicId = data.topicId
        this.title = data.title
        this.contentH5Id = data.contentH5Id
        this.posterId = data.posterId
        this.views = data.views
        this.location = data.location
    }

    async all(request) {
        try {
            return await db('t_hm101_posts')
                .select('*')
                .where({ topicId: request.topicId })
                .orderBy('updatedAt', request.order)
                .offset(+request.pages * +request.pagenum)
                .limit(+request.pagenum)
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
            return await db('t_hm101_posts').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_posts')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_posts')
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
        let [noteData] = await db('t_hm101_posts')
            .select('id', 'topicId', 'title', 'contentH5Id', 'posterId', 'views', 'location')
            .where({ id: id })
        return noteData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Note, findById }

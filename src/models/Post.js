import db from '../db/db'
import rand from 'randexp'

class Post {
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

        this.operator = data.operator
        this.operatorFlag = data.operatorFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_posts')
                .select('id', 'topicId', 'title', 'contentH5Id', 'posterId', 'views', 'location')
                .where({ topicId: request.topicId })
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
            if (!result) {
                await views(id)//更新帖子查看数
                return {}
            }
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
        let [postData] = await db('t_hm101_posts')
            .select('id', 'topicId', 'title', 'contentH5Id', 'posterId', 'views', 'location')
            .where({ id: id })
        return postData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

async function views(id) {
    try {
        // let views = await db('t_hm101_posts')
        //     .select('views')
        //     .where({ id: id })
        return await db('t_hm101_posts')
            .update({views:views+1})
            .where({ id: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Post, findById }

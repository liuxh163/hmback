import db from '../db/db'

class Comment {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.target = data.target
        this.targetId = data.targetId
        this.contentH5Id = data.contentH5Id
        this.content = data.content
        this.commenterId = data.commenterId

        this.operator = data.operator
        this.operatorFlag = data.operatorFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db({a:'t_hm101_comments',b:"t_hm101_htmls"})
                .select('a.*','b.content')
                .where({ target: request.target, targetId: request.targetId })
                .whereRaw('?? = ??', ['a.contentH5Id', 'b.id'])
                .orderBy('updateAt', 'desc')
                .offset(+request.pages * +request.pageNum)
                .limit(+request.pageNum)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('t_hm101_comments').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_comments')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_comments')
                .delete()
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

export { Comment }

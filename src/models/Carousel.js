import db from '../db/db'
import rand from 'randexp'

class Carousel {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.name = data.name
        this.desc = data.desc
        this.location = data.location
        this.productId = data.productId
        this.picPath = data.picPath
        this.target = data.target
        this.targetId = data.targetId
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            if(request.productId){
                return await db('t_hm101_carousels')
                .select('*')
                .where({ location: request.location,
                    productId: request.productId,
                    status:request.status })
                .orderBy('updatedAt', 'desc')
            }else{
                return await db('t_hm101_carousels')
                .select('*')
                .where({ location: request.location,
                    status:request.status })
                .orderBy('updatedAt', 'desc')
            }
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
            return await db('t_hm101_carousels').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_carousels')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_carousels')
                .update({operateFlag: 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [carouselData] = await db('t_hm101_carousels')
            .select('*')
            .where({ id: id })
        return carouselData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Carousel, findById }

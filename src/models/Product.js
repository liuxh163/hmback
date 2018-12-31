import db from '../db/db'

class Product {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.desc = data.desc
        this.nation = data.nation
        this.views = data.views
        this.featureH5Id = data.featureH5Id
        this.detailH5Id = data.detailH5Id
        this.routineH5Id = data.routineH5Id
        this.feeH5Id = data.feeH5Id
        this.noticeH5Id = data.noticeH5Id
        this.hospitalH5Id = data.hospitalH5Id
        this.itemH5Id = data.itemH5Id
        this.adultPrice = data.adultPrice
        this.companyPrice = data.companyPrice
        this.childPrice = data.childPrice
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_products')
                .select('*')
                .where({ nation: request.nation })
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
            return await db('t_hm101_products').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_products')
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
        let [productData] = await db('t_hm101_products')
            .select('*')
            .where({ id: id })
        return productData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Product, findById }

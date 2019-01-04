import db from '../db/db'

class Codes {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.parentId = data.parentId
        this.codeClass = data.codeClass
        this.classDesc = data.classDesc
        this.code = data.code
        this.codeDesc = data.codeDesc
        this.order = data.order
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all() {
        try {
            let result = await db('t_hm101_codes')
                .select('codeClass','classDesc','code','codeDesc','order')
                .where({status: '01'})
            // console.log('object codes === '+JSON.stringify(result))
            return  result
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

}

export { Codes }

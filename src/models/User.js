import db from '../db/db'

class User {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id;
        this.loginId = data.loginId;
        this.telephone = data.telephone;
        this.slogan = data.slogan;
        this.idNumber = data.idNumber;
        this.type = data.type;
        this.iconPath = data.iconPath;
        this.openId = data.openId;
        this.email = data.email;
        this.realName = data.realName;
        this.password = data.password;
        this.userName = data.userName;
        this.source = data.source;
        this.status = data.statusß;
        this.ipAddress = data.ipAddress;
        this.address = data.address;
        this.loginCount = data.loginCount

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            return await db('t_hm101_users')
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

    async findPhone(telephone) {
        try {
            let result = await findByPhone(telephone)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('t_hm101_users').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    async save(request) {
        try {
            return await db('t_hm101_users')
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
        const [result] = await db('t_hm101_users')
            .select('*')
            .where({ id: id })
        return result
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
async function findByPhone(telephone) {
    try {
        const [result] = await db('t_hm101_users')
            .select('id','telephone','userName','type')
            .where({ telephone: telephone, status: '01' })
        return result
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
export { User, findById, findByPhone }

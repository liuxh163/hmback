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
        this.status = data.status;
        this.birthday = data.birthday;
        this.gender = data.gender;
        this.ipAddress = data.ipAddress;
        this.address = data.address;
        this.loginCount = data.loginCount

        this.hmCoins = data.hmCoins;
        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            request.page = request.page || 1;
            request.number = request.number || 10000;
            // 构建查询where条件
            let conditions = {
                status:request.status
            };
            let notConditions = {
                operateFlag:"D"
            };
            // 删除不存在的条件
            Object.keys(conditions).forEach(function(param, index){
                if(undefined === conditions[param]){
                    delete conditions[param];
                }
            });
            if("{}" !== JSON.stringify(conditions)){
                return await db('t_hm101_users')
                    .select('*')
                    .where(conditions)
                    .whereNot(notConditions)
                    .orderBy('updatedAt', 'desc')
                    .offset(--request.page * +request.number)
                    .limit(+request.number);
            }else{
                return await db('t_hm101_users')
                    .select('*')
                    .whereNot(notConditions)
                    .orderBy('updatedAt', 'desc')
                    .offset(--request.page * +request.number)
                    .limit(+request.number);
            };
            
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async find(id,type="01") {
        try {
            let result = await findById(id,type)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async findPhone(telephone, type="01") {
        try {
            let result = await findByPhone(telephone,type)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 增加用户类型参数，默认普通用户，支持新建管理员
     * @param {用户类型} type 
     */
    async store(type="01") {
        try {
            this.type = type;
            return await db('t_hm101_users').insert(this)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    async save() {
        try {
            return await db('t_hm101_users')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id,type="01") {
    try {
        const [result] = await db('t_hm101_users')
            .select('*')
            .where({ id: id, type: type })
        return new User(result)
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}
async function findByPhone(telephone, type="01") {
    try {
        const [result] = await db('t_hm101_users')
            .select('id','telephone','userName','type','password','iconPath')
            .where({ telephone: telephone, status: '01', type: type })
        return result
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}
export { User, findById, findByPhone }

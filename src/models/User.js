import db from '../db/db'

class User {
    constructor(data) {
        if (!data) {
            return
        }

        this.id = data.id;
        this.loginid = data.loginid;
        this.telephone = data.telephone;
        this.slogan = data.slogan;
        this.idNumber = data.idNumber;
        this.type = data.type;

        this.operator = data.operator
        this.operatorFlag = data.operatorFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
}

async function findById(id) {
    try {
        const [userData] = db('users')
            .select('id', 'loginId', 'telephone','slogan', 'idNumber', 'type')
            .where({ loginId: id })
        return userData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { User, findById }

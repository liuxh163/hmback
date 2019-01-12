import db from '../db/db'

class File {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.type = data.type
        this.path = data.path
        this.name = data.name

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
}
async function FileStore(file) {
    try {
        return await db('t_hm101_files').insert(file).returning('id');
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

async function FilesQuery(ids) {
    try {
        let notConditions = {
            operateFlag:"D"
        };
        return await db('t_hm101_files')
            .select('id','name','type','path')
            .whereIn('id',ids)
            .whereNot(notConditions)
            .orderBy('updatedAt', 'desc');
        
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
export { File, FileStore, FilesQuery }

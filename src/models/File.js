import db from '../db/db'
const region = process.env.FILE_REGION
const bucket = process.env.FILE_BUKET

const region_internal = process.env.FILE_REGION_INTERNAL
const path_prefix = 'http://'+bucket+'.'+region+'.aliyuncs.com/'

class OssFileUtil{
    static absPath(path){
        if(!path ) return path;
        if(path == '') return path;
        path = this.relPath(path);
        path = path_prefix+path;
        return path;
    }
    static relPath(path){
        return path.replace(path_prefix,'');;
    }
}

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
        let ids = await db('t_hm101_files').insert(file).returning('id');
        return ids[0];
        //return await db('t_hm101_files').insert(file).returning('id');
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


export { OssFileUtil ,File ,FileStore,FilesQuery}

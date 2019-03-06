import db from '../db/db'
import rand from 'randexp'
import {OssFileUtil} from './File'
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
        this.picFileId = data.picFileId
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
            // 构建查询where条件
            let conditions = {
                location:request.location,
                productId:request.productId,
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
            let db_result = [];
            if("{}" !== JSON.stringify(conditions)){
                db_result= await db('t_hm101_carousels')
                .select('*')
                .where(conditions)
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
            }else{
                db_result = await db('t_hm101_carousels')
                .select('*')
                .whereNot(notConditions)
                .orderBy('updatedAt', 'desc')
            }
            let results = [];
            for(let i = 0 ; i < db_result.length ; ++i){
                let carousel = new Carousel(db_result[i]);
                results.push(carousel);
            }
            return results;
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async find(id) {
        try {
            let result = await findById(id)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('t_hm101_carousels').insert(this)
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('t_hm101_carousels')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('t_hm101_carousels')
                .update({operateFlag: 'D'})
                .where({ id: this.id })
        } catch (error) {
            console.error(error)
            throw new Error('ERROR')
        }
    }
    formatForClient(){
        // if(this.picFileId && this.picFileId != ''){
        //     this.picFileId = OssFileUtil.absPath(this.picFileId)
        // }
    }
}

async function findById(id) {
    try {
        let [carouselData] = await db('t_hm101_carousels')
            .select('*')
            .where({ id: id })
        return carouselData
    } catch (error) {
        console.error(error)
        throw new Error('ERROR')
    }
}

export { Carousel, findById }

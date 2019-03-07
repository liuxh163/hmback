import {Order,OrderGood} from './Order'
import db from '../db/db'
import { FilesQuery } from '../models/File'
import dateFormat from 'date-fns/format'


function formatDate(str){
    let date = null;
    if(str){
        date = new Date(str);
    }else{
        date = new Date();
    }
    return  dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
}
const G_TABLE_NAME = 't_hm101_good_estimate'
class GoodEstimate{
    constructor(data){
        this.id = data.id;
        this.userId = data.userId;
        this.number = data.number;
        this.target = data.target;
        this.targetId = data.targetId;
        this.content = data.content;
        this.picIds = data.picIds;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.scores    = data.scores;
        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
    }
    static async all(target,targetId,page,pageNum,escapeEmpty){
        let db_results = await db(G_TABLE_NAME).select('*')
                                .where({target:target,targetId:targetId})
                                .where(function(){
                                    if(escapeEmpty){
                                        this.whereNot({content:''})
                                    }
                                })
                                .orderBy('createdAt','desc')
                                .offset(page*pageNum).limit(pageNum);
        let results = [];
        for(let i = 0 ; i < db_results.length ; ++i){
            let est = new GoodEstimate(db_results[i]);
            await est.fillPic();
            await est.fillScore();
            results.push(est);
        }
        return results;
    }
    async fillPic(){
        if(this.picIds){
            let  picIds = this.picIds.split(',')
            // 获取帖子图片集合
            this.pictures = await FilesQuery(picIds);
        }else{
            this.pictures = [];
        }
    }
    async fillScore(){
        if(this.scores != ''){
            this.scores = JSON.parse(this.scores);
        }
    }
    async formatForClient(){
        this.createdAt =  formatDate(this.latestAt)
    }
    static async count(target,targetId){
        let db_result = await db(G_TABLE_NAME).count('id as count').where({target:target,targetId:targetId});
        return db_result[0].count;
    }
    async store(trx){
        trx = trx || db;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = this.userId;
        this.operateFlag = 'A';
        if(this.pictures){
            this.picIds = this.pictures.join(',');
            delete this.pictures;
        }
        if(this.scores){
            this.scores = JSON.stringify(this.scores);
        }

        await trx(G_TABLE_NAME).insert(this);
    }

    static async storeByNumber(params){
        let goods = await OrderGood.allNotEstimate(params.number);
        if(goods.length == 0){
            throw new Error('无法评价,没有可评价商品');
        }
        let  good = null;
        if(!params.target || ! params.targetId){
            if(goods.length != 1){
                throw new Error('无法评价,商品不对应')
            }
            good = goods[0];
        }else{
            for(let i = 0 ; i < goods.length ; ++i){
                if(goods[i].target == params.target && goods[i].targetId == params.targetId){
                    good  = goods[i];
                    break;
                }
            }
        }
        if(!good){
            throw new Error('无法评价,找不到商品')
        }

        params.target  = good.target;
        params.targetId = good.targetId;
        let est = new GoodEstimate(params);
        await db.transaction(async function(trx){
            try{
                await good.estimated(trx);
                await est.store(trx);
                if(goods.length == 1){
                    let order = new Order({number:params.number});
                    await order.estimated(trx);
                }
                return trx.commit();
            }catch(error){
                return trx.rollback(error);
            }
        })
    }
}

export default GoodEstimate;
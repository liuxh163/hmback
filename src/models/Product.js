import db from '../db/db'

class Product {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.desc = data.desc
        this.nation = data.nation
        this.featureH5Id = data.featureH5Id
        this.detailH5Id = data.detailH5Id
        this.routineH5Id = data.routineH5Id
        this.feeH5Id = data.feeH5Id
        this.noticeH5Id = data.noticeH5Id
        this.hospitalH5Id = data.hospitalH5Id
        this.itemH5Id = data.itemH5Id
        this.feature = data.feature
        this.detail = data.detail
        this.routine = data.routine
        this.fee = data.fee
        this.notice = data.notice
        this.hospital = data.hospital
        this.item = data.item
        this.adultPrice = data.adultPrice
        this.womenPrice = data.womenPrice
        this.companyPrice = data.companyPrice
        this.childPrice = data.childPrice
        this.status = data.status
        this.viewNum = data.viewNum
        this.thumbNum = data.thumbNum
        this.commentNum = data.commentNum
        this.experts = data.experts
        this.operations = data.operations

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }

    async all(request) {
        try {
            let result = await db.select('a.id','a.desc','a.nation','a.adultPrice','a.viewNum','b.content as detail')
                .from('t_hm101_products as a')
                .leftJoin('t_hm101_htmls as b','a.detailH5Id', 'b.id')
                .where({ nation: request.nation })
                .orderBy('a.updatedAt', 'desc')
                .offset(--request.page * +request.number)
                .limit(+request.number);
            // 获取点赞数及评论数
            for(var i in result){
                console.log("product-"+i+":"+result[i].detail)
                // 获取点赞数
                let thumbNum = await getThumbs(result[i].id)
                result[i].thumbNum = thumbNum[0].count;
                // 获取评论数
                let commentNum = await getComments(result[i].id)
                result[i].commentNum = commentNum[0].count;
            }
            return result;
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    /**
     * 查询产品详细信息，包含子表信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
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
    /**
     * 查询产品本身信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    async findPro(id) {
        try {
            console.log("search id is "+id);
            let result = await db('t_hm101_products').select('*')
                    .where({id:id})
            // Object.keys(result[0]).forEach(function(param,index){
            //     console.log("result attr "+param+" is "+result[0][param])
            // })
            if (!result[0]) return {}
            this.constructor(result[0])
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store(request) {
        var product = this
        // 插入表时去掉数据中非字段项
        delete product.commentNum
        delete product.thumbNum
        // var content = servant.intro
        // delete servant.intro
        // 遍历打印对象内容
        // Object.keys(post).forEach(function(param,index){
        //     console.log("post attr "+param+" is "+post[param])
        // })
        // 使用事务插入帖子信息及内容信息表

        var contents = [
            {content: product.feature},
            {content: product.detail},
            {content: product.routine},
            {content: product.fee},
            {content: product.notice},
            {content: product.hospital},
            {content: product.item}
        ];
        // Object.keys(product).forEach(function(param,index){
        //     console.log("product attr "+param+" is "+product[param])
        // })
        // for (var i in contents){
        //     Object.keys(contents[i]).forEach(function(param,index){
        //         console.log("contents["+i+"] attr "+param+" is "+contents[i][param])
        //     })
        // }
        // Object.keys(contents).forEach(function(param,index){
        //     console.log("contents attr "+param+" is "+contents[param])
        // })
        delete product.feature
        delete product.detail
        delete product.routine
        delete product.fee
        delete product.notice
        delete product.hospital
        delete product.item

        var experts = request.experts;
        var operations = request.operations

        return await db.transaction(function(trx) {
          return db.batchInsert('t_hm101_htmls', contents)
            .returning('id')
            .transacting(trx)
            .then(function(ids) {
                product.featureH5Id = ids[0]
                product.detailH5Id = ids[0]+1
                product.routineH5Id = ids[0]+2
                product.feeH5Id = ids[0]+3
                product.noticeH5Id = ids[0]+4
                product.hospitalH5Id = ids[0]+5
                product.itemH5Id = ids[0]+6

                return db('t_hm101_products').insert(product)
                    .returning('id')
                    .transacting(trx)
                    .then(function(ids){
                        console.log("expert insert product id:"+ids[0])
                        var proudctId = ids[0]
                        for(var i in experts){
                            experts[i].productId = proudctId
                        }

                        for(var i in operations){
                            operations[i].target = '01';
                            operations[i].targetID = proudctId;
                        }
                        return db.batchInsert('t_hm101_product_experts', experts).transacting(trx);
                    })
                    .then(function(ids){
                        return db.batchInsert('t_hm101_product_operations', operations).transacting(trx)
                    })

            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function(inserts) {
            return inserts;
        })
        .catch(function(error) {
            console.log("error is---"+error)
            throw new Error('ERROR')
        });
    }
    /**
     * 存储全部产品信息
     * @return {[type]} [description]
     */
    async save() {
        var product = this

        var contents = [
            {content: product.feature, id: product.featureH5Id},
            {content: product.detail, id: product.detailH5Id},
            {content: product.routine, id: product.routineH5Id},
            {content: product.fee, id: product.feeH5Id},
            {content: product.notice, id: product.noticeH5Id},
            {content: product.hospital, id: product.hospitalH5Id},
            {content: product.item, id: product.itemH5Id}
        ];
        var experts = product.experts;
        var operations = product.operations
        //更新产品内容表
        for(var i in contents){
            await db('t_hm101_htmls').update(contents[i])
                .where({id: contents[i].id})
        }
        // 更新产品专家表
        for(var i in experts){
            await db('t_hm101_product_experts').update(experts[i])
                .where({productId: product.id})
        }

        // 更新产品运营表
        for(var i in operations){
            await db('t_hm101_product_operations').update(operations[i])
                .where({targetId: product.id})
        }
        // 插入表时去掉数据中非字段项
        delete product.commentNum
        delete product.thumbNum
        delete product.feature
        delete product.detail
        delete product.routine
        delete product.fee
        delete product.notice
        delete product.hospital
        delete product.item
        delete product.experts
        delete product.operations
        // 更新产品表
        product.savePro()
    }
    /**
     * 只存储产品本身信息
     * @return {[type]} [description]
     */
    async savePro() {
        try {
            // 遍历打印对象内容
            // Object.keys(this).forEach(function(param,index){
            //     console.log("this attr "+param+" is "+this[param])
            // })
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
        let product = await db.select('*').from('t_hm101_products')
                    .where({ 'id': id});
        Object.keys(product[0]).forEach(function(param,index){
            console.log("product1 attr "+param+" is "+product[0][param])
        })
        product[0].feature = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].featureH5Id}))[0].content;
        product[0].detail = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].detailH5Id}))[0].content;
        product[0].routine = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].routineH5Id}))[0].content;
        product[0].fee = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].feeH5Id}))[0].content;
        product[0].notice = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].noticeH5Id}))[0].content;
        product[0].hospital = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].hospitalH5Id}))[0].content;
        product[0].item = (await db.select('content').from('t_hm101_htmls')
                            .where({ 'id': product[0].itemH5Id}))[0].content;

        product[0].experts = await db('t_hm101_product_experts').select('*')
                .where({'productId': product[0].id});
        product[0].operations = await db('t_hm101_product_operations').select('*')
                .where({'targetId': product[0].id});
        Object.keys(product[0]).forEach(function(param,index){
            console.log("product[0] attr "+param+" is "+product[0][param])
        })
        return product[0]
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
/**
 * 更新并获取帖子观看数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getViews(id,num) {
    try {
        return await db('t_hm101_products')
            .update({viewNum:num})
            .where({ id: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取点赞数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getThumbs(id) {
    try {
        return await db('t_hm101_thumbs')
            .count('targetId as count')
            .where({ targetId: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

/**
 * 获取评论数
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function getComments(id) {
    try {
        return await db('t_hm101_comments')
            .count('targetId as count')
            .where({ targetId: id })
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
export { Product, findById }

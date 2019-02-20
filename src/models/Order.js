import db from '../db/db'
import rand from 'randexp'
import redis from 'ioredis'
const getServant = require('./Servant').findById
const getProduct = require('./Product').findById
const getAttentans = require('./Attendant').findById
const pinyin = require('node-pinyin')
import dateFormat from 'date-fns/format'
function formatDate(str){
    let date =  null;
    if(str){
        date = new Date(str);
    }else{
        date = new Date();
    }
    return  dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
}


/**
 * 订单数据模型
 */
const redisdb = new redis( 33601,"47.92.131.110");

async function genID(module_name) {
    return 1000000000 + await redisdb.incr(module_name+"_id");
}

const G_TABLE_NAME = "t_hm101_orders"
const G_TABLE_ORDER_PEOPLE_NAME = "t_hm101_order_peoples"
const G_TABLE_ORDER_ATTENTANTS_NAME = "t_hm101_order_attentants"
const G_MODULE_ORDERNUMBER_NAME = "ordernumber"
const G_MODULE_ORDERPEOPLE_NAME = "orderpeople"

/**
 * 订单数据模型
 */ 

class Order {
    constructor(data) {
        if (!data) {
            return
        }
        this.id = data.id
        this.number = data.number
        this.target = data.target
        this.targetId = data.targetId
        this.price = data.price
        this.payedMoney = data.payedMoney
        this.buyerId = data.buyerId
        this.contact = data.contact
        this.telephone = data.telephone
        this.status = data.status


        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
        this.earliestAt = data.earliestAt
        this.latestAt   = data.latestAt
        this.confirmAt = data.confirmAt
        this.payType = data.payType;
        this.trade_no = data.trade_no;
        this.servantType = data.servantType;
        if(this.confirmAt === null) delete this.confirmAt
    }
    async fillForInsert(){
        this.number = await genID(G_MODULE_ORDERNUMBER_NAME);
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.status = '01';
        this.payedMoney = 0;
        this.operator = this.buyerId;
        this.operateFlag = 'A'
        this.latestAt = formatDate(this.latestAt)
        this.earliestAt = formatDate(this.earliestAt);

        if(this.target == '03'){
            //03 表示翻译
            //这个时候要查库
            let servant = await getServant(this.targetId);
            if(this.servantType === '01'){
                this.price = servant.literPrice
            }else if(this.servantType === '02'){
                this.price = servant.followPrice

            }else if(this.servantType === '03'){
                this.price = servant.recepPrice
            }else{
                throw "unexcept servantType";
            }
        }else if(this.target=='01'){
            //表示产品
            //这个时候要查库+后续计算
            this.price = 0;
        }else if(this.target == '02'){
            //表示电影
            this.price = 0;
        }else{
            throw "unexcept order type";
        }
    }
    async all(request) {
        try {
            let db_orders = await db(G_TABLE_NAME)
                .select('*')
                .where({ buyerId: request.userId })
                .where({ status: request.status })
                .orderBy('createdAt', request.order)
                .offset(request.page*request.pageNum)
                .limit(+request.pageNum)
            let orders = [];
            for(let i = 0 ; i < db_orders.length ; ++i){
                let order = new Order(db_orders[i]);
                await order.getDetails();
                orders.push(order);
            }
            return orders;
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    async getDetails(){
        const targetTable = {
            "03":"t_hm101_servants",
            "01":"t_hm101_products"
        }
        let tableName = targetTable[this.target];
        if(tableName){
            let db_details = await db(tableName)
                    .select('id','desc')
                    .where({id:this.targetId});
            this.details = db_details;
        }
    }
    async withdraw(){
        await  db(G_TABLE_NAME)
              .update({status:"10"})
              .where({number:this.number})
    }
    async save(trx){
        let v = await trx(G_TABLE_NAME).insert(this);
        //let v = await db(G_TABLE_NAME).insert(this);
        this.id = v[0];
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
            return await db('notes').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }



    async destroy(request) {
        try {
            return await db('notes')
                .delete()
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}


class OrderPeople{
    constructor(data){
        this.birthday = formatDate( data.birthday);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.gender = data.gender;
        this.passport = data.passport;
        this.passExpir = formatDate( data.passExpir);

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;

        this.firstPiyin = data.firstPiyin;
        this.lastPiyin = data.lastPiyin;
        this.orderNumber = data.orderNumber;

        this.travelType = data.travelType;

    }
    async fillForInsert(order,product) {
        this.id = await genID(G_MODULE_ORDERPEOPLE_NAME);
        this.firstPiyin = pinyin(this.firstName);
        this.lastPiyin = pinyin(this.lastName);
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = order.buyerId;
        this.orderNumber = order.number;
        this.operateFlag = 'A'

        if(this.travelType === '02'){
            order.price += product.companyPrice;
        }else{
            let birthday = new Date(this.birthday);
            let age = Date.now() - birthday;
            let date_age = new Date(age);
            age = date_age.getFullYear()-1970;
            console.log("age"+age)
            console.log("1111"+order.price)
            if(age<18){
                order.price += product.childPrice;
            }else{
                if(this.gender === '01'){
                    order.price += product.adultPrice;
                }else{
                    order.price += product.womenPrice;
                }
            }
        }

        console.log("1111"+order.price)
    }
    async save(trx){
        await trx(G_TABLE_ORDER_PEOPLE_NAME).insert(this);
      //  await db(G_TABLE_ORDER_PEOPLE_NAME).insert(this);
    }
}
class OrderAttendant{
    constructor(data){
        this.id = data.id;
        this.orderNumber = data.orderNumber;
        this.targetId = data.targetId;
        this.price = data.price;
        this.quantity = data.quantity||1;
        this.name = data.name;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;

        this.ownerId = data.ownerId;
    }
    async fillForInsert(order,people){
        this.ownerId = people.id;
        this.orderNumber = order.number;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = order.buyerId;
        this.orderNumber = order.number;
        this.operateFlag = 'A'
        //这些是查库的
        let attentans = await getAttentans(this.targetId);
        this.price = attentans.price;
        order.price += this.price;
        this.name = attentans.name; 
        console.log("2222"+order.price)
    }
    async save(trx){
       // this.bccc = 'c'
        await trx(G_TABLE_ORDER_ATTENTANTS_NAME).insert(this);
    }
}

class OrderDBTranscation{
    constructor(data){
        this.data = data;

    }
    async save() {
        let order = new Order(this.data);
        await db.transaction(async (trx)=>{
            let isSuc = false;
            try{
                await order.fillForInsert();
                await order.save(trx);
                if(order.target == '01'){
                    let product = await getProduct(order.targetId);
                    for(let idx_peo = 0 ; idx_peo < this.data.peoples.length; ++idx_peo){
                        let json_people = this.data.peoples[idx_peo];
                        let people = new OrderPeople(json_people);
                        await people.fillForInsert(order,product);
                        await people.save(trx);
                        if(json_people.attentants){
                            for(let idx_att = 0 ; idx_att < json_people.attentants.length ; ++idx_att ){
                                let att = new OrderAttendant(json_people.attentants[idx_att]);
                                await att.fillForInsert(order,people);
                                await att.save(trx);
                            }
                        }
                    }   
                }
               isSuc = true;
               return trx.commit();
            }catch(e){
                isSuc = false;
                console.log(e)
                return trx.rollback(e);
            }
        })
        return order;
    }
}

async function findById(id) {
    try {
        let db_order = await db(G_TABLE_NAME)
            .select('*')
            .where({ id: id })
        return new Order(db_order);
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
async function findByNumber(number) {
    try {
        let db_order = await db(G_TABLE_NAME)
            .select('*')
            .where({ number: number })
        return new Order(db_order[0]);
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}
export { Order, OrderPeople , OrderAttendant, OrderDBTranscation,findByNumber,findById}

import db from '../db/db'
import rand from 'randexp'

const getServant = require('./Servant').findById
const getProduct = require('./Product').findById
const getAttentans = require('./Attendant').findById
const LongID = require('../genID/longID')
const getTraveler = require('./CommonlyTraveler').findById
import dateFormat from 'date-fns/format'
import {OrderTargetCode,OrderTypeCode,OrderProductStatus} from '../codes'
import { Codes } from './Codes';
function formatDate(str){
    let date = null;
    if(str){
        date = new Date(str);
    }else{
        date = new Date();
    }
    return  dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
}

const G_TABLE_NAME = "t_hm101_orders"
const G_TABLE_ORDER_PEOPLE_NAME = "t_hm101_order_product_peoples"
const G_TABLE_ORDER_ATTENTANTS_NAME = "t_hm101_order_product_attentants"
const G_TABLT_ORDER_GOODS = 't_hm101_order_goods'
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

        this.originPrice = data.originPrice
        this.realPrice = data.realPrice
        this.payedMoney = data.payedMoney
        this.prepayPrice = data.prepayPrice
        this.prepayExpiry = data.prepayExpiry
        this.postpayExpiry = data.postpayExpiry
        this.payExpiry = data.payExpiry

        this.buyerId = data.buyerId
        this.contact = data.contact
        this.telephone = data.telephone
        this.status = data.status

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
        this.earliestAt = data.earliestAt
        this.latestAt = data.latestAt
        this.confirmAt = data.confirmAt

        this.type = data.type;
        this.cancelCode = data.cancelCode;
        if(this.confirmAt === null) delete this.confirmAt
    }
    async fillForInsert(){
        this.number = await LongID.genOrderID();
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.status = '01';
        this.payedMoney = 0;
        this.operator = this.buyerId;
        this.operateFlag = 'A'
        this.latestAt = formatDate(this.latestAt)
        this.earliestAt = formatDate(this.earliestAt);

        this.originPrice = 0;
        this.realPrice   = 0;
    }
    //暂定默认1分钟
    fillForPruduct(product){
        let date = new Date();
        let productExpiry = +product.prepayExpiry;
        productExpiry = productExpiry===0?60000:productExpiry;
        let prepayExpiry = new Date(date.getTime() +productExpiry);
        this.prepayExpiry = prepayExpiry;
    }
    computePrice(orderGoods){

        this.originPrice = 0;
        this.realPrice = 0;
        for(let i = 0 ; i < orderGoods.length ; ++i){
            let orderGood = orderGoods[i];
            
            this.originPrice += orderGood.realPrice * orderGood.quantity;
            this.realPrice = this.originPrice;
        }
        if(this.type == OrderTypeCode.Product){
        //to do
        //    this.prepayPrice = parseInt(this.realPrice * 0.3)
            this.prepayPrice = 1;
        }
    }
    static async all(request) {
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
        this.id = v[0];
    }
    static async find(id) {
        let result = await findById(id)
        return result;
    }
    /**
     * @returns 
     * {
     *     fee:123,
     *     trade_no:123
     * }
     */
    getPayParamsForWX(){
        let params = {
            fee:0,
            trade_no:""
        }
        if(this.type == OrderTypeCode.Product){
            if(this.status == OrderProductStatus.PREPAY){
                params.fee = this.prepayPrice;
                params.trade_no = this.number+'_1';
            }
            else if(this.status == OrderProductStatus.POSTPAY){
                params.fee = this.realPrice - this.prepayPrice;
                params.trade_no = this.number+'_2';
            }else{
                throw new Error('INVALID STATUS FOR PAY:'+this.status)
            }
        }else{
            throw new Error('INVALID PAY ORDER:'+this.number);
        }
        return params;
    }
}

class OrderGood{
    constructor(data){
        this.id = data.id
        this.number = data.number
        this.originPrice = data.originPrice
        this.realPrice = data.realPrice
       
        this.quantity = data.quantity;

        this.target = data.target;
        this.targetId = data.targetId;

        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
    }
    async save(trx){
        let v = await trx(G_TABLT_ORDER_GOODS).insert(this);
        this.id = v[0];
    }
    async fillForInsert(order){
        this.number = order.number;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;

        this.operator = order.buyerId;
        this.operateFlag = 'A'

        this.originPrice = 0;
        this.realPrice = 0;
    }
}
class OrderPeople{
    constructor(data){
        this.id = data.id;
        this.travelerId = data.travelerId;
        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;

        this.number = data.number;

        this.travelType = data.travelType;
        this.originPrice = data.originPrice;
        this.realPrice = data.realPrice;
    }
    async fillForInsert(orderGood,product) {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = orderGood.operator;
        this.number = orderGood.number;
        this.operateFlag = 'A'
        let traveler = await getTraveler(this.travelerId);
        this.travelType = this.travelType||traveler.travelType;
        if(this.travelType === '02'){
            this.originPrice = product.companyPrice;
        }else{
            let birthday = new Date(traveler.birthday);
            let age = Date.now() - birthday;
            let date_age = new Date(age);
            age = date_age.getFullYear()-1970;
            if(age<18){
                this.originPrice = product.childPrice;
            }else{
                if(traveler.gender === '01'){
                    this.originPrice = product.adultPrice;
                }else{
                    this.originPrice = product.womenPrice;
                }
            }
        }
        this.realPrice = this.originPrice;
        orderGood.originPrice += this.originPrice;
        orderGood.realPrice += this.realPrice;
    }
    async save(trx){
        await trx(G_TABLE_ORDER_PEOPLE_NAME).insert(this);
    }
}
class OrderAttendant{
    constructor(data){
        this.id = data.id;


        this.orderNumber = data.orderNumber;
        this.targetId = data.targetId;
        this.quantity = data.quantity||1;
        this.name = data.name;

        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
        this.ownerId = data.ownerId;

        this.originPrice = data.originPrice;
        this.realPrice = data.realPrice;
    }
    async fillForInsert(orderGood,people){
        this.ownerId = people.travelerId;
        this.orderNumber = order.number;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = orderGood.operator;
        this.orderNumber = orderGood.number;
        this.operateFlag = 'A'
        //这些是查库的
        let attentans = await getAttentans(this.targetId);
        this.originPrice = attentans.price;
        this.realPrice = this.originPrice;
        orderGood.originPrice += this.originPrice;
        orderGood.realPrice += this.realPrice;
        console.log(attentans.price)
        console.log(orderGood.originPrice)
        this.name = attentans.name; 
    }
    async save(trx){
        await trx(G_TABLE_ORDER_ATTENTANTS_NAME).insert(this);
    }
}

class ProductTranscation{
    constructor(data){
        data.target = OrderTargetCode.Product;
        data.type = OrderTypeCode.Product;
        this.data = data;
    }
    async save() {
        let order = new Order(this.data);
        let orderGood = new OrderGood(this.data);
        orderGood.quantity = 1;
        await db.transaction(async (trx)=>{
            try{
                await order.fillForInsert();
                await orderGood.fillForInsert(order);
                let product = await getProduct(orderGood.targetId);
                for(let idx_peo = 0 ; idx_peo < this.data.peoples.length; ++idx_peo){
                    let json_people = this.data.peoples[idx_peo];
                    let people = new OrderPeople(json_people);
                    await people.fillForInsert(orderGood,product);
                    await people.save(trx);
                    if(json_people.attentants){
                        for(let idx_att = 0 ; idx_att < json_people.attentants.length ; ++idx_att ){
                            let att = new OrderAttendant(json_people.attentants[idx_att]);
                            await att.fillForInsert(orderGood,people);
                            await att.save(trx);
                        }
                    }
                }   
                await orderGood.save(trx);
                order.computePrice([orderGood]);
                order.fillForPruduct(product);
                await order.save(trx);
                
                return trx.commit();
            }catch(e){
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

    let db_order = await db(G_TABLE_NAME)
        .select('*')
        .where({ number: number })
    if(db_order.length != 1) throw new Error('no order :'+number);
    return new Order(db_order[0]);

}
export { Order, OrderPeople , OrderAttendant, ProductTranscation,findByNumber,findById}

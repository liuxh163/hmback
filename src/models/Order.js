import db from '../db/db'
import rand from 'randexp'

const getServant = require('./Servant').findById
const getProduct = require('./Product').findById
const getAttentans = require('./Attendant').findById
const LongID = require('../genID/longID')
const getTraveler = require('./CommonlyTraveler').findById
import dateFormat from 'date-fns/format'
import {OrderTargetCode,OrderTypeCode,OrderProductStatus,PayTargetCode} from '../codes'
import { Codes } from './Codes';
import {MsgNames,QueueName, sendToDelayMQ,sendToUNHandle} from '../msgcenter/msgCenter'
import { CommonlyTraveler } from './CommonlyTraveler';

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
const G_TABLT_ORDER_BILL = 't_hm101_order_bill'
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
        this.desc = data.desc;
        this.buyerId = data.buyerId
        this.contact = data.contact
        this.telephone = data.telephone
        this.status = data.status
        this.substate = data.substate
        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.updatedAt = data.updatedAt
        this.createdAt = data.createdAt
        this.earliestAt = data.earliestAt
        this.latestAt = data.latestAt
        this.confirmAt = data.confirmAt

        this.type = data.type;
        this.cancelReason = data.cancelCode;
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
        productExpiry = productExpiry===0?3600000:productExpiry;
        let prepayExpiry = new Date(date.getTime() +productExpiry);
        this.prepayExpiry = prepayExpiry;
        this.productExpiry = productExpiry;
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
            if(!request.status) request.status = '';
            if(!request.substate) request.substate = '';
            let statuss = request.status.split(',');
            let substates = request.substate.split(',')
            if(statuss.length == 1 && statuss[0] == ''){
                statuss = [];
            } 
            if(substates.length == 1 && substates[0] == ''){
                substates = [];
            } 

            let db_orders = await db(G_TABLE_NAME)
            .select('*')
            .where({ buyerId: request.userId })
            .where(function(){
                this.where(function(){
                    for(let i = 0 ; i < statuss.length; ++i){
                        if(i == 0) this.where({status:statuss[i]})
                        else this.orWhere({status:statuss[i]})
                    }
                })
                .orWhere(function(){
                    for(let i = 0 ; i < substates.length; ++i){
                        if(i == 0) this.where({substate:substates[i]})
                        else this.orWhere({substate:substates[i]})
                    }
                })
            })
            .orderBy('createdAt', request.order)
            .offset(request.page*request.pageNum)
            .limit(+request.pageNum);
            console.log(db_orders)

            let orders = [];
            for(let i = 0 ; i < db_orders.length ; ++i){
                let order = new Order(db_orders[i]);
                // await order.getDetails();
                orders.push(order);
            }
            return orders;
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
    async fillFullInfo(){
        let goods = await OrderGood.all(this.number);
        for(let i = 0 ; i < goods.length ; ++i){
            let orderGood = goods[i]
            if(orderGood.target == OrderTargetCode.Product){
                let peoples = await OrderPeople.all(this.number);
                for(let pidx = 0 ; pidx < peoples.length ; ++pidx){
                    await peoples[pidx].fillFullInfo();
                }
                this.peoples = peoples;
            }
        }
        this.goods = goods;
    }

    async withdraw(){
        await  db(G_TABLE_NAME)
              .update({status:"98"})
              .where({number:this.number})
    }
    async save(trx){
        let v = await trx(G_TABLE_NAME).insert(this);
        this.id = v[0];
    }
    static async find(id,allowNonExist = false) {
        let result = await findById(id,allowNonExist)
        return result;
    }
    static async findNumber(number,allowNonExist = false){
        let result = await findByNumber(number,allowNonExist);
        return result;
    }
    /**
     * @returns 
     * {
     *     fee:123,
     *     trade_no:123,
     *     type:"01"
     * }
     */
    getPayParamsForWX(){
        let params = {
            fee:0,
            trade_no:"",
            type:""
        }
        if(this.type == OrderTypeCode.Product){
            if(this.status == OrderProductStatus.PREPAY){
                params.fee = this.prepayPrice
                params.trade_no = this.number
                params.type = PayTargetCode.PREPAY
            }
            else if(this.status == OrderProductStatus.POSTPAY){
                params.fee = this.realPrice - this.prepayPrice
                params.trade_no = this.number
                params.type = PayTargetCode.POSTPAY
            }else{
                throw new Error('INVALID STATUS FOR PAY:'+this.status)
            }
        }else{
            throw new Error('INVALID PAY ORDER:'+this.number);
        }
        return params;
    }
    async updatePayedMoney(payedMoney,payType,checkId,paymentType,trx){
        trx = trx||db;
        let isSuccess = false;
        let msg = '未知错误';
        do{
            if(payType == PayTargetCode.PREPAY){
                if(this.status == OrderProductStatus.PREPAY){
                    this.status = OrderProductStatus.PREPAID;
                }else{
                    msg = "错误的订单状态流:"+this.status+" 支付目标:"+payType+" 金额"+payedMoney;
                    break;
                }
            }else if(payType == PayTargetCode.POSTPAY){
                if(this.status == OrderProductStatus.POSTPAY){
                    this.status = OrderProductStatus.TOTRAVEL;
                }else{
                    msg = "错误的订单状态流:"+this.status+" 支付目标:"+payType+" 金额"+payedMoney;
                    break;
                }
            }
            this.payedMoney = parseInt(this.payedMoney)+parseInt(payedMoney);
            let updateData = {
                payedMoney:this.payedMoney,
                status:this.status,
                updatedAt:new Date(),
                operator:'system',
                operateFlag:'U'
            }
            await trx(G_TABLE_NAME).update(updateData).where({number:this.number});
            isSuccess = true;
        }while(0);
        if(!isSuccess){
            sendToUNHandle(MsgNames.OrderStatusFlowException,
                {number:this.number,paymentType:paymentType,checkId:checkId},
                msg);
        }
    }
    /**
     * 预支付过期
     * 需加锁
     */
    async prepayExpire(){
        if(this.status === OrderProductStatus.PREPAY){
            await db(G_TABLE_NAME).update({status:OrderProductStatus.CANCELED,cancelReason:"预支付过期"})
                            .where({number:this.number});
        }
    }
    async formatForClient(){
        this.originPrice = this.originPrice/100;
        this.realPrice = this.realPrice/100;
        this.createdAt = formatDate(this.createdAt);
        if(this.confirmAt) {
            this.confirmAt = formatDate(this.confirmAt)
        }else{
            delete this.confirmAt;
        }
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
    static async all(number){
        let db_goods = await db(G_TABLT_ORDER_GOODS).select('*').where({number:number});
        let goods = [];
        for(let i = 0 ; i < db_goods.length ; ++i){
            goods.push(new OrderGood(db_goods[i]));
        }
        return goods;
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
    static async all(number){
        let db_people = await db(G_TABLE_ORDER_PEOPLE_NAME).select('*').where({number:number});
        let peoples = [];
        for(let i = 0 ; i < db_people.length ; ++i){
            let people = new OrderPeople(db_people[i])
            peoples.push(people);
        }
        
        return peoples;
    }
    async fillFullInfo(){
        let ct = await CommonlyTraveler.find(this.travelerId);
        ct.formatToClient();
        this.firstName = ct.firstName
        this.lastName = ct.lastName
        this.firstPinyin = ct.firstPinyin
        this.lastPinyin = ct.lastPinyin
        this.passport = ct.passport
        this.passExpiry = ct.passExpiry
        this.birthday = ct.birthday
        this.gender = ct.gender
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
                order.desc = product.desc;
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
                let productExpiry = order.productExpiry;
                delete order.productExpiry;
                await order.save(trx);
                let qret = await sendToDelayMQ(QueueName.OrderDelayQueue,MsgNames.PrepayExpire,{
                    number:order.number
                },productExpiry)
                if(!qret) throw new error('cant send queue');
                return trx.commit();
            }catch(e){
                return trx.rollback(e);
            }
        })
        return order;
    }
}





class OrderBill{
    constructor(data){
        this.id = data.id;
        this.type = data.type;
        this.number = data.number;
        this.fee = data.fee;
        this.paymentType = data.paymentType;
        this.transaction_id = data.transaction_id
        this.out_trade_no = data.out_trade_no;
        this.status = data.status;
        this.checkId = data.checkId
        
        this.operator = data.operator;
        this.operateFlag = data.operateFlag;
        this.updatedAt = data.updatedAt;
        this.createdAt = data.createdAt;
    }
    async fillForInsert(){
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
        this.operator = 'system';

        this.operateFlag = 'A'
    }
    async save(trx) {
        trx = trx||db;
        await trx(G_TABLT_ORDER_BILL).insert(this);
    }
}

async function findById(id,allowNonExist = false) {

    let [db_order] = await db(G_TABLE_NAME)
        .select('*')
        .where({ id: id })
    if(!db_order && !allowNonExist) throw  new Error('no order id:'+id); 
    if(!db_order) return null;   
    return new Order(db_order);
}
async function findByNumber(number,allowNonExist = false) {

    let [db_order] = await db(G_TABLE_NAME)
        .select('*')
        .where({ number: number })
    if(!db_order && !allowNonExist ) throw new Error('no order :'+number);
    if(!db_order) return null;   
    return new Order(db_order);
}

export { Order, OrderPeople , OrderAttendant, ProductTranscation,findByNumber,findById,OrderBill}

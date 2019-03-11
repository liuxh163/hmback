import redisdb from '../db/redis'
class IntervalLock{
    constructor(data){
        this.interval = data.interval||10;
        this.key = "interval:"+data.key;
        this.lockedMsg = data.lockedMsg || (this.key+" locked")
    }
    async islock(){

    }
    async lock(){
        let val = await redisdb.set(this.key,new Date().getTime(),'EX',this.interval,'NX');
        if(!val) throw new Error(this.lockedMsg);
    }
}


export default IntervalLock;
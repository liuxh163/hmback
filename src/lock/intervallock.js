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
        let val = await redisdb.get(this.key);
        if(val != null) throw new Error(this.lockedMsg);
        let v = await redisdb.multi().watch(this.key).set(this.key,1,'EX',this.interval).exec();
        console.debug(v);
        if(v.length !=  1  || v[0].length != 2) throw new Error(this.lockedMsg);
    }
}


export default IntervalLock;
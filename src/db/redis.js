import redis from 'ioredis'
//import console = require('console');

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const PRD_DB = process.env.REDIS_DB_PRD;
const DEV_DB = process.env.REDIS_DB_DEV;

let rdb = "";
if("development" == process.env.NODE_ENV){
    rdb = DEV_DB;
}else if("production" == process.env.NODE_ENV){
    rdb = PRD_DB;
}
module.exports = 
    // new redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
    new redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {"db": rdb});
    
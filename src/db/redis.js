import redis from 'ioredis'

if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

module.exports = 
    new redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
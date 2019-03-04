
const config = {
    testing:{
        protocol:"amqp",
        hostname:"localhost",
        port:"5672",
        username:"guest",
        password:"guest"
    },
    development:{
        protocol:"amqp",
        hostname:"47.92.131.110",
        port:"6752",
        username:"admin",
        password:"admin"
    },
    production:{
        protocol:"amqp",
        hostname:"localhost",
        port:"6752",
        username:"admin",
        password:"admin"
    }
}

function getAMQPConfig(){
    return config[process.env.NODE_ENV];
}
export default getAMQPConfig;
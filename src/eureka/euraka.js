import Eureka from 'eureka-js-client';

const ip = "192.168.100.42";
const port = "4000"; 
const eIp = "192.168.100.42";
const ePort = "9999"; 
const sName = "haima-nodejs" // eureka 服务注册的服务名


// example configuration
module.exports = new Eureka({
  // application instance information
  instance: {
    "app": sName,
    "instanceId": `${ip}:${sName.toLowerCase()}:${port}`, //eureka服务的实例id
    "hostName": ip,
    "ipAddr": ip,
    "statusPageUrl": `http://${ip}:${port}/info`, // spring admin 注册心跳
    "healthCheckUrl": `http://${ip}:${port}/health`, // eureka 注册心跳
    "port": {
        "$":port, 
        "@enabled": true
    },
    "vipAddress": sName,
    "dataCenterInfo": {
        "@class":"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        "name": 'MyOwn',
    },
    "status": "UP"
  },
  eureka: {
    // eureka server host / port
    registryFetchInterval: 300,
    //有多个 eureka 集群
    serviceUrls: {
      default: [`http://${eIp}:${ePort}/eureka/apps/`]
    }
  },
});

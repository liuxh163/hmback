import Eureka from 'eureka-js-client';

// example configuration
module.exports = new Eureka({
  // application instance information
  instance: {
    "app": 'haima-nodejs',
    "instanceId": '192.168.100.42:haima-nodejs:4000',
    "hostName": '192.168.100.42',
    "ipAddr": '192.168.100.42',
    "statusPageUrl": `http://192.168.100.42:4000/info`, // spring admin 注册心跳
    "healthCheckUrl": `http://192.168.100.42:4000/health`, // eureka 注册心跳
    "port": {
        "$":4000, 
        "@enabled": true
    },
    "vipAddress": 'haima-nodejs',
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
      default: ['http://192.168.100.11:9999/eureka/apps/']
    }
  },
});
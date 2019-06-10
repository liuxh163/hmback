import Router from 'koa-router';
import Eureka from 'eureka-js-client';

const router = Router();
// const ip = getIp(); //获取本地ip
const ip = "192.168.100.42";

let serviceName = "haima-nodejs" // eureka 服务注册的服务名
const port = "4000"; // 对应服务的端口号

const client = new Eureka({
    instance: {
      instanceId: `${ip}:${serviceName.toLowerCase()}:${port}`, //eureka服务的实例id
      app: serviceName,
      hostName: ip,
      ipAddr: ip,
      statusPageUrl: `http://${ip}:${port}/info`, // spring admin 注册心跳
      healthCheckUrl: `http://${ip}:${port}/health`, // eureka 注册心跳
      port: {
        $: port,
        '@enabled': 'true',
      },
      vipAddress: serviceName, // Important, otherwise spring-apigateway cannot find instance of book-service
      // secureVipAddress: 'book-service',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      // eureka 只有一个注册中心
      // fetchRegistry: false,
      // host: '127.0.0.1',
      // port: 8761,
      // servicePath: '/eureka/apps/',
      registryFetchInterval: 3000,
  
      //有多个 eureka 集群
      serviceUrls: {
        default: ['http://192.168.100.11:9999/eureka/apps/'],
        // default: config.eureka.server.serviceUrls,
      },
    },
  });
  
  // eureka 心跳路由
  router.get('/info', (req, res) => {
    res.json({ name: serviceName, status: 'UP' });
  });
  
  // spring admin 心跳路由
  router.get('/health', (req, res) => {
    res.json({
      description: 'Spring Cloud Eureka Discovery Client',
      status: 'UP',
      hystrix: {
        status: 'UP',
      },
    });
  });
  
  
  // 再调用 eurekaClient 的时候，防止服务在eureka注册中心多次重复注册，使用promise确保服务在启动后只会初始化一次。
  const cbs = [];
  let isStarted = false;
  const isStarting = false;
  const  eurekaClient = new Promise((resolve, reject) => {//eslint-disable-line
    if (isStarted) {
      return resolve(client);
    } else if (isStarting) {
      cbs.push([resolve, reject]);
    } else {
      cbs.push([resolve, reject]);
      client.start((err) => {
        cbs.forEach((cb) => {
          if (err) return cb[1](err);
          else {
            isStarted = true;
            return cb[0](client);
          }
        });
      });
    }
  });
  
  eurekaClient.heartBeat = function heartBeat(app) {
    app.use(router);
  };
  // 在服务被强迫停止或因为由于异常导致服务停止时，在服务停止前向 eureka 发起服务下线。
eurekaClient.graceful = function makeGraceful(server) {
    const cl = this;
    function onSignal() {
      return new Promise((resolve, reject) => {
        cl.then(value => value.stop(() => resolve())).catch((err) => {
          logger.error(err);
          reject(err);
        });
      });
    }
    
    terminus(server, {
      signals: ['SIGINT', 'SIGTERM'],
      onSignal,
    });
  
    graceful({
      servers: [server],
      killTimeout: '5s',
      error(error) {
        logger.error(error);
        cl.then(value => value.stop()).catch((err) => {
          logger.error(err);
        });
      },
    });
  };
  
  export default eurekaClient;
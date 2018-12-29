# Group 点赞

### 获取点赞数 [GET /api//v1/thumbs/{?target=01,targetId=p11}]
获取指定对象点赞数。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 点赞对象类型。
  + productId: `product1` (number) - 点赞对象Id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"count": "100"}
      }

### 点赞/取消点赞 [PUT /api/v1/thumbs]
点赞/取消点赞

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "target": "轮播图",
          "productId": "我是一张轮播图"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

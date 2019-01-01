# Group 点赞

### 点赞/取消点赞 [PUT /api/v1/thumbs]
点赞/取消点赞

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "target": "01",
          "targetId":"1"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "thumb3"}
      }

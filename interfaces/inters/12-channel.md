# Group 渠道商

### 新增渠道商 [POST /api/v1/channels]
新增加渠道商

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name": "中日友好",
          "desc": "中日友好渠道推广",
          "contact": "王五",
          "telephone": "13323334567",
          "bizCode": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

### 停用渠道商 [PUT /api/v1/channels/:id/halt]
停用指定渠道商。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `channel1` (string) - 渠道商id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 启用渠道商 [PUT /api/v1/channels/:id/awaken]
重新启用处于停用状态的指定渠道商。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `channel1` (string) - 渠道商id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 修改渠道商 [PUT /api/v1/channels/:id]
修改渠道商信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `channel1` (string) - 渠道商id。

+ Request (application/json)

      {
          "name": "中日友好",
          "desc": "中日友好渠道推广",
          "contact": "王五",
          "telephone": "13323334567",
          "bizCode": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

### 获取渠道商列表 [GET /api/v1/channels/{?pages=1,pageNum}]
返回渠道商列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + pages: 1 (number) - 用户列表页数。
  + pageNum: 10 (number) - 用户列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "channels":[
                  {
                    "id": "channel123",
                    "name":"发现",
                    "desc":"",
                    "contact":"联系我",
                    "telephone":"13838384646",
                    "bizCode":"B123123",
                  },
                  {
                    "id": "channel345",
                    ...
                  },
                  {
                    "id": "channel456",
                    ...
                  }
              ],
          }
      }

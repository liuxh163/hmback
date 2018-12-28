# Group 论坛话题

## 获取论坛话题 [GET /api/v1/forum/topics]
海马社区目前只有2个话题，分别是‘发现’和‘说说’，发现以图片贴配以简单文字，说说为文字贴配图，本节内容主要包含话题的维护和查询相关接口内容。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "topics":[
                  {
                    "id": "topic1",
                    "name":"发现",
                    "desctription":""
                  },
                  {
                    "id": "topic2",
                    "name": "说说",
                    "description":""
                  }
              ],
          }
      }

### 创建话题 [POST /api/v1/forum/topics]
创建新的话题

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"发现",
          "desc":""
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"name":"发现"}
      }

### 修改话题 [PUT /api/v1/forum/topics/:id]
修改话题信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 话题id。

+ Request (application/json)

      {
          "name":"发现",
          "desc":""
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"name":"发现"}
      }

### 关闭话题 [PUT /api/v1/forum/topics/:id/halt]
修改话题信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 话题id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"name":"发现"}
      }

### 启用话题 [PUT /api/v1/forum/topics/:id/awaken]
修改话题信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 话题id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"name":"发现"}
      }

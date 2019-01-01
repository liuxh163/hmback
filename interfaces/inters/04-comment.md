# Group 评论

### 获取评论 [GET /api/v1/comments/{?target=01,targetId=123,page=1,number=10}]
获取指定评论对象的所有评论列表。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 评论对象类型，01-产品，02-服务人员，03-帖子，04-回复。
  + targetId: `product123` (string) - 评论对象唯一标识id。
  + page: 1 (number) - 列表页数。
  + number: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": [
              {
                  "id": "comment123",
                  "commenterId": "user123",
                  "commenterName": "刘半仙",
                  "content": "<span>海马健康金是一款。。。</span>"
              },
              {
                  "id": "comment123",
                  ...
              },
              {
                  "id": "comment123",
                  ...
              }
          ]
      }

### 发表评论 [POST /api/v1/comments?target=01&targetId=111]
对产品、服务人员、帖子或者评论进行评论。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 评论对象类型，01-产品，02-服务人员，03-帖子，04-回复。
  + targetId: `product123` (string) - 评论对象唯一标识id。

+ Request (application/json)

      {
          "content": "<span>海马健康金是一款。。。</span>"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "comment123"}
      }

### 更新评论 [PUT /api/v1/comments/:id]
发布者对评论内容进行更新。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `comment123` (string) - 评论唯一标识id。

+ Request (application/json)

      {
          "content": "<span>海马健康金是一款。。。</span>"
      }
+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "comment123"}
      }

### 撤回评论 [DELETE /api/v1/comments/:id]
评论发布者撤回评论

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `comment123` (string) - 评论唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "comment123"}
      }

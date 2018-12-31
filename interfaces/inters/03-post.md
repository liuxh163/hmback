# Group 帖子

### 查询帖子列表 [GET /api/v1/topics/:id/posts/{?sort=1,pages=1,pageNum=10}]
获取指定话题下所有帖子

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `topic1` (string) - 话题唯一标识id。
  + sort: `1` (string,optional) - 列表排序方式，选填。
  + pages: 1 (number) - 用户列表页数。
  + pageNum: 10 (number) - 用户列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": [
              {
                  "id": "post123",
                  "title": "海马健康金，助力健康",
                  "posterId": "user123",
                  "posterName": "刘半仙",
                  "content": "<span>海马健康金是一款。。。</span>",
                  "location": "韩国，首尔",
                  "comment_num": "300",
                  "praise_num": "223",
                  "view_num" "499"
              },
              {
                  "id": "post123",
                  ...
              },
              {
                  "id": "post123",
                  ...
              }
          ]
      }

### 发布帖子 [POST /api/v1/topics/:id/posts]
新发布一个论坛帖子。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `topic1` (string) - 话题唯一标识id。

+ Request (application/json)

      {
          "title": "海马健康金，助力健康",
          "content": "<span>海马健康金是一款。。。</span>",
          "location": "韩国，首尔"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

### 获取帖子信息 [GET /api/v1/posts/:id]
查询指定帖子的详细信息，每次查询阅读数加1

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "id": "post123",
              "title": "海马健康金，助力健康",
              "posterId": "user123",
              "posterName": "刘半仙",
              "content": "<span>海马健康金是一款。。。</span>",
              "location": "韩国，首尔",
              "commentNum": "300",
              "thumbNum": "223",
              "views" "499"
          }
      }

### 删除指定帖子 [DELETE /api/v1/posts/:id]
删除指定帖子

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

### 修改指定帖子信息 [PUT /api/v1/posts/:id]
修改指定帖子信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Request (application/json)

      {
          "title": "海马金",
          "posterId": "user123",
          "posterName": "刘半仙",
          "content": "<span>海马健康金是一款。。。</span>",
          "location": "日本，大阪",
          "commentNum": "300",
          "thumbNum": "223",
          "views" "499"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

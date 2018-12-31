FORMAT: 1A
HOST: http://api.haima101.com

# 海马项目接口说明
本文的提供海马项目相关Restful接口详细说明。

# Group 用户

### 用户注册 [POST /api/v1/user/signup]
用户使用手机号和短信验证码进行注册，注册成功直接登录系统

+ Request (application/json)

      {
          "telephone": "13378965431",
          "smscode": "123456"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"accessToken": "dba3a540-0794-11e9-9b81-999da2f6363a"}
      }

### 用户登录 [PUT /api/v1/user/login]
用户使用手机号码及短信验证码进行登录。

+ Request (application/json)

      {
          "telephone": "13378965431",
          "smscode": "123456"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"accessToken": "dba3a540-0794-11e9-9b81-999da2f6363a"}
      }


### 用户登出 [PUT /api/v1/user/logout]
用户登出系统，主要用于管理员退出登录

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {}
      }

### 查询用户信息 [GET /api/v1/users/{?page=1,number}]
管理员查询所有用户列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + page: 1 (number) - 列表页数。
  + number: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
            "users":[
              {
                "id":"123",
                "loginid":"user123",
                "telephone":"13212312312",
                "realname":"刘依依",
                "username":"niuliu",
                "loginCount":"12",
                "ipAddress":"192.168.6.111"
              },
              {
                "id":"234"
                ...
              },
              {
                "id":"345"
                ...
              },
            ]
          }
      }

### 停用用户 [PUT /api/v1/users/:id/halt]
停用指定用户，处于停用状态的用户无法继续登录系统，用于后台管理。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 停用用户id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 启用用户 [PUT /api/v1/users/:id/awaken]
重新启用处于停用状态的指定用户，用于后台管理。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 停用用户id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 验证短信 [POST /api/v1/users/sendSms]
用户注册或修改密码时短信验证。

+ Request (application/json)

      {
          "telephone": "13378965431"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data":{}
      }

### 用户信息修改 [PUT /api/v1/users/:id]
登陆后的用户修改自身信息。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 用户id。

+ Request (application/json)

      {
          "telephone": "13378965431",
          "realName": "赵四",
          "iconPath": "/users/touxiang.png",
          "slogan": "海马健康金，助力健康",
          "idNumber": "1XXXXXXXXXXXXXXX",
          "email": "test@test.com",
          "address": "北京市海淀区学院路99号大中电器3层，100089",
          "username": "赵三两"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data":{}
      }

# Group 论坛话题

## 获取论坛话题 [GET /api/v1/topics]
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

### 创建话题 [POST /api/v1/topics]
创建新的话题

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"发现",
          "desc":"这是发现板块"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"name":"发现"}
      }

### 修改话题 [PUT /api/v1/topics/:id]
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

### 关闭话题 [PUT /api/v1/topics/:id/halt]
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

### 启用话题 [PUT /api/v1/topics/:id/awaken]
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
              "praiseNum": "223",
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
          "title": "海马健康金，助力健康",
          "content": "<span>海马健康金是一款。。。</span>"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

# Group 评论

### 获取评论 [GET /api/v1/comments/{?target=01,targetId=123,pages=1,pageNum=10}]
获取指定评论对象的所有评论列表。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 评论对象类型，01-产品，02-服务人员，03-帖子，04-回复。
  + targetId: `product123` (string) - 评论对象唯一标识id。
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

### 发表评论 [POST /api/v1/comments]
对产品、服务人员、帖子或者评论进行评论。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "target": "01",
          "targetId": "product123",
          "commenterId": "user123",
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

# Group 产品

### 新增产品 [POST /api/v1/products]
新增加产品

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "desc": "中日友好",
          "nation": "01",
          "featureH5": "<span>产品亮点</span>",
          "detailH5": "<span>产品介绍</span>",
          "routineH5": "<span>产品行程</span>",
          "feeH5": "<span>产品费用</span>",
          "noticeH5": "<span>预定须知</span>",
          "hospitalH5": "<span>医院简介</span>",
          "itemH5": "<span>基础项内容</span>",
          "adultPrice": "16800",
          "companyPrice": "5000",
          "childPrice": "3000"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product3"}
      }

### 删除产品 [DELETE /api/v1/products/:id]
删除指定产品

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `product123` (string) - 产品唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product3"}
      }

### 获取产品信息 [GET /api/v1/products/:id]
查询指定产品的详细信息，每次查询阅读数加1

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `product123` (string) - 海马论坛帖子唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "id": "product123",
              "desc": "中日友好",
              "nation": "01",
              "featureH5": "<span>产品亮点</span>",
              "detailH5": "<span>产品介绍</span>",
              "routineH5": "<span>产品行程</span>",
              "feeH5": "<span>产品费用</span>",
              "noticeH5": "<span>预定须知</span>",
              "hospitalH5": "<span>医院简介</span>",
              "itemH5": "<span>基础项内容</span>",
              "adultPrice": "16800",
              "companyPrice": "5000",
              "childPrice": "3000",
              "commentNum": "300",
              "praiseNum": "223",
              "views" "499"
          }
      }

### 产品下架 [PUT /api/v1/products/:id/halt]
停用指定产品。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `product123` (string) - 产品id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product123"}
      }

### 产品上架 [PUT /api/v1/products/:id/awaken]
重新启用处于停用状态的指定产品。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `product123` (string) - 产品id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product123"}
      }

### 修改产品信息 [PUT /api/v1/products/:id]
修改产品信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `channel1` (string) - 渠道商id。

+ Request (application/json)

      {
          "desc": "中日友好",
          "nation": "01",
          "featureH5": "<span>产品亮点</span>",
          "detailH5": "<span>产品介绍</span>",
          "routineH5": "<span>产品行程</span>",
          "feeH5": "<span>产品费用</span>",
          "noticeH5": "<span>预定须知</span>",
          "hospitalH5": "<span>医院简介</span>",
          "itemH5": "<span>基础项内容</span>",
          "adultPrice": "16800",
          "companyPrice": "5000",
          "childPrice": "3000"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product123"}
      }

### 获取产品列表 [GET /api/v1/products/{?sort=1,nation=01,pages=1,pageNum=10}]
返回产品列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + sort: `1` (string) - 产品排序方式，1最新2最热3推荐。
  + nation: `01` (string) - 产品所属国家
  + pages: 1 (number) - 列表页数。
  + pageNum: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "products":[
                  {
                    "id": "product123",
                    "desc": "中日友好",
                    "nation": "01",
                    "featureH5": "<span>产品亮点</span>",
                    "detailH5": "<span>产品介绍</span>",
                    "routineH5": "<span>产品行程</span>",
                    "feeH5": "<span>产品费用</span>",
                    "noticeH5": "<span>预定须知</span>",
                    "hospitalH5": "<span>医院简介</span>",
                    "itemH5": "<span>基础项内容</span>",
                    "adultPrice": "16800",
                    "companyPrice": "5000",
                    "childPrice": "3000"
                  },
                  {
                    "id": "product123",
                    ...
                  },
                  {
                    "id": "product123",
                    ...
                  }
              ],
          }
      }

# Group 运营活动

### 新增运营 [POST /api/v1/products/:id/operations]
新增加运营活动

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `product123` (string) - 产品唯一标识id。

+ Request (application/json)

      {
          "target": "01",
          "targetId": "product1",
          "name": "分期",
          "content": "产品支持{period}期分期，{firstPay}就走",
          "var1Name": "period",
          "var1Value": "12",
          "var2Name": "firstPay",
          "var2Value": "3000",
          "startTime": "2018-10-10 12:00:00",
          "endTime": "2018-11-10 12:00:00"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "operation1"}
      }

### 删除运营 [DELETE /api/v1/operations/:id]
删除指定运营

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `operation1` (string) - 运营唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "product3"}
      }

### 修改运营 [PUT /api/v1/operations/:id]
修改运营信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
    + id: `operation1` (string) - 运营唯一标识id。

+ Request (application/json)

      {
          "target": "01",
          "targetId": "product1",
          "name": "分期",
          "content": "产品支持{period}期分期，{firstPay}就走",
          "var1Name": "period",
          "var1Value": "12",
          "var2Name": "firstPay",
          "var2Value": "3000",
          "startTime": "2018-10-10 12:00:00",
          "endTime": "2018-11-10 12:00:00"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "operation1"}
      }

### 获取产品列表 [GET /api/v1/products/{?sort=1,nation=01,pages=1,pageNum=10}]
返回产品列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + sort: `1` (string) - 产品排序方式，1最新2最热3推荐。
  + nation: `01` (string) - 产品所属国家
  + pages: 1 (number) - 列表页数。
  + pageNum: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "products":[
                  {
                    "id": "product123",
                    "desc": "中日友好",
                    "nation": "01",
                    "featureH5": "<span>产品亮点</span>",
                    "detailH5": "<span>产品介绍</span>",
                    "routineH5": "<span>产品行程</span>",
                    "feeH5": "<span>产品费用</span>",
                    "noticeH5": "<span>预定须知</span>",
                    "hospitalH5": "<span>医院简介</span>",
                    "itemH5": "<span>基础项内容</span>",
                    "adultPrice": "16800",
                    "companyPrice": "5000",
                    "childPrice": "3000"
                  },
                  {
                    "id": "product123",
                    ...
                  },
                  {
                    "id": "product123",
                    ...
                  }
              ],
          }
      }

# Group 产品附加项

### 新增附加项 [POST /api/v1/attendants]
新增产品附加项信息，成功返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "price": "4500.00",
          "name": "甲亢检查",
          "desc": "<span>这是一个附加项，可以选的哦</span>",
          "target": "01",
          "status": "01"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "attendant1"}
      }

### 停用附加项 [PUT /api/v1/attendants/:id/halt]
停用指定附加项。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `attendant1` (string) - 停用附加项id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "attendant1"}
      }

### 启用附加项 [PUT /api/v1/attendants/:id/awaken]
重新启用处于停用状态的指定附加项。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `attendant1` (string) - 附加项id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "attendant1"}
      }

### 修改附加项 [PUT /api/v1/attendants/:id]
修改附加项信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "price": "4500.00",
          "name": "甲亢检查",
          "desc": "<span>这是一个附加项，可以选的哦</span>",
          "target": "01",
          "status": "01"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "attendant1"}
      }

### 获取附加项列表 [GET /api/v1/attendants]
返回附加项列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "attendants":[
                  {
                    "id": "attendant1",
                    "price": "4500.00",
                    "name": "甲亢检查",
                    "desc": "<span>这是一个附加项，可以选的哦</span>",
                    "target": "01",
                    "status": "01"
                  },
                  {
                    "id": "attendant2",
                    ...
                  }
              ]
          }
      }

# Group 专家

### 新增专家 [POST /api/v1/product/:id/experts]
新增产品专家信息，成功返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + productId: `product1` (string) - 产品唯一id。

+ Request (application/json)

      {
          "price": "4500.00",
          "name": "甲亢检查",
          "desc": "<span>这是一个附加项，可以选的哦</span>",
          "target": "01",
          "status": "01"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "attendant1"}
      }

### 获取专家列表 [GET /api/v1/product/:id/experts]
返回指定产品下专家列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + productId: `product1` (string) - 产品唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "attendants":[
                  {
                    "id": "attendant1",
                    "price": "4500.00",
                    "name": "甲亢检查",
                    "desc": "<span>这是一个附加项，可以选的哦</span>",
                    "target": "01",
                    "status": "01"
                  },
                  {
                    "id": "attendant2",
                    ...
                  }
              ]
          }
      }

### 删除专家 [DELETE /api/v1/experts/:id]
删除指定专家。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `expert1` (string) - 专家唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "expert1"}
      }

### 修改专家信息 [PUT /api/v1/experts/:id]
修改专家信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `expert1` (string) - 专家唯一id。

+ Request (application/json)

      {
          "price": "4500.00",
          "name": "甲亢检查",
          "desc": "<span>这是一个附加项，可以选的哦</span>",
          "target": "01",
          "status": "01"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "expert1"}
      }

# Group 标签

### 打标签 [POST /api/v1/tags]
为指定对象打标签

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "target": "01",
          "targetId": "product123",
          "name": "精品",
          "targerId": "admin1"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

### 查询标签 [GET /api/v1/tags/{?target=01,targetId=p11}]
删除指定标签信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 标签对象类型。
  + targetId: `product1` (string) - 标签对象唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

### 删除标签 [DELETE /api/v1/tags/:id]
删除指定标签信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `tag1` (string) - 标签唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

# Group 渠道商

## 渠道商 [/api/v1/channels/{?channel_id}]
平台渠道管理相关接口内容。

+ Parameters
    + channel_id: `channel123` (string) - 渠道唯一标识id。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
            "id": "user123",
            "code": "B130001",
            "name": "赵四",
            "advertise": "<span>这是一个包含渠道二维码的推广宣传页面</span>",
            "logo_path": "/users/touxiang.png",
            "description": "numberOne渠道"
        }
    }
    ```

### 获取渠道商信息 [GET]
返回指定渠道商详细信息

+ Response 200

  [渠道商][]

### 删除指定渠道商 [DELETE]
渠道商删除成功返回唯一标识Id

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

### 修改渠道商信息 [PUT]
渠道商信息修改成功返回唯一标识Id

+ Request (application/json)

      {
          "code": "B130001",
          "name": "赵四",
          "advertise": "<span>这是一个包含渠道二维码的推广宣传页面</span>",
          "logo_path": "/users/touxiang.png",
          "description": "numberOne渠道"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

### 新增渠道商 [POST]
新增渠道商信息，成功返回唯一标识Id

+ Request (application/json)

      {
          "code": "B130001",
          "name": "赵四",
          "advertise": "<span>这是一个包含渠道二维码的推广宣传页面</span>",
          "logo_path": "/users/touxiang.png",
          "description": "numberOne渠道"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "channel123"}
      }

## 渠道商列表 [/api/v1/channels/{?limit}]
渠道商列表包含多个渠道信息，只有管理员用户可以查询渠道商列表信息。

+ Parameters
  + limit: 3 (number) - 列表中渠道商的数量。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
          "users":[
            {
              "id": "channel123",
              "code": "B130001",
              "name": "赵四",
              "advertise": "<span>这是一个包含渠道二维码的推广宣传页面</span>",
              "logo_path": "/users/touxiang.png",
              "description": "numberOne渠道"
            },
            {
              "id": "channel134",
              ...
            },
            {
              "id": "channel345",
              ...
            }
          ]
        }
    }
    ```

### 获取渠道商列表 [GET]
返回指定数量渠道商列表信息

+ Response 200

  [渠道商列表][]

# Group 轮播图
轮播图显示在App首页、产品首页头部，实现图片组轮流播放，包括一张图片及相应宣传语。

### 新增轮播图 [POST /api/v1/carousels]
在应用的某一个位置显示一组轮播图，组内轮播图实现轮流播放。如果组内没有图片，则使用默认图片固定显示，如果组内只有一张图片，则固定显示该图片，只有图片大于1张时才进行轮播。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name": "轮播图",
          "desc": "我是一张轮播图",
          "location": "01",
          "productId": "product1",
          "picPath": "/public/carousel/carous.png",
          "target": "B123211",
          "targetId": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 停用轮播图 [PUT /api/v1/carousels/:id/halt]
停用指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 启用轮播图 [PUT /api/v1/carousels/:id/halt]
重新启用处于停用状态的指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 删除轮播图 [DELETE /api/v1/carousels/:id]
删除指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 修改轮播图 [PUT /api/v1/channels/:id]
修改渠道商信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Request (application/json)

      {
          "name": "轮播图",
          "desc": "我是一张轮播图",
          "location": "01",
          "productId": "product1",
          "picPath": "/public/carousel/carous.png",
          "target": "B123211",
          "targetId": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 获取轮播列表 [GET /api/v1/carousels/{?location=01,productId=p11}]
返回渠道商列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + location: `05` (string) - 轮播图位置。
  + productId: `product1` (number) - 产品轮播图对应的产品Id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "channels":[
                  {
                    "id": "carousel3",
					          "name": "轮播图",
					          "desc": "我是一张轮播图",
					          "location": "01",
					          "productId": "product1",
					          "picPath": "/public/carousel/carous.png",
					          "target": "B123211",
					          "targetId": "B123211",
					          "status": "01"
                  },
                  {
                    "id": "carousel4",
                    ...
                  },
                  {
                    "id": "carousel5",
                    ...
                  }
              ],
          }
      }

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

# Group 服务人员

### 翻译人员 [GET /api//v1/servants/{?type=01,nation=01,pages=1,pageNum=10}]
服务人员包含翻译和地接，根据类型和国籍查询列表。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + type: `01` (string) - 服务人员类型，01-翻译 02-地接，00-全部。
  + nation: `01` (string,optional) - 服务人员所属国家，01-日本 02-韩国 03-泰国。
  + pages: 1 (number) - 列表页数。
  + pageNum: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "servants":[
                  {
                    "id": "servant123",
                    "name":"佐藤君",
                    "desc":"佐藤君是一名专业翻译",
                    "picPath":"/public/servants/zuoteng.png",
                    "type":"翻译",
                    "nation":"日本",
                    "service":"文字翻译",
                    "introH5":"<span>日本XXXXX</span>",
                    "literPrice":"500/千字",
                    "followPrice":"5000/小时",
                    "recepPrice":"1000/次"
                  },
                  {
                    "id": "servant345",
                    ...
                  },
                  {
                    "id": "servant456",
                    ...
                  }
              ],
          }
      }


### 新增服务人员 [POST /api/v1/servants]
新增服务人员

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"佐藤君",
          "desc":"佐藤君是一名专业翻译",
          "picPath":"/public/servants/zuoteng.png",
          "type":"翻译",
          "nation":"日本",
          "service":"文字翻译",
          "introH5":"<span>日本XXXXX</span>",
          "literPrice":"500/千字",
          "followPrice":"5000/小时",
          "recepPrice":"1000/次"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 停用服务人员 [PUT /api/v1/servants/:id/halt]
停用指定渠道商。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `servant123` (string) - 服务人员id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 启用服务人员 [PUT /api/v1/servants/:id/awaken]
重新启用服务人员。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `servant123` (string) - 服务人员id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 修改服务人员 [PUT /api/v1/servants/:id]
修改服务人员信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"佐藤君",
          "desc":"佐藤君是一名专业翻译",
          "picPath":"/public/servants/zuoteng.png",
          "type":"翻译",
          "nation":"日本",
          "service":"文字翻译",
          "introH5":"<span>日本XXXXX</span>",
          "literPrice":"500/千字",
          "followPrice":"5000/小时",
          "recepPrice":"1000/次"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

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

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

### 查询用户信息 [GET /api/v1/users/{?sort=1,pages=1,pagenum=10}]
管理员查询所有用户列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + sort: `1` (string,optional) - 用户列表排序方式，选填。
  + pages: 1 (number) - 用户列表页数。
  + pagenum: 10 (number) - 用户列表每页数量

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

### 停用用户 [PUT /api/v1/user/:id/halt]
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

### 启用用户 [PUT /api/v1/user/:id/awaken]
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

### 验证短信 [POST /api/v1/user/sendSms]
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

### 用户信息修改 [PUT /api/v1/user]
登陆后的用户修改自身信息。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "telephone": "13378965431",
          "password": "qwQs1w4",//最少6位数字、字母大小写组成的密码
          "realName": "赵四",
          "telephone": "13378965431",
          "iconPath": "/users/touxiang.png",
          "slogan": "海马健康金，助力健康",
          "idNumber": "1XXXXXXXXXXXXXXX",
          "email": "test@test.com",
          "password": "UWEhsyy1",
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

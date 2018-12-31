# Group 用户

### 用户登录/注册 [PUT /api/v1/user/login]
用户使用手机号码及短信验证码进行登录，如果手机号码不存在，则注册成新用户并登录。

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

### 查询用户信息 [GET /api/v1/users]
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

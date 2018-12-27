# Group 产品附加项


### 新增附加项 [POST /api/v1/attendants]
新增渠道商信息，成功返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

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

### 停用附加项 [PUT /api/v1/attendants/:id/halt]
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

### 启用附加项 [PUT /api/v1/attendants/:id/awaken]
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

### 修改附加项 [PUT /api/v1/attendants/:id]
渠道商信息修改成功返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

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

### 获取附加项列表 [GET /api/v1/attendants]
返回指定渠道商详细信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

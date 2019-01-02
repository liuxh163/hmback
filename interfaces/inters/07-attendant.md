# Group 产品附加项

### 新增附加项 [POST /api/v1/attendants]
新增产品附加项信息，成功返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "price": "4500.00",
          "name": "甲亢检查",
          "desc": "这是一个附加项，可以选的哦",
          "target": "01"
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

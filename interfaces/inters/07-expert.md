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

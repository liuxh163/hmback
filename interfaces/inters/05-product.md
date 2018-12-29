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

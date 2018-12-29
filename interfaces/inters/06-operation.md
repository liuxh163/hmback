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

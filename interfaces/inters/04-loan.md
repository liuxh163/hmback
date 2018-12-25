# Group 海马金

## 海马金融 [/api/v1/loans/{loan_id}]
平台提供海外医疗金融产品，统称海马金融，简称海马金，本节内容主要包含海马金融产品的维护和查询相关接口内容。

+ Parameters
    + loan_id: `loan123` (string) - 海马金融产品唯一标识id。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
            "id": "loan123",
            "slogan": "海马健康金，助力健康",
            "descrition": "<span>海马健康金是一款。。。</span>",
            "period": "<span>海马健康金分12期偿还，每期末支付利息，最后。。。</span>",
            "money": "30000.00 RMB",//产品金额
            "profit": 0.0350//金融产品利率
        }
    }
    ```

### 获取海马金融产品信息 [GET]
返回指定海马金融产品的详细信息

+ Response 200

  [海马金融][]

### 删除指定海马金融产品 [DELETE]
海马金融产品删除成功返回唯一标识Id

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "loan123"}
      }

### 修改指定海马金融产品信息 [PUT]
产品信息修改成功返回唯一标识Id

+ Request (application/json)

      {
          "id": "translator123",
          "slogan": "海马健康金，助力健康",
          "descrition": "<span>海马健康金是一款。。。</span>",
          "period": "<span>海马健康金分12期偿还，每期末支付利息，最后。。。</span>",
          "money": "30000.00 RMB",//产品金额
          "profit": 0.0350//金融产品利率
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "loan123"}
      }

## 海马金融产品列表 [/api/v1/loans/{?limit,sort_type}]
医疗产品列表包含多个金融产品。

+ Parameters
  + limit: 3 (number) - 海马金融产品列表中产品的数量。
  + sort_type: `01` (string, optional) - 产品排序类型，01-最新，02-最热，03-推荐

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
          "loans":[
            {
              "id": "loan123",
              "slogan": "海马健康金，助力健康",
              "descrition": "<span>海马健康金是一款。。。</span>",
              "period": "<span>海马健康金分12期偿还，每期末支付利息，最后。。。</span>",
              "money": "30000.00 RMB",//产品金额
              "profit": 0.0350//金融产品利率
            },
            {
              "id": "loan134",
              ...
            },
            {
              "id": "loan345",
              ...
            }
          ]
        }
    }
    ```

### 获取海马金融产品列表 [GET]
返回指定数量的金融产品列表信息

+ Response 200

  [海马金融产品列表][]

### 新增金融产品 [POST]
在应用中新增加一个金融产品。

+ Request (application/json)

      {
          "slogan": "海马健康金，助力健康",
          "descrition": "<span>海马健康金是一款。。。</span>",
          "period": "<span>海马健康金分12期偿还，每期末支付利息，最后。。。</span>",
          "money": "30000.00 RMB",//产品金额
          "profit": 0.0350//金融产品利率
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "loan123"}
      }

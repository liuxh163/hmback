# Group 翻译人员

## 翻译人员 [/api/v1/translators/{translator_id}]
平台翻译人员包含文字翻译和陪同翻译2种，本节内容主要包含对翻译人员进行维护和查询的相关接口内容。

+ Parameters
    + translator_id: `translator123` (string) - 翻译人员唯一标识id。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
            "id": "translator123",
            "school": "东京早稻田大学中文系",
            "picture_path":"/translators/01/fanyi123.png",
            "introduction": "<span>XX近两年内层服务过300人次赴日旅游，翻译医学档案50次，均获得4星以上评价。。。</span>",
            "service": "<span>XX主要提供医学档案类文字翻译服务，赴日就诊陪同翻译服务。。。</span>",
            "liter_price": "3000.00 RMB/千字",
            "follow_price": "300.00 RMB/小时",
            "nation": "01",
            "rank": 4.5,//星级
            "comment_num": 23,//评论数
            "praise_num": 160//点赞数
        }
    }
    ```

### 获取翻译信息 [GET]
返回指定翻译的详细信息

+ Response 200

  [翻译人员][]

### 删除指定翻译人员 [DELETE]
翻译人员删除成功返回唯一标识Id

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "translator123"}
      }

### 修改指定翻译人员信息 [PUT]
产品信息修改成功返回唯一标识Id

+ Request (application/json)

      {
          "id": "translator123",
          "school": "东京早稻田大学中文系",
          "picture_path":"/translators/01/fanyi123.png",
          "introduction": "<span>XX近两年内层服务过300人次赴日旅游，翻译医学档案50次，均获得4星以上评价。。。</span>",
          "service": "<span>XX主要提供医学档案类文字翻译服务，赴日就诊陪同翻译服务。。。</span>",
          "liter_price": "3000.00",
          "follow_price": "300.00",
          "nation": "01",
          "rank": 4
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "translator123"}
      }

## 翻译列表 [/api/v1/translators/{?nation,limit,sort_type}]
医疗产品集合包含多个同类型医疗产品。

+ Parameters
  + nation: `01` (string) - 翻译人员所属国家，01-日本，02-韩国，03-泰国。
  + limit: 3 (number) - 翻译列表中翻译人员的数量。
  + sort_type: `01` (string) - 产品排序类型，01-最新，02-最热，03-推荐

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
          "translators":[
            {
              "id": "translator123",
              "school": "东京早稻田大学中文系",
              "picture_path":"/translators/01/fanyi123.png",
              "introduction": "<span>XX近两年内层服务过300人次赴日旅游，翻译医学档案50次，均获得4星以上评价。。。</span>",
              "service": "<span>XX主要提供医学档案类文字翻译服务，赴日就诊陪同翻译服务。。。</span>",
              "liter_price": "3000.00",
              "follow_price": "300.00",
              "nation": "01",
              "rank": 4,
              "comment_num": 23,//评论数
              "praise_num": 160//点赞数
            },
            {
              "id": "translator134",
              ...
            },
            {
              "id": "translator345",
              ...
            }
          ]
        }
    }
    ```

### 获取翻译列表 [GET]
返回指定国家指定数量的翻译人员列表信息

+ Response 200

  [翻译列表][]

### 新增翻译人员 [POST]
在应用中新增加一个翻译人员。

+ Request (application/json)

      {
          "id": "translator123",
          "school": "东京早稻田大学中文系",
          "picture_path":"/translators/01/fanyi123.png",
          "introduction": "<span>XX近两年内层服务过300人次赴日旅游，翻译医学档案50次，均获得4星以上评价。。。</span>",
          "service": "<span>XX主要提供医学档案类文字翻译服务，赴日就诊陪同翻译服务。。。</span>",
          "liter_price": "3000.00",
          "follow_price": "300.00",
          "nation": "01",
          "rank": 4
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "translator123"}
      }

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

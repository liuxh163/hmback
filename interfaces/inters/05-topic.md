# Group 论坛话题

## 论坛话题 [/api/v1/forum/topics/{?topic_id}]
海马社区目前只有2个话题，分别是‘发现’和‘说说’，发现属于普通论坛发帖，说说为用户亲历日记，本节内容主要包含话题的维护和查询相关接口内容。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
            "id": "topic1",
            "name": "发现",
            "descrition": ""
        }
    }
    ```

### 获取话题信息 [GET]
返回指定论坛话题信息

+ Parameters
    + topic_id: `loan123` (string, optional) - 海马社区论坛话题唯一标识id。

+ Response 200

  [论坛话题][]

### 获取话题列表 [GET]
返回指定数量的金融产品列表信息

+ Request (application/json)

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "topics":[
                  {
                    "id": "topic1",
                    "name":"发现",
                    "desctription":""
                  },
                  {
                    "id": "topic2",
                    "name": "说说",
                    "description":""
                  }
              ],
          }
      }

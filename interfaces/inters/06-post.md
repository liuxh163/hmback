# Group 帖子

## 帖子 [/api/v1/forum/topics/{topic_id}/posts/{?post_id}]
平台提供海外医疗金融产品，统称海马金融，简称海马金，本节内容主要包含海马金融产品的维护和查询相关接口内容。

+ Parameters
    + topic_id: `topic123` (string) - 海马社区论坛话题唯一标识id。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功"
        "data": {
            "id": "loan123",
            "topic_id": "topic1",
            "title": "海马健康金，助力健康",
            "content": "<span>海马健康金是一款。。。</span>",
            "location": "<span>韩国，首尔</span>",
            "comment_num": "300",
            "praise_num": "223",
            "view_num" "499"
        }
    }
    ```

### 获取帖子信息 [GET]
返回指定帖子的详细信息

+ Parameters
    + post_id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Response 200

  [帖子][]

### 删除指定帖子 [DELETE]
海马金融产品删除成功返回唯一标识Id

+ Parameters
    + post_id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

### 修改指定帖子信息 [PUT]
帖子信息修改成功返回唯一标识Id

+ Parameters
    + post_id: `post123` (string) - 海马论坛帖子唯一标识id。

+ Request (application/json)

      {
          "title": "海马健康金，助力健康",
          "content": "<span>海马健康金是一款。。。</span>"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

### 获取帖子列表 [GET]
返回指定数量的金融产品列表信息

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功"
          "data": {
            "posts":[
              {
                "id": "post123",
                "topic_id": "topic1",
                "title": "海马健康金，助力健康",
                "content": "<span>海马健康金是一款。。。</span>",
                "location": "<span>韩国，首尔</span>",
                "comment_num": "300",
                "praise_num": "223",
                "view_num" "499"
              },
              {
                "id": "post134",
                ...
              },
              {
                "id": "post345",
                ...
              }
            ]
          }
      }

### 发布帖子 [POST]
新发布一个论坛帖子。

+ Request (application/json)

      {
          "topic_id": "topic1",
          "title": "海马健康金，助力健康",
          "content": "<span>海马健康金是一款。。。</span>",
          "location": "<span>韩国，首尔</span>",
          "location_x": 0.0350, //发布者位置坐标
          "location_y": 0.0350 //发布者位置坐标
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "post123"}
      }

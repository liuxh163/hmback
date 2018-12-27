comment# Group 帖子回复

## 帖子回复 [/api/v1/forum/topics/{topic_id}/posts/{post_id}/replies/{?reply_id}]
本节内容主要包含论坛帖子回复相关接口内容。

+ Parameters
    + topic_id: `topic123` (string) - 海马社区论坛话题唯一标识id。
    + post_id: `post123` (string) - 海马论坛帖子唯一标识id。

### 获取帖子回复列表 [GET]
返回指定帖子的回复列表信息

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
            "replies": [
              {
                "id": "reply1231",
                "reply_id": "reply123",
                "content": "<span>海马健康金是一款。。。</span>",
                "user": {
                  "id": "user123",
                  "name": "天涯沦落人",
                  "icon_path": "/users/touxiang.png"
                },
                "reply_time": "2018-10-15 19:08:20"
              },
              {
                "id": "reply123",
                "reply_id": "",
                ...
              },
              {
                "id": "reply124",
                "reply_id": "",
                ...
              }
            ]
          }
      }

### 撤回指定回复 [DELETE]
回复撤回成功返回唯一标识Id

+ Parameters
    + reply_id: `reply123` (string) - 社区论坛帖子回复唯一标识id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "reply123"}
      }

### 回复帖子或评论 [POST]
对论坛中的帖子或者评论进行回复。

+ Request (application/json)

      {
          "reply_id": "reply123",//有即为对回复进行回复，空即为对帖子进行回复
          "content": "<span>海马健康金是一款。。。</span>",
          "user_id": "user123"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "reply123"}
      }

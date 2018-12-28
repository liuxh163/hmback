# Group 标签

### 打标签 [POST /api/v1/tags]
为指定对象打标签

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "target": "01",
          "targetId": "product123",
          "name": "精品",
          "targerId": "admin1"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

### 查询标签 [GET /api/v1/tags/{?target=01,targetId=p11}]
删除指定标签信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + target: `01` (string) - 标签对象类型。
  + targetId: `product1` (string) - 标签对象唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

### 删除标签 [DELETE /api/v1/tags/:id]
删除指定标签信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `tag1` (string) - 标签唯一id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "tag3"}
      }

# Group 服务人员

### 翻译人员 [GET /api//v1/servants/{?type=01,nation=01,pages=1,pageNum=10}]
服务人员包含翻译和地接，根据类型和国籍查询列表。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + type: `01` (string) - 服务人员类型，01-翻译 02-地接，00-全部。
  + nation: `01` (string,optional) - 服务人员所属国家，01-日本 02-韩国 03-泰国。
  + pages: 1 (number) - 列表页数。
  + pageNum: 10 (number) - 列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "servants":[
                  {
                    "id": "servant123",
                    "name":"佐藤君",
                    "desc":"佐藤君是一名专业翻译",
                    "picPath":"/public/servants/zuoteng.png",
                    "type":"翻译",
                    "nation":"日本",
                    "service":"文字翻译",
                    "introH5":"<span>日本XXXXX</span>",
                    "literPrice":"500/千字",
                    "followPrice":"5000/小时",
                    "recepPrice":"1000/次"
                  },
                  {
                    "id": "servant345",
                    ...
                  },
                  {
                    "id": "servant456",
                    ...
                  }
              ],
          }
      }


### 新增服务人员 [POST /api/v1/servants]
新增服务人员

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"佐藤君",
          "desc":"佐藤君是一名专业翻译",
          "picPath":"/public/servants/zuoteng.png",
          "type":"翻译",
          "nation":"日本",
          "service":"文字翻译",
          "introH5":"<span>日本XXXXX</span>",
          "literPrice":"500/千字",
          "followPrice":"5000/小时",
          "recepPrice":"1000/次"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 停用服务人员 [PUT /api/v1/servants/:id/halt]
停用指定渠道商。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `servant123` (string) - 服务人员id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 启用服务人员 [PUT /api/v1/servants/:id/awaken]
重新启用服务人员。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `servant123` (string) - 服务人员id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

### 修改服务人员 [PUT /api/v1/servants/:id]
修改服务人员信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name":"佐藤君",
          "desc":"佐藤君是一名专业翻译",
          "picPath":"/public/servants/zuoteng.png",
          "type":"翻译",
          "nation":"日本",
          "service":"文字翻译",
          "introH5":"<span>日本XXXXX</span>",
          "literPrice":"500/千字",
          "followPrice":"5000/小时",
          "recepPrice":"1000/次"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "servant123"}
      }

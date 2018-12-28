# Group 轮播图
轮播图显示在App首页、产品首页头部，实现图片组轮流播放，包括一张图片及相应宣传语。

### 新增轮播图 [POST /api/v1/carousels]
在应用的某一个位置显示一组轮播图，组内轮播图实现轮流播放。如果组内没有图片，则使用默认图片固定显示，如果组内只有一张图片，则固定显示该图片，只有图片大于1张时才进行轮播。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "name": "轮播图",
          "desc": "我是一张轮播图",
          "location": "01",
          "productId": "product1",
          "picPath": "/public/carousel/carous.png",
          "target": "B123211",
          "targetId": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 停用轮播图 [PUT /api/v1/carousels/:id/halt]
停用指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 启用轮播图 [PUT /api/v1/carousels/:id/halt]
重新启用处于停用状态的指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 删除轮播图 [DELETE /api/v1/carousels/:id]
删除指定轮播图。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 修改轮播图 [PUT /api/v1/channels/:id]
修改渠道商信息，返回唯一标识Id

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `carousel3` (string) - 轮播id。

+ Request (application/json)

      {
          "name": "轮播图",
          "desc": "我是一张轮播图",
          "location": "01",
          "productId": "product1",
          "picPath": "/public/carousel/carous.png",
          "target": "B123211",
          "targetId": "B123211"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "carousel3"}
      }

### 获取轮播列表 [GET /api/v1/carousels/{?location=01,productId=p11}]
返回渠道商列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + location: `05` (string) - 轮播图位置。
  + productId: `product1` (number) - 产品轮播图对应的产品Id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
              "channels":[
                  {
                    "id": "carousel3",
					          "name": "轮播图",
					          "desc": "我是一张轮播图",
					          "location": "01",
					          "productId": "product1",
					          "picPath": "/public/carousel/carous.png",
					          "target": "B123211",
					          "targetId": "B123211",
					          "status": "01"
                  },
                  {
                    "id": "carousel4",
                    ...
                  },
                  {
                    "id": "carousel5",
                    ...
                  }
              ],
          }
      }

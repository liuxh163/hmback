FORMAT: 1A
HOST: http://api.haima101.com

# 海马项目接口说明
本文的提供海马项目相关Restful接口详细说明。

# Group 用户

### 用户注册 [POST /api/v1/user/signup]
用户使用手机号和短信验证码进行注册，注册成功直接登录系统

+ Request (application/json)

      {
          "telephone": "13378965431",
          "smscode": "123456"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"accessToken": "dba3a540-0794-11e9-9b81-999da2f6363a"}
      }

### 用户登录 [PUT /api/v1/user/login]
用户使用手机号码及短信验证码进行登录。

+ Request (application/json)

      {
          "telephone": "13378965431",
          "smscode": "123456"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"accessToken": "dba3a540-0794-11e9-9b81-999da2f6363a"}
      }


### 用户登出 [PUT /api/v1/user/logout]
用户登出系统，主要用于管理员退出登录

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {}
      }

### 查询用户信息 [GET /api/v1/users/{?sort=1,pages=1,pagenum=10}]
管理员查询所有用户列表信息

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + sort: `1` (string,optional) - 用户列表排序方式，选填。
  + pages: 1 (number) - 用户列表页数。
  + pagenum: 10 (number) - 用户列表每页数量

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {
            "users":[
              {
                "id":"123",
                "loginid":"user123",
                "telephone":"13212312312",
                "realname":"刘依依",
                "username":"niuliu",
                "loginCount":"12",
                "ipAddress":"192.168.6.111"
              },
              {
                "id":"234"
                ...
              },
              {
                "id":"345"
                ...
              },
            ]
          }
      }

### 停用用户 [PUT /api/v1/user/:id/halt]
停用指定用户，处于停用状态的用户无法继续登录系统，用于后台管理。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 停用用户id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 启用用户 [PUT /api/v1/user/:id/awaken]
重新启用处于停用状态的指定用户，用于后台管理。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Parameters
  + id: `1` (string) - 停用用户id。

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "123"}
      }

### 验证短信 [POST /api/v1/user/sendSms]
用户注册或修改密码时短信验证。

+ Request (application/json)

      {
          "telephone": "13378965431"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data":{}
      }

### 用户信息修改 [PUT /api/v1/user]
登陆后的用户修改自身信息。

+ Headers
  hmtoken: "dba3a540-0794-11e9-9b81-999da2f6363a"

+ Request (application/json)

      {
          "telephone": "13378965431",
          "password": "qwQs1w4",//最少6位数字、字母大小写组成的密码
          "realName": "赵四",
          "telephone": "13378965431",
          "iconPath": "/users/touxiang.png",
          "slogan": "海马健康金，助力健康",
          "idNumber": "1XXXXXXXXXXXXXXX",
          "email": "test@test.com",
          "password": "UWEhsyy1",
          "address": "北京市海淀区学院路99号大中电器3层，100089",
          "username": "赵三两"
      }

+ Response 200

      {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data":{}
      }

# Group 产品

## 产品 [/api/v1/products/{?product_id}]
医疗产品包含简介、国家、套餐、金额等信息，本节提供医疗产品相关接口说明。

+ Parameters
    + product_id: `abc321` (string) - 医疗产品唯一标识id。

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200"
        "errcode": "10001",
        "message": "操作成功",
        "data": {
            "id": "abc123",
            "slogan": "东京健康舒适性",
            "cover_path":"/products/01/picureyiyuan123.png",
            "introduction": "<span>它是医疗产品简介的H5内容描述。。。</span>",
            "content": "<span>它是产品详情的H5页面内容。。。</span>",
            "attendant": "<span>它是产品服务人员H5页面内容。。。</span>",
            "lodging": "<span>它是产品住宿安排H5页面内容。。。</span>",
            "location_x":123.345,
            "location_y":234.456,
            "comment_num": 23,//评论数
            "praise_num": 160//点赞数
        }
    }
    ```

### 获取产品信息 [GET]
返回指定的产品信息

+ Response 200

  [产品][]

### 删除指定产品 [DELETE]
产品删除成功返回唯一标识Id

+ Response 200

	    {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "abc123"}
	    }

### 修改指定产品信息 [PUT]
产品信息修改成功返回唯一标识Id

+ Request (application/json)

	    {
	      	"id": "abc123",
					"slogan": "东京健康舒适性",
		      "cover_path":"/products/01/picureyiyuan123.png",
		      "introduction": "<span>它是医疗产品简介的H5内容描述。。。</span>",
		      "content": "<span>它是产品详情的H5页面内容。。。</span>",
		      "attendant": "<span>它是产品服务人员H5页面内容。。。</span>",
		      "lodging": "<span>它是产品住宿安排H5页面内容。。。</span>",
		      "location_x":123.345,
		      "location_y":234.456
	    }

+ Response 200

	    {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "abc123"}
	    }

### 创建产品 [POST]
创建一个新产品。

+ Request (application/json)

	    {
	      	"nation": "01",
					"slogan": "东京健康舒适性",
		      "cover_path":"/products/01/picureyiyuan123.png",
		      "introduction": "<span>它是医疗产品简介的H5内容描述。。。</span>",
		      "content": "<span>它是产品详情的H5页面内容。。。</span>",
		      "attendant": "<span>它是产品服务人员H5页面内容。。。</span>",
		      "lodging": "<span>它是产品住宿安排H5页面内容。。。</span>",
		      "location_x":123.345,
		      "location_y":234.456
	    }

+ Response 200

	    {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"id": "abc123"}
	    }

## 产品列表 [/api/v1/products/{?nation,limit,sort_type}]
医疗产品列表包含多个同类型医疗产品。

+ Parameters
	+ nation: `01` (string) - 产品所属国家，01-日本，02-韩国，03-泰国。
  + limit: 3 (number) - 医疗产品集合中产品数量。
  + sort_type: `01` (string) - 产品排序类型，01-最新，02-最热，03-推荐

+ Model (application/json)

    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
        	"products":[
        		{
        			"id": "abc123",
	            "slogan": "东京健康舒适性",
	            "cover_path":"/products/01/picureyiyuan123.png",
	            "introduction": "<span>它是医疗产品简介的H5内容描述。。。</span>",
	            "content": "<span>它是产品详情的H5页面内容。。。</span>",
	            "attendant": "<span>它是产品服务人员H5页面内容。。。</span>",
	            "lodging": "<span>它是产品住宿安排H5页面内容。。。</span>",
	            "location_x":123.345,
	            "location_y":234.456,
	            "comment_num": 23,//评论数
	            "praise_num": 160//点赞数
        		},
        		{
        			"id": "abc134",
        			...
        		},
        		{
        			"id": "abc345",
        			...
        		}
        	]
        }
    }
    ```

### 获取产品列表 [GET]
返回指定的产品信息

+ Response 200

  [产品列表][]

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

# Group 轮播图
轮播图显示在App首页、产品首页头部，实现图片组轮流播放，包括一张图片及相应宣传语。

## 轮播图组 [/api/v1/carousels/{location}]
在应用的某一个位置显示一组轮播图，组内轮播图实现轮流播放。如果组内没有图片，则使用默认图片固定显示，如果组内只有一张图片，则固定显示该图片，只有图片大于1张时才进行轮播。

+ Parameters
	+ location: `01` (string) - 轮播图位置编码，01-APP首页，02-产品首页，03-翻译首页。

+ Model (application/json)
    ```js
    {

      "success":true,
      "status": "200",
      "errcode": "10001",
      "message": "操作成功",
      "data": {
	        "carousels":[
		        {
		        	"description": "<span>精密体检带给您不一样的体验</span>",
		        	"picture_path": "/carousels/01/picure123.png",
		        	"targetType": "01",//01-产品，02-帖子，03-翻译，04-海马金,05-h5页面
		        	"targetId": "abc123"
		      	},
		      	{
		        	"description": "<span>造人天堂欢迎你来</span>",
		        	"picture_path": "/carousels/01/picure123.png",
		        	"targetType": "01",//01-产品，02-帖子，03-翻译，04-海马金,05-h5页面
		        	"targetId": "adc124"
		      	},
		      	{
		        	"description": "<span>想要体验每天都不一样的感觉吗</span>",
		        	"picture_path": "/carousels/01/picure123.png",
		        	"targetType": "01",//01-产品，02-帖子，03-翻译，04-海马金,05-h5页面
		        	"targetId": "afc125"
		      	}
	        ]
	    }//end of data
    }
    ```
### 获取轮播图组 [GET]
返回指定位置的轮播图组

+ Response 200
    [轮播图组][]

## 轮播图 [/api/v1/carousels/{?location,carousel_id}]
在应用的某一个位置显示一组轮播图，组内轮播图实现轮流播放。

+ Parameters
	+ location: `01` (string) - 轮播图位置编码，01-APP首页，02-产品首页。
	+ carousel_id: `abc123` (string) - 轮播图唯一标识Id。

+ Model (application/json)
    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {
	        	"description": "<span>精密体检带给您不一样的体验</span>",
	        	"picture_path": "/carousels/01/picure123.png",
	        	"targetType": "01",//01-产品，02-帖子，03-翻译，04-海马金,05-h5页面
	        	"targetId": "abc123"
		    }//end of data
    }
    ```

### 删除一个轮播图 [DELETE]
轮播图删除成功返回轮播图标识Id

+ Response 200

	    {
          "success":true,
          "status": "200",
          "errcode": "10001",
          "message": "操作成功",
          "data": {"carousel_id":"carousel123"}
	    }

### 创建轮播图 [POST]
创建一个新轮播图，初始状态为暂停播放，需要手工设置播放状态。

+ Request (application/json)

	    {
	      	"description": "精密体检带给您不一样的体验",
	      	"picture_path": "/carousels/01/picure123.png",
	      	"location": "01", //01-APP首页，02-产品首页
	      	"targetType": "01",//01-产品，02-帖子，03-翻译，04-海马金,05-h5页面
	      	"targetId": "abc123"
	    }

+ Response 201

    [轮播图][]

## 轮播启停 [/api/v1/carousels/{carousel_id}/status]
轮播图可以设置启用、停用状态。

+ Parameters
    + carousel_id: `01` (string) - 轮播图标识id。

+ Model (application/json)
    ```js
    {
        "success":true,
        "status": "200",
        "errcode": "10001",
        "message": "操作成功",
        "data": {}
    }
    ```
### 启用轮播图 [PUT]
启用操作标识可用（未删除）的停用轮播图。

*Note: 只有未删除的轮播图可以操作。
       只有停用状态的轮播图才可以启用。*

+ Response 200

    [轮播启停][]

### 停用轮播图 [DELETE]
将启用状态的轮播图设置为停用。

+ Response 200

    [轮播启停][]

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

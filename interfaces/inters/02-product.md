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

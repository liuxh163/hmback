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

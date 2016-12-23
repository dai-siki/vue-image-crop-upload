# vue-image-crop-upload

A beautiful vue component for image crop and upload. （vue图片剪裁上传组件）

## 中文文档在下面

## Demo
[Click me](http://dai-siki.github.io/vue-image-crop-upload/example/demo.html).

## Screenshot
![screenshot](screenshot/1.png)

## Brower compatibility
IE10+


## Env
vue@1.0 + webpack + es6


## Install
#### npm
```shell
$ npm install vue-image-crop-upload
```


## Usage
#### Props
| 名称              | 类型               | 默认             | 说明                                         |
| ----------------| ---------------- | ---------------| ------------------------------------------|
| field       | String   | 'upload'     | Upload input filename, used for server side get the file stream.    |
| value             | Boolean            | twoWay            | show or not    |
| url             | String            |  ''                | Server api path,like "/avatar/upload"    |
| otherParams             | Object            |  null                | POST Params，like "{k:v}"    |
| langType             | String            | 'zh'                 | language type    |
| langConf             | Object            |                   | language extend    |
| width             | Number            |   200                | width of receive image     |
| height             | Number            |  200                 | height of receive image   |
| imgFormat             | string            | 'jpg'                  | jpg/png, Server api receive file type.    |

#### Events
| 名称              | 说明                                         |
| ----------------| ------------------------------------------|
| cropSuccess   | image crop success, params( imageUrl, field )     |
| cropUploadSuccess | upload success, params( jsonData, field )    |
| cropUploadFail    | upload fail, params( status, field )    |

#### Language package
```js
{
    zh: {
        hint: '点击，或拖动图片至此处',
        loading: '正在上传……',
        noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
        success: '上传成功',
        preview: '头像预览',
        btn: {
            off: '取消',
            close: '关闭',
            back: '上一步',
            save: '保存'
        },
        error: {
            onlyImg: '仅限图片格式',
            outOfSize: '单文件大小不能超过 ',
            lowestPx: '图片最低像素为（宽*高）：'
        }
    },
    en: {
        hint: 'Click, or drag picture to there',
        loading: 'Uploading……',
        noSupported: 'Browser not supported, please use IE10+ or else browser',
        success: 'Upload success',
        preview: 'Preview',
        btn: {
            off: 'Off',
            close: 'Close',
            back: 'Back',
            save: 'Save'
        },
        error: {
            onlyImg: 'Only image',
            outOfSize: 'Image is out of size: ',
            lowestPx: 'Image lowest pixel（width*height）：'
        }
    }
};
```

#### Example
```html
<div id="app">
	<a class="btn" @click="toggleShow">set avatar</a>
	<my-upload url="/upload" field="img"
        lang-type="en"
		:value.sync="show"
		:other-params="otherParams"></my-upload>
</div>

<script>
	import 'babel-polyfill'; // es6 shim
	import Vue from 'vue';
	import mySwitch from 'vue-image-crop-upload';

	new Vue({
		el: '#app',
		data: {
			show: true,
			otherParams: {
				token: '123456798',
				name: 'avatar'
			}
		},
		components: {
			'my-upload': myUpload
		},
		methods: {
			toggleShow() {
				this.show = !this.show;
			}
		},
		events: {
            /**
			 * crop success
			 *
			 * [param] jsonData
			 * [param] field
			 */
			cropSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload success
			 *
			 * [param] jsonData   server api return data, already json encode
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			}
		}
	});

</script>
```

--------------------------------


## 示例
[点我](http://dai-siki.github.io/vue-image-crop-upload/example/demo.html).

## 截图
![screenshot](screenshot/2.png)

## 浏览器兼容
IE10+


## 配置环境
vue@1.0 + webpack + es6


## 安装
#### npm
```shell
$ npm install vue-image-crop-upload
```


## 使用
#### Props
| 名称              | 类型               | 默认             | 说明                                         |
| ----------------| ---------------- | ---------------| ------------------------------------------|
| field       | String   | 'upload'     | 向服务器上传的文件名    |
| value             | Boolean            | twoWay            | 是否显示控件，双向绑定    |
| url             | String            |  ''                | 上传接口地址    |
| otherParams             | Object            |  null                | 上传附带其他数据，如"{k:v}"    |
| langType             | String            | 'zh'                 | 语言类型，默认中文    |
| langConf             | Object            |                   | 语言包自行扩展    |
| width             | Number            |   200                | 最终得到的图片宽度     |
| height             | Number            |  200                 | 最终得到的图片高度   |
| imgFormat             | string            | 'jpg'                  | jpg/png, 最终得到的图片格式    |

#### Events
| 名称              | 说明                                         |
| ----------------| ------------------------------------------|
| cropSuccess   | 图片截取完成事件（上传前), 参数( imageUrl, field )     |
| cropUploadSuccess | 上传成功， 参数( jsonData, field )    |
| cropUploadFail    | 上传失败， 参数( status, field )    |

#### 自带语言包
```js
{
    zh: {
        hint: '点击，或拖动图片至此处',
        loading: '正在上传……',
        noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
        success: '上传成功',
        preview: '头像预览',
        btn: {
            off: '取消',
            close: '关闭',
            back: '上一步',
            save: '保存'
        },
        error: {
            onlyImg: '仅限图片格式',
            outOfSize: '单文件大小不能超过 ',
            lowestPx: '图片最低像素为（宽*高）：'
        }
    },
    en: {
        hint: 'Click, or drag picture to there',
        loading: 'Uploading……',
        noSupported: 'Browser not supported, please use IE10+ or else browser',
        success: 'Upload success',
        preview: 'Preview',
        btn: {
            off: 'Off',
            close: 'Close',
            back: 'Back',
            save: 'Save'
        },
        error: {
            onlyImg: 'Only image',
            outOfSize: 'Image is out of size: ',
            lowestPx: 'Image lowest pixel（width*height）：'
        }
    }
};
```

#### 使用示例
```html
<div id="app">
	<a class="btn" @click="toggleShow">设置头像</a>
	<my-upload url="/upload" field="img"
        lang-type="en"
		:value.sync="show"
		:other-params="otherParams"></my-upload>
</div>

<script>
	import 'babel-polyfill'; // es6 shim
	import Vue from 'vue';
	import mySwitch from 'vue-image-crop-upload';

	new Vue({
		el: '#app',
		data: {
			show: true,
			otherParams: {
				token: '123456798',
				name: 'avatar'
			}
		},
		components: {
			'my-upload': myUpload
		},
		methods: {
			toggleShow() {
				this.show = !this.show;
			}
		},
		events: {
            /**
			 * crop success
			 *
			 * [param] jsonData
			 * [param] field
			 */
			cropSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			}
		}
	});

</script>
```

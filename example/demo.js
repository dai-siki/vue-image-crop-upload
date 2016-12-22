import 'babel-polyfill';
import Vue from 'vue';
import myUpload from '../upload.vue';


new Vue({
	el: '#app',
	data: {
		show: true,
		otherParams: {
			token: '123456798',
			name: 'img'
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
		uploadSuccess(data, field, key){
			console.log('-------- 上传成功 --------');
			console.log(data);
			console.log('field: ' + field);
			console.log('key: ' + key);
		},
		uploadFail(status, field, key){
			console.log('-------- 上传失败 --------');
			console.log(status);
			console.log('field: ' + field);
			console.log('key: ' + key);
		}
	}
});

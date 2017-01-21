import 'babel-polyfill';
import myUpload from '../upload-2.vue';

const Vue = window.Vue;

new Vue({
	el: '#app',
	data: {
		show1: false,
		show2: false,
		avatarUrl1: null,
		avatarUrl2: null,
		otherParams: {
			token: '123456798',
			name: 'img'
		},
		headers: {
			smail: '*_~'
		}
	},
	components: {
		'my-upload': myUpload
	},
	methods: {
		toggleShow1() {
			let {show1} = this;
			this.show1 = !show1;
		},
		toggleShow2() {
			let {show2} = this;
			this.show2 = !show2;
		},
		cropSuccess(data, field, key) {
			if (field == 'avatar1') {
				this.avatarUrl1 = data;
			} else {
				this.avatarUrl2 = data;
			}
		},
		cropUploadSuccess(data, field, key) {
			console.log('-------- 上传成功 --------');
			console.log(data);
			console.log('field: ' + field);
			console.log('key: ' + key);
		},
		cropUploadFail(status, field, key) {
			console.log('-------- 上传失败 --------');
			console.log(status);
			console.log('field: ' + field);
			console.log('key: ' + key);
		}
	}
});

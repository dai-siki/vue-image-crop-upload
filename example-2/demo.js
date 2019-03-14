import 'babel-polyfill';
import myUpload from '../upload-2.vue';

const Vue = window.Vue;

new Vue({
	el: '#app',
	data: {
		showRemote:false,
		show1: false,
		show2: false,
		show3: false,
		avatarUrl1: null,
		avatarUrl2: null,
		avatarUrl3: null,
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
		toggleShowRemote() {
			this.$refs.uploaddd.cropRemoteImg('http://imgs.idsome.com/5a4d06eeb22e3810b4000048large_jpg.jpg');
			let {showRemote} = this;
			this.showRemote = !showRemote;
		},
		toggleShow1() {
			let {show1} = this;
			this.show1 = !show1;
		},
		toggleShow2() {
			let {show2} = this;
			this.show2 = !show2;
		},
		toggleShow3() {
			let {show3} = this;
			this.show3 = !show3;
		},
		cropSuccess(data, field, key) {
			if (field == 'avatar1') {
				this.avatarUrl1 = data;
			} else if(field == 'avatar2') {
				this.avatarUrl2 = data;
			} else {
				this.avatarUrl3 = data;
			}
			console.log('-------- 剪裁成功 --------');
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

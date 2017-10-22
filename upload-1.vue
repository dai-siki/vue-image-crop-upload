<template>
<div class="vue-image-crop-upload" v-show="value">
    <div class="vicp-wrap">
        <div class="vicp-close" @click="off">
            <i class="vicp-icon4"></i>
        </div>

        <div class="vicp-step1" v-show="step == 1">
            <div class="vicp-drop-area"
				@dragleave="preventDefault"
				@dragover="preventDefault"
				@dragenter="preventDefault"
				@click="handleClick"
				@drop="handleChange">
                <i class="vicp-icon1" v-show="loading != 1">
					<i class="vicp-icon1-arrow"></i>
	                <i class="vicp-icon1-body"></i>
	                <i class="vicp-icon1-bottom"></i>
                </i>
                <span class="vicp-hint" v-show="loading !== 1">{{ lang.hint }}</span>
                <span class="vicp-no-supported-hint" v-show="!isSupported">{{ lang.noSupported }}</span>
                <input type="file" v-show="false" v-if="step == 1" @change="handleChange" v-el:fileinput>
            </div>
            <div class="vicp-error" v-show="hasError">
                <i class="vicp-icon2"></i> {{ errorMsg }}
            </div>
            <div class="vicp-operate">
                <a @click="off" @mousedown="ripple">{{ lang.btn.off }}</a>
            </div>
        </div>

        <div class="vicp-step2" v-if="step == 2">
            <div class="vicp-crop">
                <div class="vicp-crop-left">
                    <div class="vicp-img-container">
                        <img :src="sourceImgUrl"
							:style="sourceImgStyle"
							class="vicp-img"
							draggable="false"
                            @drag="preventDefault"
                            @dragstart="preventDefault"
                            @dragend="preventDefault"
                            @dragleave="preventDefault"
                            @dragover="preventDefault"
                            @dragenter="preventDefault"
                            @drop="preventDefault"
                            @touchstart="imgStartMove"
                            @touchmove="imgMove"
                            @touchend="createImg"
                            @touchcancel="createImg"
                            @mousedown="imgStartMove"
							@mousemove="imgMove"
							@mouseup="createImg"
							@mouseout="createImg"
							v-el:img>
                        <div class="vicp-img-shade vicp-img-shade-1" :style="sourceImgShadeStyle"></div>
                        <div class="vicp-img-shade vicp-img-shade-2" :style="sourceImgShadeStyle"></div>
                    </div>

                    <div class="vicp-range">
                        <input type="range" :value="scale.range" step="1" min="0" max="100" @input="zoomChange">
                        <i @mousedown="startZoomSub" @mouseout="endZoomSub" @mouseup="endZoomSub" class="vicp-icon5"></i>
                        <i @mousedown="startZoomAdd" @mouseout="endZoomAdd" @mouseup="endZoomAdd" class="vicp-icon6"></i>
                    </div>

					<div class="vicp-rotate" v-if="!noRotate">
						<i @mousedown="startRotateLeft" @mouseout="endRotate" @mouseup="endRotate">↺</i>
						<i @mousedown="startRotateRight" @mouseout="endRotate" @mouseup="endRotate">↻</i>
					</div>
                </div>
                <div class="vicp-crop-right">
                    <div class="vicp-preview">
						<div class="vicp-preview-item" v-if="!noSquare">
							<img :src="createImgUrl" :style="previewStyle">
							<span>{{ lang.preview }}</span>
						</div>
						<div class="vicp-preview-item vicp-preview-item-circle" v-if="!noCircle">
							<img :src="createImgUrl" :style="previewStyle">
							<span>{{ lang.preview }}</span>
						</div>
                    </div>
                </div>
            </div>
            <div class="vicp-operate">
                <a @click="setStep(1)" @mousedown="ripple">{{ lang.btn.back }}</a>
                <a class="vicp-operate-btn" @click="prepareUpload" @mousedown="ripple">{{ lang.btn.save }}</a>
            </div>
        </div>

        <div class="vicp-step3" v-if="step == 3">
            <div class="vicp-upload">
                <span class="vicp-loading" v-show="loading === 1">{{ lang.loading }}</span>
                <div class="vicp-progress-wrap">
                    <span class="vicp-progress" v-show="loading === 1" :style="progressStyle"></span>
                </div>
                <div class="vicp-error" v-show="hasError">
                    <i class="vicp-icon2"></i> {{ errorMsg }}
                </div>
                <div class="vicp-success" v-show="loading === 2">
                    <i class="vicp-icon3"></i> {{ lang.success }}
                </div>
            </div>
            <div class="vicp-operate">
                <a @click="setStep(2)" @mousedown="ripple">{{ lang.btn.back }}</a>
                <a @click="off" @mousedown="ripple">{{ lang.btn.close }}</a>
            </div>
        </div>
        <canvas v-show="false" :width="width" :height="height" v-el:canvas></canvas>
    </div>
</div>
</template>

<script>
'use strict';
import language from './utils/language.js';
import mimes from './utils/mimes.js';
import data2blob from './utils/data2blob.js';
import effectRipple from './utils/effectRipple.js';

export default {
    props: {
        // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
        field: {
            type: String,
            'default': 'avatar'
        },
        // 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
        ki: {
            'default': 0
        },
        // 显示该控件与否
        value: {
            twoWay: true,
            'default': true
        },
        // 上传地址
        url: {
            type: String,
            'default': ''
        },
        // 其他要上传文件附带的数据，对象格式
        params: {
            type: Object,
            'default': null
        },
		//Add custom headers
        headers: {
            type: Object,
            'default': null
        },
        // 剪裁图片的宽
        width: {
            type: Number,
            default: 200
        },
        // 剪裁图片的高
        height: {
            type: Number,
            default: 200
        },
		// 不显示旋转功能
		noRotate: {
			type: Boolean,
			default: true
		},
		// 不预览圆形图片
		noCircle: {
			type: Boolean,
			default: false
		},
		// 不预览方形图片
		noSquare: {
			type: Boolean,
			default: false
		},
        // 单文件大小限制
        maxSize: {
            type: Number,
            'default': 10240
        },
        // 语言类型
        langType: {
            type: String,
            'default': 'zh'
        },
        // 语言包
        langExt: {
            type: Object,
            'default': null
        },
        // 图片上传格式
        imgFormat: {
            type: String,
            'default': 'png'
        }
    },
    data() {
        let that = this,
            {
                imgFormat,
                langType,
                langExt,
                width,
                height
            } = that,
            isSupported = true,
            allowImgFormat = [
                'jpg',
                'png'
            ],
            tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat,
            lang = language[langType] ? language[langType] : language['en'],
            mime = mimes[tempImgFormat];
        // 规范图片格式
        that.imgFormat = tempImgFormat;

        if (langExt) {
            Object.assign(lang, langExt);
        }
        if (typeof FormData != 'function') {
            isSupported = false;
        }
        return {
            // 图片的mime
            mime,

            // 语言包
            lang,

            // 浏览器是否支持该控件
            isSupported,
            // 浏览器是否支持触屏事件
            isSupportTouch: document.hasOwnProperty("ontouchstart"),

            // 步骤
            step: 1, //1选择文件 2剪裁 3上传

            // 上传状态及进度
            loading: 0, //0未开始 1正在 2成功 3错误
            progress: 0,

            // 是否有错误及错误信息
            hasError: false,
            errorMsg: '',

            // 需求图宽高比
            ratio: width / height,

            // 原图地址、生成图片地址
            sourceImg: null,
            sourceImgUrl: '',
            createImgUrl: '',

            // 原图片拖动事件初始值
            sourceImgMouseDown: {
                on: false,
                mX: 0, //鼠标按下的坐标
                mY: 0,
                x: 0, //scale原图坐标
                y: 0
            },

            // 生成图片预览的容器大小
            previewContainer: {
                width: 100,
                height: 100
            },

            // 原图容器宽高
            sourceImgContainer: { // sic
                width: 240,
                height: 180
            },

            // 原图展示属性
            scale: {
                zoomAddOn: false, //按钮缩放事件开启
                zoomSubOn: false, //按钮缩放事件开启
                range: 1, //最大100

				rotateLeft: false,//按钮向左旋转事件开启
                rotateRight: false,//按钮向右旋转事件开启
				degree: 0, // 旋转度数

                x: 0,
                y: 0,
                width: 0,
                height: 0,
                maxWidth: 0,
                maxHeight: 0,
                minWidth: 0, //最宽
                minHeight: 0,
                naturalWidth: 0, //原宽
                naturalHeight: 0
            }
        }
    },
    computed: {
        // 进度条样式
        progressStyle() {
            let {
                progress
            } = this;
            return {
                width: progress + '%'
            }
        },
        // 原图样式
        sourceImgStyle() {
            let {
                scale,
                sourceImgMasking
            } = this;
            return {
                top: scale.y + sourceImgMasking.y + 'px',
                left: scale.x + sourceImgMasking.x + 'px',
                width: scale.width + 'px',
                height: scale.height + 'px',
				transform: 'rotate(' + scale.degree + 'deg)',// 旋转时 左侧原始图旋转样式
				'-ms-transform': 'rotate(' + scale.degree + 'deg)', // 兼容IE9
				'-moz-transform': 'rotate(' + scale.degree + 'deg)', // 兼容FireFox
				'-webkit-transform': 'rotate(' + scale.degree + 'deg)',// 兼容Safari 和 chrome
				'-o-transform': 'rotate(' + scale.degree + 'deg)',// 兼容 Opera
            }
        },
        // 原图蒙版属性
        sourceImgMasking() {
            let {
                width,
                height,
                ratio,
                sourceImgContainer
            } = this,
            sic = sourceImgContainer,
                sicRatio = sic.width / sic.height, // 原图容器宽高比
                x = 0,
                y = 0,
                w = sic.width,
                h = sic.height,
                scale = 1;
            if (ratio < sicRatio) {
                scale = sic.height / height;
                w = sic.height * ratio;
                x = (sic.width - w) / 2;
            }
            if (ratio > sicRatio) {
                scale = sic.width / width;
                h = sic.width / ratio;
                y = (sic.height - h) / 2;
            }
            return {
                scale, // 蒙版相对需求宽高的缩放
                x,
                y,
                width: w,
                height: h
            };
        },
        // 原图遮罩样式
        sourceImgShadeStyle() {
            let {
                sourceImgMasking,
                sourceImgContainer
            } = this,
            sic = sourceImgContainer,
                sim = sourceImgMasking,
                w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2,
                h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2;
            return {
                width: w + 'px',
                height: h + 'px'
            };
        },
        previewStyle() {
            let {
                width,
                height,
                ratio,
                previewContainer
            } = this,
            pc = previewContainer,
                w = pc.width,
                h = pc.height,
                pcRatio = w / h;
            if (ratio < pcRatio) {
                w = pc.height * ratio;
            }
            if (ratio > pcRatio) {
                h = pc.width / ratio;
            }
            return {
                width: w + 'px',
                height: h + 'px'
            };
        }
    },
    watch: {
        value(newValue) {
            if (newValue && this.loading != 1) {
                this.reset();
            }
        }
    },
    methods: {
        // 点击波纹效果
        ripple(e) {
            effectRipple(e);
        },
        // 关闭控件
        off() {
            let that = this;
            setTimeout(function() {
                that.value = false;
                if(that.step == 3 && that.loading == 2){
                    that.setStep(1);
                }
            }, 200);
        },
        // 设置步骤
        setStep(no) {
            let that = this;
            setTimeout(function() {
                that.step = no;
            }, 200);
        },

        /* 图片选择区域函数绑定
         ---------------------------------------------------------------*/
        preventDefault(e) {
            e.preventDefault();
			return false;
        },
        handleClick(e) {
            if (this.loading !== 1) {
                if (e.target !== this.$els.fileinput) {
                    e.preventDefault();
                    if (document.activeElement !== this.$els) {
                        this.$els.fileinput.click();
                    }
                }
            }
        },
        handleChange(e) {
            e.preventDefault();
            if (this.loading !== 1) {
                let files = e.target.files || e.dataTransfer.files;
                this.reset();
                if (this.checkFile(files[0])) {
                    this.setSourceImg(files[0]);
                }
            }
        },
        /* ---------------------------------------------------------------*/

        // 检测选择的文件是否合适
        checkFile(file) {
            let that = this,
                {
                    lang,
                    maxSize
                } = that;
            // 仅限图片
            if (file.type.indexOf('image') === -1) {
                that.hasError = true;
                that.errorMsg = lang.error.onlyImg;
                return false;
            }

            // 超出大小
            if (file.size / 1024 > maxSize) {
                that.hasError = true;
                that.errorMsg = lang.error.outOfSize + maxSize + 'kb';
                return false;
            }
            return true;
        },
        // 重置控件
        reset() {
            this.loading = 0;
            this.progress = 0;
            this.hasError = false;
            this.errorMsg = '';
        },
        // 设置图片源
        setSourceImg(file) {
            let that = this,
                fr = new FileReader();
            fr.onload = function(e) {
                that.sourceImgUrl = fr.result;
                that.startCrop();
            }
            fr.readAsDataURL(file);
        },
        // 剪裁前准备工作
        startCrop() {
            let that = this,
                {
                    width,
                    height,
                    ratio,
                    scale,
                    sourceImgUrl,
                    sourceImgMasking,
                    lang
                } = that,
                sim = sourceImgMasking,
                img = new Image();
            img.src = sourceImgUrl;
            img.onload = function() {
                let nWidth = img.naturalWidth,
                    nHeight = img.naturalHeight,
                    nRatio = nWidth / nHeight,
                    w = sim.width,
                    h = sim.height,
                    x = 0,
                    y = 0;
                // 图片像素不达标
                if (nWidth < width || nHeight < height) {
                    that.hasError = true;
                    that.errorMsg = lang.error.lowestPx + width + '*' + height;
                    return false;
                }
                if (ratio > nRatio) {
                    h = w / nRatio;
                    y = (sim.height - h) / 2;
                }
                if (ratio < nRatio) {
                    w = h * nRatio;
                    x = (sim.width - w) / 2;
                }
                scale.range = 0;
                scale.x = x;
                scale.y = y;
                scale.width = w;
                scale.height = h;
                scale.degree = 0;
                scale.minWidth = w;
                scale.minHeight = h;
                scale.maxWidth = nWidth * sim.scale;
                scale.maxHeight = nHeight * sim.scale;
                scale.naturalWidth = nWidth;
                scale.naturalHeight = nHeight;
                that.sourceImg = img;
                that.createImg();
                that.setStep(2);
            };
        },
        // 鼠标按下图片准备移动
        imgStartMove(e) {
            e.preventDefault();
            // 支持触摸事件，则鼠标事件无效
            if(this.isSupportTouch && !e.targetTouches){
                return false;
            }
            let et = e.targetTouches ? e.targetTouches[0] : e,
                {
                    sourceImgMouseDown,
                    scale
                } = this,
                simd = sourceImgMouseDown;
            simd.mX = et.screenX;
            simd.mY = et.screenY;
            simd.x = scale.x;
            simd.y = scale.y;
            simd.on = true;
        },
        // 鼠标按下状态下移动，图片移动
        imgMove(e) {
            e.preventDefault();
            // 支持触摸事件，则鼠标事件无效
            if(this.isSupportTouch && !e.targetTouches){
                return false;
            }
            let et = e.targetTouches ? e.targetTouches[0] : e,
                {
                    sourceImgMouseDown: {
                        on,
                        mX,
                        mY,
                        x,
                        y
                    },
                    scale,
                    sourceImgMasking
                } = this,
                sim = sourceImgMasking,
                nX = et.screenX,
                nY = et.screenY,
                dX = nX - mX,
                dY = nY - mY,
                rX = x + dX,
                rY = y + dY;
            if (!on) return;
            if (rX > 0) {
                rX = 0;
            }
            if (rY > 0) {
                rY = 0;
            }
            if (rX < sim.width - scale.width) {
                rX = sim.width - scale.width;
            }
            if (rY < sim.height - scale.height) {
                rY = sim.height - scale.height;
            }
            scale.x = rX;
            scale.y = rY;
        },
		// 按钮按下开始向右旋转
		startRotateRight(e) {
		   let that = this,
			   {
				   scale
			   } = that;
		   scale.rotateRight = true;
		   function rotate() {
			   if (scale.rotateRight) {
				   let degree = ++scale.degree;
				   that.createImg(degree);
				   setTimeout(function () {
					   rotate();
				   }, 60);
			   }
		   }
		   rotate();
		},
		// 按钮按下开始向右旋转
		startRotateLeft(e) {
		   let that = this,
			   {
				   scale
			   } = that;
		   scale.rotateLeft = true;
		   function rotate() {
			   if (scale.rotateLeft) {
				   let degree = --scale.degree;
				   that.createImg(degree);
				   setTimeout(function () {
					   rotate();
				   }, 60);
			   }
		   }
		   rotate();
		},
		// 停止旋转
		endRotate() {
		   let {
			   scale
		   } = this;
		   scale.rotateLeft = false;
		   scale.rotateRight = false;
		},
        // 按钮按下开始放大
        startZoomAdd(e) {
            let that = this,
                {
                    scale
                } = that;
            scale.zoomAddOn = true;

            function zoom() {
                if (scale.zoomAddOn) {
                    let range = scale.range >= 100 ? 100 : ++scale.range;
                    that.zoomImg(range);
                    setTimeout(function() {
                        zoom();
                    }, 60);
                }
            }
            zoom();
        },
        // 按钮松开或移开取消放大
        endZoomAdd(e) {
            this.scale.zoomAddOn = false;
        },
        // 按钮按下开始缩小
        startZoomSub(e) {
            let that = this,
                {
                    scale
                } = that;
            scale.zoomSubOn = true;

            function zoom() {
                if (scale.zoomSubOn) {
                    let range = scale.range <= 0 ? 0 : --scale.range;
                    that.zoomImg(range);
                    setTimeout(function() {
                        zoom();
                    }, 60);
                }
            }
            zoom();
        },
        // 按钮松开或移开取消缩小
        endZoomSub(e) {
            let {
                scale
            } = this;
            scale.zoomSubOn = false;
        },
        zoomChange(e) {
            this.zoomImg(e.target.value);
        },
        // 缩放原图
        zoomImg(newRange) {
            let that = this,
                {
                    sourceImgMasking,
                    sourceImgMouseDown,
                    scale
                } = this,
                {
                    maxWidth,
                    maxHeight,
                    minWidth,
                    minHeight,
                    width,
                    height,
                    x,
                    y,
                    range
                } = scale,
                sim = sourceImgMasking,
                // 蒙版宽高
                sWidth = sim.width,
                sHeight = sim.height,
                // 新宽高
                nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
                nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
                // 新坐标（根据蒙版中心点缩放）
                nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x),
                nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);

            // 判断新坐标是否超过蒙版限制
            if (nX > 0) {
                nX = 0;
            }
            if (nY > 0) {
                nY = 0;
            }
            if (nX < sWidth - nWidth) {
                nX = sWidth - nWidth;
            }
            if (nY < sHeight - nHeight) {
                nY = sHeight - nHeight;
            }

            // 赋值处理
            scale.x = nX;
            scale.y = nY;
            scale.width = nWidth;
            scale.height = nHeight;
            scale.range = newRange;
            setTimeout(function() {
                if (scale.range == newRange) {
                    that.createImg();
                }
            }, 300);
        },
        // 生成需求图片
        createImg(e) {
            let that = this,
                {
                    mime,
                    sourceImg,
                    scale: {
                        x,
                        y,
                        width,
                        height,
                        degree,
                    },
                    sourceImgMasking: {
                        scale
                    }
                } = that,
                canvas = that.$els.canvas,
                ctx = canvas.getContext('2d');
            if (e) {
                // 取消鼠标按下移动状态
                that.sourceImgMouseDown.on = false;
			}
            canvas.width = that.height;
            canvas.height = that.width;
            ctx.clearRect(0, 0, that.width, that.height);

            // 将透明区域设置为白色底边
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, that.width, that.height);

            ctx.translate(that.width * 0.5, that.height * 0.5);
            ctx.rotate(Math.PI * degree / 180);
            ctx.translate(-that.height * 0.5, -that.width * 0.5);

            ctx.drawImage(sourceImg, x / scale, y / scale, width / scale, height / scale);
            that.createImgUrl = canvas.toDataURL(mime);
        },
        // 预备上传
        prepareUpload(){
            let {
                url,
                createImgUrl,
                field,
                ki
            } = this;
            this.$dispatch('cropSuccess', createImgUrl, field, ki);
            if(typeof url == 'string' && url){
                this.upload();
            }else{
                this.off();
            }
        },
        // 上传图片
        upload() {
            let that = this,
                {
                    lang,
                    imgFormat,
                    mime,
                    url,
                    params,
                    field,
                    ki,
                    createImgUrl
                } = this,
                fmData = new FormData();
            fmData.append(field, data2blob(createImgUrl, mime), field + '.' + imgFormat);

            // 添加其他参数
            if (typeof params == 'object' && params) {
                Object.keys(params).forEach((k) => {
                    fmData.append(k, params[k]);
                })
            }

            // 监听进度回调
            const uploadProgress = function(event) {
                if (event.lengthComputable) {
                    that.progress = 100 * Math.round(event.loaded) / event.total;
                }
            };

            // 上传文件
            that.reset();
            that.loading = 1;
            that.setStep(3);
            new Promise(function(resolve, reject) {
                let client = new XMLHttpRequest();
                client.open('POST', url, true);
                client.onreadystatechange = function() {
                    if (this.readyState !== 4) {
                        return;
                    }
                    if (this.status === 200 || this.status === 201) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(this.status);
                    }
                };
                client.upload.addEventListener("progress", uploadProgress, false); //监听进度\
				// 设置header
	            if (typeof headers == 'object' && headers) {
	                Object.keys(headers).forEach((k) => {
	                    client.setRequestHeader(k, headers[k]);
	                })
	            }
                client.send(fmData);
            }).then(
                // 上传成功
                function(resData) {
                    if (that.value) {
                        that.loading = 2;
                        that.$dispatch('cropUploadSuccess', resData, field, ki);
                    }

                },
                // 上传失败
                function(sts) {
                    if (that.value) {
                        that.loading = 3;
                        that.hasError = true;
                        that.errorMsg = lang.fail;
                        that.$dispatch('cropUploadFail', sts, field, ki);
                    }
                }
            );
        }
    },
    created(){
        // 绑定按键esc隐藏此插件事件
        document.addEventListener('keyup', (e)=>{
            if(this.value && (e.key == 'Escape' || e.keyCode == 27)){
                this.off();
            }
        })
    }
}

</script>

<style lang='sass' src="./scss/upload.scss">
</style>

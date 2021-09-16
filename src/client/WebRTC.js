/**
 * 封装的一个 「web rtc」类 📦 
 */
export default class WebRTC {
    constructor(videos, canvas) {

        this.constraints = { video: true };
        this.bools = this.isWebRTC();
        this.video = videos;
     
        this.canvas = canvas;
   
        this.ctx = this.canvas.getContext('2d');
        this.localMediaStream = null;
       
    }
    opneClient() {
        this.video.addEventListener('click', this.snapshot(this.video), false);
        this.WebRTC = navigator.getUserMedia(this.constraints, function(stream){
           console.log('video: ' + stream);
            this.video.src = window.URL.createObjectURL(stream);
            this.localMediaStream = stream;
        }, this.onError)
    }
    snapshot() {
        if (this.localMediaStream) {
            this.ctx.drawImage(video, 0, 0);
            // “image/webp”对Chrome有效，
            // 其他浏览器自动降为image/png
            document.querySelector('img').src = canvas.toDataURL('image/webp');
        }
    }
    //判断当前浏览器是否支持 web rtc
    isWebRTC() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        if (navigator.userMedia) {
            return true;
        } else {
            return false;
        }
    }
    onSuccess(stream) {
        console.log(this.video);
        this.video.src = window.URL.createObjectURL(stream);
        this.localMediaStream = stream;
    }

    onError() {
        console.log("获取系统资源失败")
    }
}


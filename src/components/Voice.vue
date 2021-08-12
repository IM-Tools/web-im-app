<template>
    <div class="picture-card-voice" @click="btn">
        <svg t="1628750111466" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2110" width="20" height="20">
            <path d="M636.16512 957.44l-70.80448-70.8096c107.59168-92.06272 176.03072-228.58752 176.03072-381.31712 0-145.49504-62.2848-276.1216-161.1776-367.77472L651.19232 66.56c117.01248 109.82912 190.51008 265.47712 190.51008 438.60992 0 180.44416-79.77984 341.90848-205.53728 452.27008z" fill="#333333" p-id="2111"></path>
            <path d="M445.08672 766.35648l-72.93952-72.92928c66.28352-36.64384 111.19104-107.16672 111.19104-188.25728 0-73.61536-37.04832-138.5216-93.47072-177.29024l71.62368-71.61344C535.72096 313.97376 583.68 403.88096 583.68 505.16992c0 108.65664-54.95808 204.44672-138.59328 261.18656zM253.96736 591.18592c-39.5776 0-71.66976-32.08192-71.66976-71.67488 0-39.59808 32.08704-71.67488 71.66976-71.67488 39.60832 0 71.68 32.0768 71.68 71.67488 0 39.59296-32.07168 71.67488-71.68 71.67488z" fill="#333333" p-id="2112"></path>
        </svg>
    </div>
    <el-dialog title="麦克风🎤" v-model="dialogVisible" width="30%" :before-close="handleClose">
        <span>开始录音</span>
        <template #footer>
            <!-- <el-icon :size="40">
                <Download />
            </el-icon> -->
            <el-icon :color="colorNmae"  @click="mousedownVoice" :size="40">
                <Mic />
            </el-icon>
            <!-- <el-icon :size="40">
                <RemoveFilled />
            </el-icon> -->
            <el-icon @click="mouseupVoice" :size="40">
                <Promotion />
            </el-icon>
        </template>
    </el-dialog>
</template>
<script>
import Cookies from 'js-cookie';
import { Mic, RemoveFilled, Download, Promotion } from '@element-plus/icons';
import Recorder from 'js-audio-recorder';
import axios from 'axios';
export default {
    name: 'Voice',
    components: { RemoveFilled, Mic, Download, Promotion },
    data() {
        return {
            recorderObj: null,
            dialogVisible: false,
            classLoading:'',
            colorNmae:''
        };
    },
    created() {
        this.init();
    },
    methods: {
        btn() {
            this.dialogVisible = true;
        },
        init() {
            if (this.recorderObj == null) {
                this.recorderObj = new Recorder();
            }
        },
        mousedownVoice() {
            this.colorNmae="#409EFC"
            this.recorderObj.start();
        },
        mouseupVoice() {
            this.colorNmae=""
            
            this.recorderObj.stop();
            let wavb = this.recorderObj.getWAVBlob();
            console.log(wavb);
            var formData = new FormData();
            var time = new Date();
            var timestamp = Date.parse(time);
            formData.append('voice', wavb, timestamp + '.wav');
            this.changefile(formData)
            //service
            // axios(import.meta.env.VITE_APP_BASE_API + '/UploadVoiceFile', formData, {
            //     //设置请求头
            //     methods: 'POST',
            //     headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime(), Authorization: 'Bearer ' + Cookies.get('token') },
            // }).then(response => {
            //     console.log(response);
            // });
            //this.downVoice();

            // this.$confirm('确定发送该语音吗', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            // })
            //     .then(({ value }) => {
            //         this.$notify.success('语音发送成功');
            //     })
            //     .catch(() => {
            //         this.isShow = false;
            //         this.$notify.error('语音发送失败');
            //     });
        },
        changefile(formData) {
            var configs = {
                 headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime(), Authorization: 'Bearer ' + Cookies.get('token') },
            };
            let url =import.meta.env.VITE_APP_BASE_API+"/UploadVoiceFile"
            axios.post(url, formData, configs).then((res) => {
               const {data} =res
                if(data.code==200){
                    this.$emit('sendVoiceMsg',data.data.url)
                }else{

                }
                this.dialogVisible=false
            });
        },
        downVoice() {
            //获取下载文件
            this.recorderObj.downloadWAV();
            console.log('下载');
        },
    },
};
</script>
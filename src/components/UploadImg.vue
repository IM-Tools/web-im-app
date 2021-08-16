  <template>
    <meta http-equiv="Access-Control-Allow-Origin" content="*" />
    <el-upload action="api/UploadImg" :on-success="success" :headers="header" :show-file-list="isShow" list-type="picture-card" name="Smfile" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
        <svg t="1628600786899" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2024" width="20" height="20">
            <path d="M831.5 864 192 864c-53 0-96-43.1-96-96L96 128.1c0-53 43.1-96 96-96L832 32.1c53 0 96 43.1 96 96l-0.1 639.5C927.9 820.8 884.7 864 831.5 864zM192 96c-17.7 0-32 14.4-32 32L160 768c0 17.7 14.4 32 32 32l639.5 0c17.9 0 32.4-14.5 32.4-32.4l0.1-639.5c0-17.7-14.4-32-32-32L192 96.1z" p-id="2025"></path>
            <path d="M128 672c-8.2 0-16.4-3.1-22.6-9.4-12.5-12.5-12.5-32.8 0-45.3L264.8 458c29.2-29.2 73.7-36.5 110.7-18l173.6 86.8c12.3 6.2 27.1 3.8 36.8-6l287.4-287.4c12.5-12.5 32.8-12.5 45.3 0 12.5 12.5 12.5 32.8 0 45.3L631.2 566.1c-29.2 29.2-73.7 36.5-110.7 18l-173.6-86.8c-12.3-6.2-27.1-3.8-36.8 6L150.6 662.6C144.4 668.9 136.2 672 128 672z" p-id="2026"></path>
            <path d="M384 352c-52.9 0-96-43.1-96-96s43.1-96 96-96 96 43.1 96 96S436.9 352 384 352zM384 224c-17.6 0-32 14.4-32 32s14.4 32 32 32 32-14.4 32-32S401.6 224 384 224z" p-id="2027"></path>
        </svg>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
export default {
    name: 'UploadImg',
    computed: mapState({
        smToken: state => state.user.smToken,
    }),
    data() {
        return {
            file: [],
            isShow: true,
            header:{Authorization:'Bearer ' + Cookies.get('token')}
        };
    },
    props: {
        dialogImageUrl: {
            type: String,
            default: '',
        },
    },
    methods: {
        success(response, file, fileList) {
            const { data, Success } = response;
            if (Success) {
                this.$confirm('确定发送该图片吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                })
                    .then(({ value }) => {
                        this.$emit('sendImgMsg', data.url);
                        this.isShow = false;
                        this.$notify.success('图片发送成功');
                    })
                    .catch(() => {
                        this.isShow = false;
                        this.$notify.error('消息发送失败');
                    });
            } else {
                this.$notify.error('图片上传失败');
            }
        },
        handleRemove(file, fileList) {
          
        },
        handlePictureCardPreview(file) {
           
            //this.dialogImageUrl = file.url;
            //this.dialogVisible = true;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>
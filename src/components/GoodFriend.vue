<template>
    <el-dialog title="提示" v-model="GoodFriendDialogVisible" width="50%"  @close="$emit('update:GoodFriendDialogVisible', false)"
      center >
        <span>这是一段信息</span>
        <template #footer>
          
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'GoodFriend',
    data() {
        return {
            GoodFriendDialogVisible:false
        };
    },
    props:{
        GoodFriendDialogVisible:{
            type:Boolean,
            default:false
        }
    },
    created(){
        console.log(this.GoodFriendDialogVisible)
    },
    methods: {
      handleFriendDialogClose(done) {
         done();
      }
    }
};
</script>
<template>
    <el-dialog :lock-scroll="false" :modal="false" v-model="CircleVisible" @close="$emit('update:CircleVisible', false)" :close-delay="1000">
        我的圈子
    </el-dialog>
</template>
<script>
export default {
    name:"CircleFiends",
    data(){
        return{

        }
    },
    props:{
        CircleVisible:{
            type:Boolean,
            default:false
        }
    },
    created(){

    },
    methods:{
          handleFriendDialogClose(done) {
          this.multipleSelection=[];
            done();
        }
    }
}
</script>
<template>
    <el-main class="fa-main-users" style="color: #fff">
        <el-main>
            <div class="fa-users" v-for="list in goodslist" :key="list.id" @click="selectUser(list)">
                <div class="img-list">
                    <i v-if="list.msg_total" class="web-wechat-message">{{ list.msg_total }}</i>
                    <img :class="list.status == 0 ? 'offline-img' : ''" :src="list.avatar" />
                </div>
                <span>{{ list.name }}</span>
                <p class="p-msg">{{ list.send_msg }}</p>
                <span class="msg-time">{{ list.send_time }}</span>
            </div>
        </el-main>
    </el-main>
</template>
<script>
export default {
    name: 'UserGroup',
    data(){
        return {
            isActive:false
        }
    },
    props: {
        goodslist: {
            type: Array,
            default: [],
        },
        forUser: {
            type: Array,
            default: [],
        },
    },
    methods: {
        selectUser(user) {
            this.isActive=
            this.$emit('setUser', user);
        },
    },
};
</script>
<style lang="scss" scoped>
.el-main {
    padding: 0px;
}
.fa-users {
    position: relative;
    padding: 10px;
    display: flex;
    height: 64px;
    align-items: center;
    justify-content: flex-start;
    .img-list {
        display: inline-block;
        position: relative;
    }
    .p-msg {
        font-size: 13px;
        color: #989898;
        position: absolute;
        left: 60px;
        bottom: 8px;
        width: 150px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span {
        font-size: 12px;
        padding-left: 10px;
    }
    .msg-time {
        display: block;
        position: absolute;
        left: 190px;
    }
}
.fa-users:hover {
    background-color: #454b55;
}
.fa-user-select{
    background-color: #454b55;
}
.fa-main-users {
    padding: 10px;
}
</style>
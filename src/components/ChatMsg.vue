<template>
<!-- 用户单聊信息展示 -->
    <el-main id="msgDiv" width="" class="app-msg">
        <span v-if="!toUser" style="font-size: 12px"><i class="el-icon-chat-dot-round"></i>请选择聊天</span>
        <div v-else :key="list.id" v-for="list in msgList">
            <i v-if="list.time_status" style="font-size: 10px">{{ renderTime(list.created_at) }}</i>
            <p v-if="list.status==1" class="msg-content-left">
                <img class="img-left" :src="selectUser.avatar" />
                <span v-if="list.msg_type == 1">
                    <!-- <p v-html="list.msg"></p> -->
                    {{list.msg}}&nbsp;&nbsp;&nbsp;&nbsp;<i style="font-size:8px">{{list.created_at}}</i>
                </span>
                <a :href="list.msg" target="_blank"><img v-if="list.msg_type == 2" :src="list.msg" class="im-gif" /></a>
                <span v-if="list.msg_type == 3">
                    <p v-html="list.msg"></p>
                </span>
                <audio class="audio-left" v-if="list.msg_type == 4" controls>
                    <source :src="list.msg" type="audio/mpeg" />
                </audio>
            </p>
            <p v-else class="msg-content-right">
                <span v-if="list.msg_type == 1">
                    <!-- <p v-html="list.msg"></p> -->
                        {{list.msg}}&nbsp;&nbsp;&nbsp;&nbsp;<i style="font-size:8px">{{list.created_at}}</i>
                </span>
                <a :href="list.msg" target="_blank"><img v-if="list.msg_type == 2" :src="list.msg" class="im-gif" /></a>
                <span v-if="list.msg_type == 3">
                    <p v-html="list.msg"></p>
                </span>
                <audio class="audio-right" v-if="list.msg_type == 4" controls>
                    <source :src="list.msg" type="audio/mpeg" />
                </audio>
                <img class="img-right" :src="users.avatar" />
            </p>
        </div>
    </el-main>
</template>
<script>
export default {
    name: 'ChatMsg',
    data() {
        return {};
    },
    props: {
        msgList: {
            type: Array,
            default: [],
        },
        toUser: {
            type: Boolean,
            default: false,
        },
        selectUser: {
            type: Array,
            default: [],
        },
        users: {
            type: Array,
            default: [],
        },
    },
};
</script>
<style lang="scss" scoped>
.audio-right,
.audio-left {
    padding: 10px;
}

.app-msg {
    background-color: rgb(236 235 235);
    height: 80%;
    padding: 10px;
    .im-gif {
        max-height: 300px;
        max-width: 300px;
        box-shadow: 0 0px 0px 0 #a3b4bf;
        img {
            height: 100%;
            width: 100%;
        }
    }
    .msg-content-left {
        padding: 5px 0px 5px 0px;
        align-items: center;
        display: flex;
        justify-content: left;
        .im-gif {
            max-height: 300px;
            max-width: 300px;
            height: 100%;
            width: 100%;
            box-shadow: 0 0px 0px 0 #a3b4bf;
            padding: 10px;
        }
        .img-left {
            width: 40px;
            height: 40px;
            box-shadow: 0 1px 10px 0 #a3b4bf;
        }
        span {
            max-width: 70%;
            border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            list-style: none;
            text-align: left;
            font-size: 14px;
            background: #fff;
            text-align: left;
            margin: 5px 0 0 0;
            display: inline-block;
            padding: 8px 10px;
            margin-top: 0;
            word-break: break-all;
            margin-left: 15px;
        }
        span::before {
            top: 11px;
            right: 100%;
            left: 44px;
            display: block;
            float: left;
            width: 0;
            height: 0;
            pointer-events: none;
            content: ' ';
            border-color: transparent;
            border-style: solid solid outset;
            border-width: 8px;
            border-right-color: #fff;
            margin-left: -26px;
        }
    }
    .msg-content-right {
        padding: 5px 0px 5px 0px;
        justify-content: flex-end;
        display: flex;
        align-items: center;
        .im-gif {
            max-height: 300px;
            max-width: 300px;
            height: 100%;
            width: 100%;
            box-shadow: 0 0px 0px 0 #a3b4bf;
            padding: 10px;
        }
        .img-right {
            width: 40px;
            height: 40px;
            box-shadow: 0 1px 10px 0 #a3b4bf;
        }
        span {
            max-width: 70%;
            border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            list-style: none;
            text-align: left;
            font-size: 14px;
            background: #b2e281;
            text-align: left;
            margin: 5px 0 0 0;
            display: inline-block;
            padding: 8px 10px;
            margin-top: 0;
            word-break: break-all;
            margin-right: 10px;
        }
        span::before {
            top: 11px;
            display: block;
            float: right;
            width: 0;
            height: 0;
            pointer-events: none;
            content: ' ';
            border-color: transparent;
            border-style: solid solid outset;
            border-width: 8px;
            border-left-color: #b2e281;
            margin-right: -25px;
        }
    }
}
</style>
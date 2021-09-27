<template>
    <el-container class="im-container">
        <el-aside style="transition: width 0.5s" :class="isMenu == true ? 'left-header-according' : 'left-header-hidden'">
            <el-header class="im-user-header">
                <img class="users-img" :src="users.avatar" />
                <span style="color: #fff; margin-left: 10px; font-size: 18px">{{ users.name }}</span>
                <el-dropdown>
                    <i class="el-icon-s-unfold" style="margin-left: 15px; font-size: 20px"></i>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item><i class="el-icon-user"></i>个人信息</el-dropdown-item>
                            <el-dropdown-item @click="ChumAddVisible = true"><i class="el-icon-search"></i>添加好友</el-dropdown-item>
                            <el-dropdown-item @click="GoodFriendDialogVisible = true"><i class="el-icon-plus"></i>创建群聊</el-dropdown-item>
                            <el-dropdown-item @click="logout"><i class="el-icon-unlock"></i>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <i class="el-icon-refresh-left" style="margin-left: 15px; font-size: 20px; color: #fff" @click="refreshUser"></i>
            </el-header>
            <el-header class="im-user-header">
                <el-input prefix-icon="el-icon-search" @mouseleave="searchGoods" class="from-search" placeholder="搜索" v-model="searchValue" size="small"> </el-input>
            </el-header>
            <el-header class="im-user-icon">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="grid-content bg-purple" v-bind:class="{ is_guttered_class: isSelect == 1 }" @click="this.isSelect = 1">
                            <i class="el-icon-user-solid" style="font-size: 20px; color: #fff"></i>
                        </div>
                    </el-col>
                    <el-col :span="12"
                        ><div class="grid-content bg-purple-light" v-bind:class="{ is_guttered_class: isSelect == 2 }" @click="this.isSelect = 2">
                            <i class="el-icon-chat-square" style="font-size: 20px; color: #fff"></i></div
                    ></el-col>
                </el-row>
            </el-header>
            <UserGroup v-if="isSelect == 1" @setUser="selectUserAction" :forUser="forUser" :goodslist="goodslist"></UserGroup>
            <ChatGroup v-if="isSelect == 2" @setUser="selectGroupAction" :forUser="forUser" :grouplist="grouplist"></ChatGroup>
        </el-aside>
        <el-container>
            <el-header class="im-msg-header" v-if="isSelect == 1">
                {{ selectUser.name ? selectUser.name : '未选择好友' }}
            </el-header>
            <el-header class="im-msg-header" v-if="isSelect == 2">
                {{ selectGroupMsg.group_name ? selectGroupMsg.group_name : '未选择群组' }}
                <i v-if="isShowGroupUser == 1" @click="showGroupUser" class="el-icon-caret-bottom"></i>
                <i v-if="isShowGroupUser == 2" @click="showGroupUser" class="el-icon-caret-top"></i>
            </el-header>
            <el-collapse-transition>
                <!-- ---selectUser--- -->
                <div v-show="isShowGroupUser == 2" class="show-users group-show-user animate__animated animate__ffadeInDown">
                    <i class="el-icon-plus"></i>
                    <p class="nickname"></p>
                </div>
                <div class="group-user">
                    <i class="el-icon-minus"></i>
                    <p class="nickname"></p>
                </div>
                <div v-for="(value, key) in selectUser.users" class="group-user" :key="key">
                    <img :src="value.avatar" />
                    <p class="nickname">{{ value.remark }}</p>
                </div>
            </el-collapse-transition>
            <el-main class="img-msg-main">
                <div v-if="isMenu == false" class="el-backtop" @click="leftMenu">
                    <i @click="showGroupUser" class="el-icon-caret-left"></i>
                </div>
                <!-- 聊天内容展示 -->
                <ChatMsg v-if="isSelect == 1" :msgList="msgData" :toUser="toUser" :selectUser="selectUser" :users="users"></ChatMsg>
                <ChatGroupMsg v-if="isSelect == 2" :msgList="groupMsgData" :toGroup="toGroup" :selectGroupMsg="selectGroupMsg" :users="users"></ChatGroupMsg>
                <!-- 信息发送处 -->
                <el-footer class="app-msg-footer" v-if="selectUser.id">
                    <UploadImg @sendImgMsg="sendImgMsg" :dialogImageUrl="dialogImageUrl"></UploadImg>
                    <Voice @sendVoiceMsg="sendVoiceMsg"></Voice>
                    <discord-picker input :value="value" @keyup.enter="sendMsg" @update:value="value = $event" @emoji="setEmoji" :placeholder="placeholder" />
                </el-footer>
            </el-main>
        </el-container>
        <GoodFriend @setChatGroup="setChatGroup" :GoodFriendDialogVisible="GoodFriendDialogVisible" :before-close="handleFriendDialogClose"></GoodFriend>
        <CircleFiends :CircleVisible="CircleVisible" :before-close="handleFriendDialogClose"></CircleFiends>
        <Friend :ChumAddVisible="ChumAddVisible" :GoodFriendDialogVisible="GoodFriendDialogVisible" :before-close="handleFriendDialogClose"></Friend>
    </el-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DiscordPicker from 'vue3-discordpicker';
import Cookies from 'js-cookie';
import ChatMsg from '../components/ChatMsg.vue';
import ChatGroupMsg from '../components/ChatGroupMsg.vue';
//
import UserGroup from '../components/UserGroup.vue';
import GoodFriend from '../components/GoodFriend.vue';
import CircleFiends from '../components/CircleFiends.vue';
import UploadImg from '../components/UploadImg.vue';
import ChatGroup from '../components/ChatGroup.vue';
import Friend from '../components/Friend.vue';
import Voice from '../components/Voice.vue';
import moment from '../utils/moment';
import { judgeData, DataBindA } from '../utils/utils';
moment.locale('zh-cn');
export default {
    components: { DiscordPicker, GoodFriend, CircleFiends, ChatMsg, UserGroup, UploadImg, Voice, ChatGroup, ChatGroupMsg, Friend },
    data() {
        return {
            ChumAddVisible: false,
            isShowGroupUser: 1,
            activeNames: ['1'],
            // 选中的时群聊还是用户  1：用户 2：群聊
            isSelect: 1,
            chatBool: false,
            dialogImageUrl: '',
            dialogVisibleImg: false,
            // 发送的信息类型
            msg_type: 1,
            gifKey: import.meta.env.VITE_APP_GIF_KEY,
            isMenu: true,
            GoodFriendDialogVisible: false,
            CircleVisible: false,
            timeout: 60000, //60ms
            timeoutObj: null,
            placeholder: '开始聊天～',
            ws: import.meta.env.VITE_APP_WS,
            md: '',
            socket: null,
            form: {
                comments: ''
            },
            forUser: [],
            searchValue: '',
            text: '',
            value: '',
            dialog: false,
            // 用户聊天信息
            selectUser: [],
            toUser: false,
            // 用户群聊信息
            selectGroupMsg: [],
            toGroup: false,
            //
            userList: [],
            msgForm: {
                from_id: '',
                msg: '',
                status: 0,
                to_id: '',
                msg_type: 1, //1 文本消息 2 图片
                channel_type: 1
            }
        };
    },
    computed: mapState({
        users: state => state.auth.users,
        auth: state => state.auth.auth,
        goodslist: state => state.user.goodslist,
        msgData: state => state.user.msgData,
        groupMsgData: state => state.user.groupMsgData,
        grouplist: state => state.user.grouplist
    }),
    created() {
        this.init();
        this.onGetgoodlist();
        this.onGetGroupList();
        this.userList = this.goodslist;
    },
    methods: {
        setChatGroup() {
            this.GoodFriendDialogVisible = false;
            this.onGetGroupList();
        },
        showGroupUser() {
            if (this.isShowGroupUser == 1) {
                this.isShowGroupUser = 2;
            } else {
                this.isShowGroupUser = 1;
            }
        },
        ...mapActions('user', ['onGetgoodlist', 'onGetMsgList', 'onReadMessage', 'onGetGroupList']),
        // ...mapActions('group', ['onGetGroupList']),

        selectGroup(index) {
            //  this.isShowGroupUser = index;
            this.isSelect = index;
        },
        // 选择用户聊天事件
        selectUserAction(data) {
            console.log(data);
            // 保存聊天用户
            this.selectUser = data;
            // 是否选择了聊天对象
            this.toUser = true;
            // 判断当前聊天状态时群聊还是单独聊天
            if (Number(this.isSelect) == 1) {
                this.$store.commit('user/clearMsg', { id: data.id });
                this.getUserMsgList({ to_id: data.id, channel_type: Number(this.isSelect) });
            } else {
                this.$store.commit('user/clearGroupMsg', { id: data.id });
                this.getUserMsgList({ to_id: data.id, channel_type: Number(this.isSelect) });
            }

            this.onReadMessage({ to_id: data.id });
            if (window.innerWidth < 815) {
                this.isMenu = false;
            }
            setTimeout(() => {
                var ele = document.getElementById('msgDiv');
                ele.scrollTop = ele.scrollHeight;
            }, 500);
        },
        // 选择群聊事件
        selectGroupAction(data) {
            console.log(123);
            // 保存当前群聊对象
            this.selectGroupMsg = data;
            // 是否选择了群聊对象
            this.toGroup = true;
            // 判断当前聊天状态时群聊还是单独聊天
            if (Number(this.isSelect) == 1) {
                this.$store.commit('user/clearMsg', { id: data.id });
                this.getGroupMsgList({ to_id: data.id, channel_type: Number(this.isSelect) });
            } else {
                this.$store.commit('user/clearGroupMsg', { id: data.id });
                this.getGroupMsgList({ to_id: data.id, channel_type: Number(this.isSelect) });
            }
            this.onReadMessage({ to_id: data.id });
            if (window.innerWidth < 815) {
                this.isMenu = false;
            }
            setTimeout(() => {
                var ele = document.getElementById('msgDiv');
                ele.scrollTop = ele.scrollHeight;
            }, 500);
        },
        searchGoods() {
            if (this.searchValue == '' || this.searchValue == undefined) {
                this.userList = this.goodslist;
                return;
            }
            let newList = this.userList.filter(value => {
                if (value.name.search(this.searchValue) != -1) {
                    return value;
                }
            });
            this.userList = newList;
        },
        refreshUser() {
            if (this.isSelect == 1) {
                this.onGetgoodlist();
                this.$notify({
                    title: '提醒',
                    message: '刷新好友列表成功',
                    type: 'success'
                });
            } else {
                this.onGetGroupList();
                this.$notify({
                    title: '提醒',
                    message: '刷新群聊列表成功',
                    type: 'success'
                });
            }
        },
        leftMenu() {
            this.isMenu = true;
        },
        renderTime(date) {
            var time = new Date(date);
            time = time.getTime(time);
            time = parseInt(time);
            const nowStr = new Date();
            const localStr = time ? new Date(time) : nowStr;
            const localMoment = moment(localStr);
            const localFormat = localMoment.fromNow();
            return localFormat;
        },

        logout() {
            this.$store.dispatch('auth/logoutUser');
            this.socket.close();
        },
        reset: function() {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function() {
            this.timeoutObj = setTimeout(() => {
                this.socket.send('HeartBeat');
            }, this.timeout);
        },
        // 获取用户聊天信息列表
        getUserMsgList(params) {
            if (this.toUser) {
                this.onGetMsgList(params);
            }
        },
        // 获取群聊信息列表
        getGroupMsgList(params) {
            if (this.toGroup) {
                this.onGetMsgList(params);
            }
        },
        sendImgMsg(url) {
            this.msg_type = 2;
            this.value = url;
            this.sendMsg();
        },
        //发送视频
        sendVoiceMsg(url) {
            this.msg_type = 4;
            this.value = url;

            this.sendMsg();
        },
        sendMsg() {
            if ((!this.toUser && this.isSelect == 1) || (!this.toGroup && this.isSelect == 2)) {
                this.$notify({
                    title: '提醒',
                    message: '未选择聊天对象',
                    type: 'error'
                });
                return;
            }
            if (this.value == '') {
                this.$notify({
                    title: '提醒',
                    message: '不能发送空消息～',
                    type: 'error'
                });
                return;
            }
            if (this.socket == null) {
                this.$notify({
                    title: '提醒',
                    message: '网络断开链接',
                    type: 'error'
                });
                return;
            }
            if (this.msg_type == 2 || this.msg_type == 4) {
                this.msgForm = Object.assign(
                    {},
                    {
                        status: 0,
                        from_id: this.users.id,
                        msg: this.value,
                        to_id: this.isSelect == 1 ? this.selectUser.id : this.selectGroupMsg.id,
                        msg_type: this.msg_type,
                        channel_type: Number(this.isSelect),
                        status: 0
                    }
                );
                this.msg_type = 1;
            } else {
                this.msgForm = Object.assign(
                    {},
                    {
                        status: 0,
                        from_id: this.users.id,
                        msg: DataBindA(this.value),
                        to_id: this.isSelect == 1 ? this.selectUser.id : this.selectGroupMsg.id,
                        msg_type: judgeData(this.value),
                        channel_type: Number(this.isSelect)
                    }
                );
            }

            this.value = '';
            try {
                this.socket.send('HeartBeat');
                this.send(this.msgForm);
            } catch (error) {
                this.$notify.error('网络连接已经断开');
                return;
            }
            if (this.msgForm.channel_type == 1) {
                //this.$store.commit('user/setMsg', this.msgForm);
            } else {
            }

            this.msg_type = 1;
            setTimeout(() => {
                var ele = document.getElementById('msgDiv');
                ele.scrollTop = ele.scrollHeight;
            }, 500);
        },
        setGif(value) {
            this.msg_type = 2;
            this.value = value;
        },
        init: function() {
            if (typeof WebSocket === 'undefined') {
                this.$notify({
                    title: '提醒',
                    message: '您的浏览器不支持socket',
                    type: 'error'
                });
            } else {
                // 实例化socket
                try {
                    if (Cookies.get('token') == undefined || Cookies.get('token') == '') {
                        this.logout();
                        return;
                    }
                    this.socket = new WebSocket(this.ws + '?token=' + Cookies.get('token'));
                    // 监听socket连接
                    this.socket.onopen = this.open;
                    // 监听socket错误信息
                    this.socket.onerror = this.error;
                    // 监听socket消息
                    this.socket.onmessage = this.getMessage;

                    this.socket.onopen = this.onopen;
                } catch (error) {
                    this.$notify({
                        title: 'error',
                        message: '客户端链接失败',
                        type: 'error'
                    });
                }
            }
        },
        onmessage(event) {
            this.reset();
        },
        onopen: function() {
            this.reset();
        },
        open: function(msg) {
            console.log(msg);
        },
        error: function() {
            this.socket = null;
            this.$notify.error('连接异常请检查网络');
        },
        getMessage: function(msg) {
            console.log(msg);
            let data = JSON.parse(msg.data);
            const { code } = data;
            //监听消息 以及操作逻辑
            switch (code) {
                case 401:
                    this.$notify.error('禁止发送敏感词!');
                    break;
                case 1000:
                    if (data.id != user.id) {
                        this.$store.commit('user/setOnline', data);
                    }
                    break;
                case 200:
                    //拿到相关数据
                    if (data.channel_type == 1) {
                        this.$store.commit('user/setMsg', { msg: data.msg, from_id: data.from_id, to_id: data.to_id, status: data.status, msg_type: data.msg_type });
                    } else {
                        if (this.users.id == data.from_id) {
                            this.$store.commit('user/setGroupMsg', { msg: data.msg, from_id: data.from_id, to_id: data.to_id, msg_type: data.msg_type, status: 0, users: [] });
                        } else {
                            this.$store.commit('user/setGroupMsg', { msg: data.msg, from_id: data.from_id, to_id: data.to_id, msg_type: data.msg_type, status: 1, users: [] });
                        }
                    }
                    break;
                case 5000:
                    this.$store.commit('user/setOffline', data);
                    break;
            }
        },
        send: function(params = {}) {
            this.socket.send(JSON.stringify(params));
        },
        close: function() {
            console.log('断开');
            //this.reset()
        },
        handleFriendDialogClose(done) {
            this.GoodFriendDialogVisible = false;
            this.CircleVisible = false;
            this.CircleVisible = false;
            done();
        }
    }
};
</script>

<style lang="scss" scoped>
.bg-grey-400 {
    background-color: #ecebeb;
}
.el-main {
    padding: 0px;
}

.online-status {
    /* display: flex; */
    height: 7px;
    width: 7px;
    border-radius: 90%;
    background-color: rgb(33, 185, 120) !important;
    /* float: left; */
    margin-left: 3px;
}
.web-wechat-message {
    position: absolute;
    background-color: #e62e2e;
    cursor: pointer;
    top: -6px;
    right: -6px;
    font-style: normal;
    border-radius: 30%;
    height: 15px;
    width: 25px;
    line-height: 15px;

    text-align: center;
    color: #fff;
    font-size: 12px;
}
.offline-img {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
}
.offline-status {
    background-color: gray !important;
    height: 7px;
    width: 7px;
    border-radius: 90%;
    margin-left: 3px;
}

.im-container {
    margin: 0 auto;
    width: 60%;
    height: 90%;
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

        // img {
        //     width: 40px;
        //     height: 40px;
        //     border-radius: 3px;
        // }
        .p-msg {
            font-size: 13px;
            color: #989898;
            /* display: none; */
            position: absolute;
            /* right: 2px; */
            left: 60px;
            /* word-wrap: break-word; */
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
    .fa-main-users {
        padding: 10px;
    }
    //   border: 1px solid rgb(122, 118, 118);
    .im-user-header {
        display: flex;
        align-items: center;
        line-height: 70px;
        justify-content: flex-start;
        text-align: right;
        font-size: 12px;
        background-color: #2e3238;
    }
    .group-show-user {
        background-color: #ecebeb;
        .group-user {
            width: 67px;
            height: 75px;
            float: left;
            padding: 6px;
            margin: 5px;
        }
        .nickname {
            color: #888;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            font-size: 12px;
            margin-left: -8px;
            vertical-align: middle;
        }
        img {
            width: 55px;
            height: 55px;
            margin-right: 0.25em;
        }
        i {
            font-size: 55px;
            align-items: center;
            width: 55px;
            height: 55px;
            margin-right: 0.25em;
            border: 1px dashed #9c9a9a;
        }
    }
    .im-msg-header {
        height: 40px;
        border-bottom: 1px solid #d6d6d6;
        display: flex;
        text-align: center;
        font-size: 12px;
        justify-content: center;
        align-items: center;
    }
    .im-user-icon {
        background-color: hsl(216, 10%, 20%);
        font-size: 12px;
        line-height: 40px;
        i {
            border: 1px solid #2e3238;
        }
    }
    .img-msg-main {
        background-color: rgb(236 235 235);
        border: none;
    }
}

@media (min-width: 1445px) {
    .im-container {
        width: 70%;
        height: 90%;
    }
}

@media (max-width: 1440px) {
    .im-container {
        width: 80%;
    }
}
@media (max-width: 1400px) {
    .im-container {
        width: 80%;
        height: 90%;
    }
}

@media (max-width: 1000px) {
    .im-container {
        width: 100%;
        height: 100%;
    }
}

@media (max-height: 750px) {
    .im-container {
        height: 100%;
    }
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

        // img {
        //     box-shadow: 0 1px 10px 0 #a3b4bf;
        //     height: 40px;
        //     width: 40px;
        // }
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
        // img {
        //     box-shadow: 0 1px 10px 0 #a3b4bf;
        //     height: 40px;
        //     width: 40px;
        // }
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
            //   left: 200px;
            //   right: 440px;
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
.el-footer {
    padding: 0px 0px;
    box-sizing: border-box;
    flex-shrink: 0;
}
.app-msg-footer {
    margin-top: 20px;
    position: relative;
}
.users-img {
    width: 40px;
    height: 40px;
    text-align: center;
    align-items: center;
}
.el-aside {
    background-color: #0000;
}
.el-header {
    background-color: #eee;
}
.common-layout {
    background-color: aqua;
}
.el-aside {
    background-color: #2e3238;
    // border: 1px solid #000;
}
</style>

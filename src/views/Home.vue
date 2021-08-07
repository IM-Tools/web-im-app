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
                            <el-dropdown-item @click="dialog = true"><i class="el-icon-search"></i>好友搜索</el-dropdown-item>
                            <el-dropdown-item @click="GoodFriendDialogVisible = true"><i class="el-icon-plus"></i>创建群聊</el-dropdown-item>
                            <el-dropdown-item @click="CircleVisible = true"><i class="el-icon-bangzhu"></i>我的圈子</el-dropdown-item>
                            <el-dropdown-item @click="logout"><i class="el-icon-unlock"></i>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <i class="el-icon-refresh-left" style="margin-left: 15px; font-size: 20px; color: #fff" @click="refreshUser"></i>
            </el-header>
            <el-header class="im-user-header">
                <el-input prefix-icon="el-icon-search" @mouseleave="searchGoods" class="from-search" placeholder="搜索" v-model="searchValue" size="small"> </el-input>
            </el-header>
            <el-main class="fa-main-users" style="color: #fff">
                <el-main>
                    <div class="fa-users" v-for="list in goodslist" :key="list.id" @click="setUser(list)">
                        <div class="img-list">
                            <!-- 提示消息数量 -->
                            <i v-if="list.msg_total" class="web-wechat-message">{{ list.msg_total }}</i>
                            <img :class="list.status == 0 ? 'offline-img' : ''" :src="list.avatar" />
                        </div>

                        <span>{{ list.name }}</span>
                        <!-- 消息内容 -->
                        <p class="p-msg">{{ list.send_msg }}</p>
                        <span class="msg-time">{{ list.send_time }}</span>
                        <!-- <span style="color:red">....</span> -->
                    </div>
                </el-main>
            </el-main>
        </el-aside>
        <el-container>
            <el-header class="im-msg-header">
                {{ selectUser.name ? selectUser.name : '未选择好友' }}
            </el-header>
            <el-main class="img-msg-main">
                <div v-if="isMenu == false" class="el-backtop" @click="leftMenu">
                    <i class="el-icon-caret-left"></i>
                </div>
                <el-main id="msgDiv" width="" class="app-msg">
                    <span v-if="!toUser" style="font-size: 12px"><i class="el-icon-chat-dot-round"></i>请选择聊天</span>
                    <div v-else :key="list.id" v-for="list in msgData">
                        <i v-if="list.time_status" style="font-size: 10px">{{ renderTime(list.created_at) }}</i>
                        <p v-if="list.status" class="msg-content-left">
                            <img class="img-left" :src="selectUser.avatar" />
                            <span v-if="list.msg_type == 1">{{ list.msg }}</span>
                            <span v-if="list.msg_type == 2">
                                <div class="im-gif">
                                    <img :src="list.msg" />
                                </div>
                            </span>
                        </p>
                        <p v-else class="msg-content-right">
                            <span v-if="list.msg_type == 1">{{ list.msg }}</span>
                            <span v-if="list.msg_type == 2">
                                <div class="im-gif">
                                    <img :src="list.msg" />
                                </div>
                            </span>
                            <img class="img-right" :src="users.avatar" />
                        </p>
                    </div>
                </el-main>
                <el-footer class="app-msg-footer">
                    <discord-picker :key="gifKey" input :value="value" @keyup.enter="sendMsg" @update:value="value = $event" @emoji="setEmoji" :placeholder="placeholder" @gif="setGif" />
                </el-footer>
            </el-main>
        </el-container>
        <GoodFriend :GoodFriendDialogVisible="GoodFriendDialogVisible" :before-close="handleFriendDialogClose"></GoodFriend>
        <CircleFiends :CircleVisible="CircleVisible" :before-close="handleFriendDialogClose"></CircleFiends>
    </el-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DiscordPicker from 'vue3-discordpicker';
import Cookies from 'js-cookie';
import GoodFriend from '../components/GoodFriend.vue';
import CircleFiends from '../components/CircleFiends.vue';
import moment from '../utils/moment';
moment.locale('zh-cn');
export default {
    components: { DiscordPicker, GoodFriend, CircleFiends },
    data() {
        return {
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
            socket:null,
            form: {
                comments: '',
            },
            searchValue: '',
            text: '',
            value: '',
            dialog: false,
            selectUser: [],
            toUser: false,
            userList: [],
            msgForm: {
                from_id: '',
                msg: '',
                status: 0,
                to_id: '',
                msg_type: 1, //1 文本消息 2 图片
            },
        };
    },
    computed: mapState({
        users: state => state.auth.users,
        auth: state => state.auth.auth,
        goodslist: state => state.user.goodslist,
        msgData: state => state.user.msgData,
    }),
    created() {
        this.init();
        this.onGetgoodlist();
        this.userList = this.goodslist;
    },
    methods: {
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
            this.onGetgoodlist();
            this.$notify({
                title: '提醒',
                message: '刷新好友列表成功',
                type: 'success',
            });
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
            // const localFormat = localMoment.format("MM-DD hh:mm A");
            const localFormat = localMoment.fromNow();
            return localFormat;
        },
        ...mapActions('user', ['onGetgoodlist', 'onGetMsgList', 'onReadMessage']),
        logout() {
            this.$store.dispatch('auth/logoutUser');
            this.socket.close();
        },
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            this.timeoutObj = setTimeout(() => {
                this.socket.send('HeartBeat');
            }, this.timeout);
        },
        getMsgList(params) {
            if (this.toUser) {
                this.onGetMsgList(params);
            }
        },
        setUser(user) {
            this.selectUser = user;
            this.toUser = true;
            this.$store.commit('user/clearMsg', { id: user.id });
            this.getMsgList({ to_id: user.id });
            this.onReadMessage({ to_id: user.id });
            if (window.innerWidth < 815) {
                this.isMenu = false;
            }
            setTimeout(() => {
                var ele = document.getElementById('msgDiv');
                ele.scrollTop = ele.scrollHeight;
            }, 500);
        },

        sendMsg() {
            if (!this.toUser) {
                this.$notify({
                    title: '提醒',
                    message: '未选择聊天对象',
                    type: 'error',
                });
                return;
            }
            if (this.value == '') {
                this.$notify({
                    title: '提醒',
                    message: '不能发送空消息～',
                    type: 'error',
                });
                return;
            }
            if (this.socket == null) {
                this.$notify({
                    title: '提醒',
                    message: '网络断开链接',
                    type: 'error',
                });
                return;
            }


        
            this.msgForm=Object.assign({},{
                from_id:this.users.id,
                msg:this.value,
                to_id:this.selectUser.id,
                msg_type:this.msg_type,
            });
            this.value = '';
             this.socket.send('HeartBeat');
            this.send(this.msgForm);
            this.$store.commit('user/setMsg', this.msgForm);
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
        init: function () {
            console.log(this.ws);
            if (typeof WebSocket === 'undefined') {
                this.$notify({
                    title: '提醒',
                    message: '您的浏览器不支持socket',
                    type: 'error',
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
                    console.log(error)
                    this.$notify({
                        title: 'error',
                        message: '客户端链接失败',
                        type: 'error',
                    });
                }
            }
        },
        onmessage(event) {
            this.reset();
            this.start();
        },
        onopen: function () {
            this.reset();
            this.start();
        },
        open: function (msg) {
            console.log(msg);
        },
        error: function () {
            this.socket = null
            this.$notify.error('连接异常请检查网络')
        },
        getMessage: function (msg) {
            let data = JSON.parse(msg.data);
            const { code } = data;
            //监听消息 以及操作逻辑
            switch (code) {
                case 1000:
                    this.$store.commit('user/setOnline', data);
                    break;
                case 200:
                    //拿到相关数据
                    this.$store.commit('user/setMsg', { msg: data.msg, from_id: data.from_id, to_id: data.to_id, status: 1,msg_type:data.msg_type });
                    break;
                case 5000:
                    this.$store.commit('user/setOffline', data);
                    break;
                    
            }
        },
        send: function (params = {}) {
          this.socket.send(JSON.stringify(params));
        },
        close: function () {
            console.log('socket已经关闭');
        },
        handleFriendDialogClose(done) {
            this.GoodFriendDialogVisible = false;
            this.CircleVisible = false;
            done();
        },
    },
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
    .im-msg-header {
        border-bottom: 1px solid #d6d6d6;
        display: flex;
        text-align: center;
        font-size: 12px;
        justify-content: center;
        align-items: center;
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
        height: 108px;
        width: 189px;
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
            height: 108px;
            width: 189px;
            box-shadow: 0 0px 0px 0 #a3b4bf;
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

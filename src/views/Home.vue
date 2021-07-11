<template>
    <el-container class="im-container">
        <el-aside width="280px">
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
                            <el-dropdown-item @click="logout"><i class="el-icon-unlock"></i>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main class="fa-main-users" style="color: #fff">
                <el-main>
                    <div class="fa-users" v-for="list in goodslist" :key="list.id" @click="setUser(list)">
                        <div class="img-list">
                            <!-- 提示消息数量 -->
                            <i v-if="list.msg_total" class="web-wechat-message">{{ list.msg_total }}</i>
                            <img :class="list.status == 0 ? 'offline-img' :'' " :src="list.avatar" />
                        </div>
                        <i></i>
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
                <el-main id="msgDiv" width="" class="app-msg">
                    <span v-if="!toUser" style="font-size: 12px">请选择聊天</span>
                    <div v-else :key="list.id" v-for="list in msgData">
                        <p v-if="list.status" class="msg-content-left">
                            <img class="img-left" :src="selectUser.avatar" />
                            <span>{{ list.msg }}</span>
                        </p>
                        <p v-else class="msg-content-right">
                            <span>{{ list.msg }}</span>
                            <img class="img-right" :src="users.avatar" />
                        </p>
                    </div>
                </el-main>
                <el-footer class="app-msg-footer">
                    <discord-picker input :value="value" @keyup.enter="sendMsg" gif-format="md" @update:value="value = $event" @emoji="setEmoji" :placeholder="placeholder" @gif="setGif" />
                </el-footer>
            </el-main>
        </el-container>
        <!-- <el-dialog title="搜索好友🔍" v-model="dialog">
      <el-form :model="form" label-width="100px">
        <el-form-item label="搜索好友"  >
          <el-input  v-model="form.name" autocomplete="off"></el-input>
         
        </el-form-item>
      </el-form>
          <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="名称" width="100">
          </el-table-column>
           <el-table-column prop="avatar" label="头像" width="100">
               <template #default="scope"> <img style="height:30px;width:30px" :src="scope.row.avatar"></template>
          </el-table-column>
          <el-table-column prop="address" label="状态">
            <template #default="scope">
           <i v-if="scope.row.status">在线</i>
            <i v-else>离线</i>
          </el-table-column>
          <el-table-column prop="name" label="操作">
   <el-button type="primary" size="mini" icon="el-icon-plus"></el-button>
          </el-table-column>
        </el-table>
    </el-dialog> -->
<GoodFriend :GoodFriendDialogVisible="GoodFriendDialogVisible"  :before-close="handleFriendDialogClose"></GoodFriend>
    </el-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DiscordPicker from 'vue3-discordpicker';
import Cookies from 'js-cookie';
import GoodFriend from '../components/GoodFriend.vue'
export default {
    components: { DiscordPicker,GoodFriend },
    data() {
        return {
            GoodFriendDialogVisible:false,
            timeout: 60000, //60ms
            timeoutObj: null,
            placeholder: '开始聊天～',
            tableData: [
                {
                    name: 'Summer',
                    avatar: 'https://cdn.learnku.com/uploads/avatars/32858_1624608687.jpeg!/both/100x100',
                    status: true,
                },
                {
                    name: 'MArtian',
                    avatar: 'https://cdn.learnku.com/uploads/avatars/56030_1591034461.png!/both/100x100',
                    status: false,
                },
                {
                    name: '小黑猫',
                    avatar: 'https://cdn.learnku.com/uploads/avatars/1_1530614766.png!/both/100x100',
                    status: true,
                },
            ],
            ws: import.meta.env.VITE_APP_WS,
            socket: '',
            form: {
                comments: '',
            },
            text: '',
            value: '',
            dialog: false,
            selectUser: [],
            toUser: false,
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
    },
    methods: {
        ...mapActions('user', ['onGetgoodlist', 'onGetMsgList']),
        logout() {
            this.$store.dispatch('auth/logoutUser');
            this.socket.close();
        },
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            this.timeoutObj = setTimeout(()=>{
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
            if (this.socket == '') {
                this.$notify({
                    title: '提醒',
                    message: '网络断开链接',
                    type: 'error',
                });
                return;
            }
            var data = {
                from_id: this.users.id,
                msg: this.value,
                status: 0,
                to_id: this.selectUser.id,
            }
            this.send(data);
            this.$store.commit('user/setMsg',data);
            this.value = '';
            setTimeout(() => {
                var ele = document.getElementById('msgDiv');
                ele.scrollTop = ele.scrollHeight;
            }, 500);
        },
        init: function () {
            console.log(this.ws)
            if (typeof WebSocket === 'undefined') {
                this.$notify({
                    title: '提醒',
                    message: '您的浏览器不支持socket',
                    type: 'error',
                });
            } else {
                // 实例化socket
                try {
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
            console.log('连接错误');
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
                    this.$store.commit('user/setMsg', {msg: data.msg,from_id: data.from_id,to_id: data.to_id,status:1});
                    break;
                case 5000:
                    this.$store.commit('user/setOffline', data);
                    break;
            }
        },
        send: function (params={}) {
            this.socket.send(JSON.stringify(params));
        },
        close: function () {
            console.log('socket已经关闭');
        },
        handleFriendDialogClose(done){
            this.GoodFriendDialogVisible=false
            done()
        }
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
        img {
            width: 40px;
            height: 40px;
            border-radius: 3px;
        }
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
        margin-top: 30px;
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

    .msg-content-left {
        padding: 5px 0px 5px 0px;
        align-items: center;
        display: flex;
        justify-content: left;
        img {
            box-shadow: 0 1px 10px 0 #a3b4bf;
            height: 40px;
            width: 40px;
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
        img {
            box-shadow: 0 1px 10px 0 #a3b4bf;
            height: 40px;
            width: 40px;
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

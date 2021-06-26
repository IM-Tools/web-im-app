<template>
  <el-container class="im-container">
    <el-aside width="200px">
      <el-header class="im-user-header">
        <img class="users-img" :src="users.avatar" />
        <span style="color: #fff">{{ users.name }}</span>
        <el-dropdown>
          <i class="el-icon-menu" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>👤个人信息</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-footer></el-footer>
    </el-aside>
    <el-container>
      <el-header class="im-msg-header">
        {{ users.name }}
      </el-header>
      <el-main>
        <el-main id="msgDiv" width="" class="app-msg">
          <div :key="list.id" v-for="list in msgData">
            <p v-if="list.left" class="msg-content-left">
              <img class="img-left" :src="users.avatar" />
              <span>{{ list.msg }}</span>
            </p>
            <p class="msg-content-right">
              <span>{{ list.msg }}</span>
              <img class="img-right" :src="users.avatar" />
            </p>
          </div>
        </el-main>
        <el-footer class="app-msg-footer">
          <discord-picker
            input
            :value="value"
            @keyup.enter="sendMsg"
            gif-format="md"
            @update:value="value = $event"
            @emoji="setEmoji"
            @gif="setGif"
          />
        </el-footer>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapState } from "vuex";
import DiscordPicker from "vue3-discordpicker";
import Cookies from "js-cookie";

export default {
  components: { DiscordPicker },
  data() {
    return {
      ws: "ws://127.0.0.1:9502/serve/ws-con",
      socket: "",
      form: {
        comments: "",
      },
      text: "",
      value: "",
      msgData: [
        {
          user_id: 2,
          msg: "第一条",
          left: true,
        },
      ],
    };
  },
  computed: {
    ...mapState(["auth", "users"]),
  },
  created() {
    this.init();
  },
  methods: {
    sendMsg() {
      this.send({
        user_id: 11,
        msg: this.value,
      });
      this.msgData.push({
        msg: this.value,
        user_id: 2,
        left: true,
      });
      console.log(this.msgData);
      setTimeout(() => {
        var ele = document.getElementById("msgDiv");
        ele.scrollTop = ele.scrollHeight;
      }, 500);
    },
    init: function () {
      if (typeof WebSocket === "undefined") {
        this.$notify({
          title: "提醒",
          message: "您的浏览器不支持socket",
          type: "error",
        });
      } else {
        // 实例化socket
        try {
          console.log(this.ws);
          this.socket = new WebSocket(
            this.ws + "?token=" + Cookies.get("token")
          );
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;
        } catch (error) {
          this.$notify({
            title: "error",
            message: "socket链接失败",
            type: "error",
          });
        }
      }
    },
    open: function () {
      console.log("socket连接成功");
    },
    error: function () {
      console.log("连接错误");
    },

    getMessage: function (msg) {
      alert(222);
      console.log(msg);
    },

    // getMessage: function (msg) {
    //     console.log(msg)
    // //   this.msgData.push({
    // //       msg:msg.data,
    // //       user_id:2,
    // //       left:true
    // //   });
    // //      console.log(this.msg.data);
    // //   console.log(this.msgData);
    // },
    send: function (params = { user_id: 1, msg: "" }) {
      this.socket.send(JSON.stringify(params));
    },
    close: function () {
      console.log("socket已经关闭");
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close;
    },
    setEmoji(emoji) {
      console.log(emoji);
    },
    setGif(gif) {
      console.log(gif);
    },
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("logoutUser");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 750px) {
  .im-container {
    width: 100%;
    height: 900px;
  }
}
.im-container {
  margin: 0 auto;
  width: 60%;
  height: 800px;
  //   border: 1px solid rgb(122, 118, 118);
  .im-user-header {
    display: flex;
    align-items: center;
    line-height: 70px;
    justify-content: flex-end;
    text-align: right;
    font-size: 12px;
    background-color: #2e3238;
  }
  .im-msg-header {
    display: flex;
    text-align: center;
    font-size: 12px;
    justify-content: center;
    align-items: center;
  }
}

.el-main {
  background-color: #fff;
  border: none;
}
.app-msg {
  background-color: #fff;
  height: 550px;

  .msg-content-left {
    padding: 5px 0px 5px 0px;
    align-items: center;
    display: flex;
    justify-content: left;
    img {
      box-shadow: 0 1px 10px 0 #a3b4bf;
      height: 25px;
      width: 25px;
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
      min-width: 100px;
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
      content: " ";
      border-color: transparent;
      border-style: solid solid outset;
      border-width: 8px;
      border-right-color: #b2e281;
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
      height: 25px;
      width: 25px;
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
      min-width: 100px;
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
      content: " ";
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
  width: 50px;
  height: 50px;
  padding: 5px;
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
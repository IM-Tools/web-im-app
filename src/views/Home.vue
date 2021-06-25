<template>
  <el-container class="im-container">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']"> </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <img class="users-img" :src="users.avatar" />
        <span>{{ users.name }}</span>
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>👤个人信息</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <el-table :data="tableData"> </el-table>
        <el-main width="" class="app-msg"></el-main>
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

      this.value = "";
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
        alert(222)
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
    border: 1px solid rgb(26, 2, 2);
  }
}
.app-msg {
  background-color: #fff;
  height: 450px;
}
.el-footer {
  padding: 0px 0px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.app-msg-footer {
  margin-top: 20px;
}
.im-container {
  margin: 0 auto;
  width: 60%;
  height: 700px;
  border: 1px solid #eee;
}
.users-img {
  width: 30px;
  height: 30px;
  padding: 5px;
  text-align: center;
  align-items: center;
}
.el-header {
  display: flex;
  align-items: center;
  line-height: 70px;
  justify-content: flex-end;
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
</style>
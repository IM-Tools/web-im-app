<template>
  <el-container class="im-container">
    <el-aside width="280px">
      <el-header class="im-user-header">
        <img class="users-img" :src="users.avatar" />
        <span style="color: #fff;margin-left: 10px;font-size: 18px;">{{ users.name }}</span>
        <el-dropdown>
          <i class="el-icon-s-unfold" style="margin-left: 15px;font-size:20px;"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                ><i class="el-icon-user"></i>个人信息</el-dropdown-item
              >
              <el-dropdown-item @click="dialog = true"
                ><i class="el-icon-search"></i>添加好友</el-dropdown-item
              >
              <el-dropdown-item @click="logout"
                ><i class="el-icon-unlock"></i>退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="fa-main-users" style="color: #fff">
      <el-main>
        <div class="fa-users" v-for="list in goodslist" :key="list.id" @click="SelectUser(list)">
          <img :src="list.avatar" />
          <span>{{ list.name }}</span>
        </div>
           </el-main>
      </el-main>
    </el-aside>
    <el-container>
      <el-header class="im-msg-header">
        {{ selectUser.name ? selectUser.name : "未选择好友" }}
      </el-header>
      <el-main class="img-msg-main">
        <el-main id="msgDiv" width="" class="app-msg">
          <span v-if="!toUser" style="font-size: 12px;">请选择聊天</span>
          <div v-else :key="list.id" v-for="list in msgData">
            <p v-if="list.left" class="msg-content-left">
              <img class="img-left" :src="selectUser.avatar" />
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
            :placeholder="placeholder"
            @gif="setGif"
          />
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
      placeholder:"开始聊天～",
      tableData: [
        {
          name: "Summer",
          avatar:
            "https://cdn.learnku.com/uploads/avatars/32858_1624608687.jpeg!/both/100x100",
          status: true,
        },
        {
          name: "MArtian",
          avatar:
            "https://cdn.learnku.com/uploads/avatars/56030_1591034461.png!/both/100x100",
          status: false,
        },
        {
          name: "小黑猫",
          avatar:
            "https://cdn.learnku.com/uploads/avatars/1_1530614766.png!/both/100x100",
          status: true,
        },
      ],
      ws: "ws://127.0.0.1:9502/serve/ws-con",
      socket: "",
      form: {
        comments: "",
      },
      text: "",
      value: "",
      msgData: [],
      dialog: false,
      selectUser: [],
      toUser:false,
    };
  },
  computed: {
    ...mapState(["auth", "users", "goodslist"]),
  },
  created() {
    this.init();
    this.$store.dispatch("getgoodlist");
  },
  methods: {
    SelectUser(user) {
      this.selectUser = user;
      this.toUser=true
    },
    sendMsg() {
      if (!this.toUser) {
        this.$notify({
          title: "提醒",
          message: "未选择聊天对象",
          type: "error",
        });
        return;
      }
      this.send({
        user_id: this.selectUser.id,
        msg: this.value,
        left: false,
        avatar: this.selectUser.name,
      });

      this.msgData.push({
        msg: this.value,
        user_id: 2,
        left: true,
      });
      this.value=""
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
    }
  },
  mounted(){
    
  }
};
</script>

<style lang="scss" scoped>
.el-main{
  padding: 0px;
}
.im-container {
  margin: 0 auto;
  width: 60%;
  max-width: 80%;
  height:90%;
  .fa-users {
    padding: 10px;
    display: flex;
    height: 64px;
    align-items: center;
    justify-content: flex-start;
    img {
      width: 40px;
      height: 40px;
      border-radius: 3px;
    }
    span {
      font-size: 12px;
      padding-left: 10px;
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

@media (max-width: 1000px) {
  .im-container {
    width: 100%;
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
      content: " ";
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
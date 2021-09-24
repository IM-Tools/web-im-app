<template>
    <el-main class="fa-main-users" style="color: #fff">
        <el-main>
            <div class="fa-users" :class="{'is_guttered_class':list.is_guttered_class}" v-for="(list, index) in goodslist" :key="list.id" @click="selectUser(list, index)">
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
    data() {
        return {
            isActive: false,
            isSelect: -1,
        };
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
        selectUser(user, index) {
            this.$store.commit('user/setUserSelectStauts',user.id)
            this.isSelect = index;
            this.isActive = this.$emit('setUser', user);
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

.fa_user_select {
    background-color: #454b55;
      
    border-left: 2px solid #66b1ff;
}
.fa-main-users {
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
</style>
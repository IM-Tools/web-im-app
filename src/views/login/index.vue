<template>
    <div class="login-app" v-loading="loginLoading" element-loading-text="授权登录中..." element-loading-spinner="el-icon-loading">
        <el-container class="login-container">
            <el-form :model="ruleForm" ref="ruleForm" label-width="40px" class="login-form">
                <el-header>
                    <h1>IM<i class="el-icon-chat-dot-round"></i></h1>
                    <img src="" />
                </el-header>
                <el-form-item label="账号">
                    <el-input type="text" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" @keyup.enter="login" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <p>第三方登录</p>
                <div class="ouath-login">
                    <svg @click="weiboLogin" t="1624525865244" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5135" width="30" height="30">
                        <path d="M357.741904 600.362884c-25.69135 2.681895-44.090113 25.079456-44.090113 46.493689 0 21.467441 20.683644 36.29512 46.389319 33.291929 25.598235-2.921332 46.374994-22.71681 46.374994-44.104439C406.416104 614.548995 387.233544 597.545922 357.741904 600.362884z" p-id="5136" fill="#d81e06"></path>
                        <path d="M422.943374 582.668105c-8.807995 6.375769-10.615026 18.598294-5.81913 26.195804 4.596365 7.759181 15.304505 8.660649 23.990735 2.179488 8.503071-6.696041 11.810162-18.387508 7.200495-26.198874C443.719109 577.247014 433.145013 575.042968 422.943374 582.668105z" p-id="5137" fill="#d81e06"></path>
                        <path
                            d="M512.319761 1.023234c-282.373596 0-511.741644 229.076426-511.741644 511.634204 0 282.453408 229.368048 511.342583 511.741644 511.342583 282.598707 0 511.621925-228.889175 511.621925-511.342583C1023.941686 230.09966 794.918468 1.023234 512.319761 1.023234zM791.997136 640.932051C735.590359 760.730196 549.621742 819.021769 411.837196 808.23484c-130.984136-10.307032-299.377692-53.801624-316.779826-212.284139 0 0-9.192731-71.789047 60.391248-164.673079 0 0 100.084527-139.805433 216.694276-179.683916 116.677283-39.720906 130.267872 27.499403 130.267872 67.191659-6.191587 33.689967-17.788916 53.484421 26.009575 39.88053 0 0 114.685047-53.190753 161.871466-6.005358 38.098057 38.126708 6.295956 90.493758 6.295956 90.493758s-15.807936 17.50855 16.711451 23.833157C745.871811 473.469637 848.375262 520.947677 791.997136 640.932051zM678.891961 309.96509c-12.48652 0-22.489652-10.097269-22.489652-22.478396 0-12.592936 10.002109-22.689182 22.489652-22.689182 0 0 140.576951-26.010599 123.785687 125.086217 0 0.902492-0.106416 1.594198-0.266041 2.391297-1.621825 10.680513-10.999761 18.890939-22.105939 18.890939-12.540751 0-22.690205-10.017457-22.690205-22.505C757.615463 388.660965 779.881026 287.699527 678.891961 309.96509zM916.391647 415.336665c-3.719454 54.413517-16.41983 35.363977-31.511503 35.363977-18.092817 0-32.679012-9.112919-32.679012-27.206759 0-15.70152 6.482185-28.853142 6.482185-28.853142 1.912424-6.615205 17.217952-46.229695-10.096246-107.524458-50.001334-83.983946-150.697754-84.515004-162.600008-79.705806-11.996391 4.676178-29.690147 7.439932-29.690147 7.439932-18.20128 0-32.787475-14.532987-32.787475-32.519388 0-15.091673 10.096246-27.60582 23.886366-31.510479 0 0 0.319249-0.053208 0.810401-0.159624 0.99663-0.211809 2.005538-0.371434 3.108584-0.476827 13.987604-2.710546 63.951078-21.840922 112.571047-10.468703 86.987136 20.298909 206.387244 112.385841 152.665433 275.624347L916.391647 415.339735z"
                            p-id="5138"
                            fill="#d81e06"
                        ></path>
                        <path d="M422.038835 439.088987c-136.802242 6.270376-247.368774 79.546182-247.368774 170.943455 0 91.290857 110.566532 159.890485 247.368774 153.513693 136.883077-6.216144 247.673697-91.928332 247.673697-183.190538C669.713556 489.144553 558.921912 432.765403 422.038835 439.088987zM515.215512 668.934885c-41.886068 54.094268-124.78027 80.476301-205.269873 36.904967-38.286332-20.805409-36.903944-61.586385-36.903944-61.586385s-15.888772-128.912087 121.684988-144.986064C532.512253 483.246634 557.114882 614.840617 515.215512 668.934885z" p-id="5139" fill="#d81e06"></path>
                    </svg>
                </div>
                <el-form-item class="login-btn">
                    <el-button @click="login" type="primary" style="width: 300px">登录</el-button>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>
<script>
import { login } from '../../api/auth';
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            loginLoading: false,
            ruleForm: {
                name: '',
                password: '',
            },
        };
    },
    watch: {
        'this.$store.auth'() {
            this.$route.push({ path: '/' });
        },
    },
    created() {
        if (this.$route.query.code) {
            this.auth(this.$route.query.code);
        } else {
        }
    },
    methods: {
        ...mapActions('auth', ['onLoginUser', 'onWeiboLogin']),
        login() {
            if (this.ruleForm.name.length < 3 || this.ruleForm.name.length > 20) {
                this.$notify.warning('账号字符应该是3-20位之间');
                return;
            }
            if (this.ruleForm.password.length < 3 || this.ruleForm.password.length > 20) {
                this.$notify.warning('密码字符应该是3-20位之间');
                return;
            }
            login(this.ruleForm)
                .then(({code,data}) => {
                    if (code != 200) {
                         this.$notify.error(message);
                    } else {
                        this.onLoginUser(data);
                    }
                    //this.$store.dispatch('loginUser', data);
                })
                .catch(error => {
                    console.log(error);
                    this.$notify.error('系统异常');
                });
        },
        registered() {
            this.$notify({
                title: '提醒⏰',
                message: '暂未开放用户注册',
                type: 'warning',
            });
        },
        weiboLogin() {
            window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=1949419161&redirect_uri=' + import.meta.env.VITE_APP_WB_REDIRECT_URL;
        },
        onSubmit() {},
        auth(code) {
            this.loginLoading = true;
            this.onWeiboLogin({ code: code });
            // this.$store.dispatch('weiboLogin', { code: code });
        },
    },
};
</script>
<style lang="scss" scoped>
.ouath-login {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.login-app {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -190px;
    margin-top: -270px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    background-color: #fff;
    width: 380px;
    height: 380px;
    box-shadow: 0 2px 10px #999;
    -moz-box-shadow: #999 0 2px 10px;
    -webkit-box-shadow: #999 0 2px 10px;
}
@media screen and (max-width: 750px) {
    .login-app {
        top: 50%;
        left: 50%;
        margin-left: -190px;
        margin-top: -270px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        background-color: #fff;
        width: 380px;
        height: 540px;
        box-shadow: 0 2px 10px #999;
        -moz-box-shadow: #999 0 2px 10px;
        -webkit-box-shadow: #999 0 2px 10px;
    }
}

.el-container {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    box-sizing: border-box;
    min-width: 0px;
    justify-content: center;
}

.login-form {
    width: 80%;
}

.el-button--login.is-active,
.el-button--login:active {
    opacity: 0.8;
    color: #fff;
}
.el-button--login:focus,
.el-button--login:hover {
    opacity: 0.8;
    color: #fff;
}
.el-button--login {
    opacity: 0.8;
    background-color: #5c6bc6;
    border: 1px solid hsla(0, 0%, 100%, 0.6);
    color: #fff;
    transition: left 0.3s ease;
    text-transform: uppercase;
    border-radius: 3px;
}
.footer {
    color: #fff;
    margin: auto;
    position: relative;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
}
.footer a {
    color: #fff;
}
</style>

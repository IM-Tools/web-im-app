import { createStore } from "vuex";
import authApi from '../api/auth'
import router from '../router';
import Cookies from 'js-cookie'
import {ElNotification} from "element-plus"
export default createStore({
  state: {
    auth: Cookies.get('auth') ? true : false,
    users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : false,
    token: Cookies.get('token') || undefined,
    goodslist:[]
  },
  mutations: {
    // updateAuth(state, bool) {
    //   state.auth = bool;
    // },
    // updateUsers(state, data) {
    //   state.users = data;
    //   localStorage.setItem('users',JSON.stringify(data))
    // }
    setAuth(state,data){
      state.auth = data.bool;
      Cookies.set('auth',true,{ expires: data.time })
    },
    setgoodslist(state,data){
      state.goodslist = data.bool;
    
    },
    setUsers(state,data){
      localStorage.setItem('users',JSON.stringify(data))
      Cookies.set('token',data.token,{ expires: data.time })
      state.users = data;
      state.token = data.token;
    }
  },
  actions: {
      weiboLogin({commit},params){
          authApi.WeiBoCallBack(params)
          .then((response)=>{
            const {code,data} = response
            if(code ==200){
              commit('setAuth', {bool:true,time:data.expiration_time})
              commit('setUsers', data)
              ElNotification.success({
                title: "登录",
                message: "登录成功",
              })
              router.push({path: '/'})
            }else{

            }
          })
      },
      logoutUser({commit}){
        Cookies.remove('token')
        Cookies.remove('auth')
        localStorage.removeItem('users')
        ElNotification.warning({
          title: "退出",
          message: "退出登录成功",
        })
        router.push({path:"/login"})
      },
      getgoodlist({commit},params){
        authApi.GetGoodData(params)
        .then((response)=>{
          const {code,data} = response
          commit('setgoodslist', data.list)
      })
    }
  },
  getters: {
    
  },
});

import Cookies from 'js-cookie';
import { ElNotification } from 'element-plus';
import router from '../../router';
import  {WeiBoCallBack} from '../../api/auth'
import nested from './nested'


const state = () => ({
    auth: Cookies.get('auth') ? true : false,
    users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : false,
    token: Cookies.get('token') || undefined
})
const getters = {

}
const actions = {
    onWeiboLogin({ commit }, params) {
        WeiBoCallBack(params).then(response => {
            const { code, data } = response;
            if (code == 200) {
                commit('setAuth', { bool: true, time: data.expiration_time });
                commit('setUsers', data);
                ElNotification.success({
                    title: '登录',
                    message: '登录成功'
                });
                router.push({ path: '/' });
            } else {
            }
        });
    },
    onLoginUser({ commit }, data) {
        commit('setAuth', { bool: true, time: data.expiration_time });
        commit('setUsers', data);
        
        ElNotification.success({
            title: '登录',
            message: '登录成功'
        });
        router.push({ path: '/' });
    },
    logoutUser({ commit }) {
        Cookies.remove('token');
        Cookies.remove('auth');
        localStorage.removeItem('users');
        ElNotification.warning({
            title: '退出',
            message: '退出登录成功'
        });
        router.push({ path: '/login' });
    },
}

const mutations = {
    setMsgData(state, data) {
        state.msgData = data;
    },
    setAuth(state, data) {
        state.auth = data.bool;
        Cookies.set('auth', true, { expires: data.time });
    },
    setUsers(state, data) {
        localStorage.setItem('users', JSON.stringify(data));
        Cookies.set('token', data.token, { expires: data.time });
        state.users = data;
        state.token = data.token;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    modules:{
        nested
    }
  }
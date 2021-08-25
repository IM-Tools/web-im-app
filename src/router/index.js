import Cookies from 'js-cookie';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Chat.vue';
import Login from '../views/login/index.vue';
const routerMap = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'login'
        }
    }
];
const router = createRouter({
    //路由分为 history 模式 hash模式
    history: createWebHistory(),
    routes: routerMap //`routes: routes` 的缩写
});
router.beforeEach((to, from, next) => {
    // 如果用户未能验证身份，则 `next` 会被调用两次
    if (to.name !== 'Login' && Cookies.get('auth') == undefined) {
        next({ name: 'Login' });
    }
    if (to.name == 'Login' && Cookies.get('auth') == 'true') {
        next({ name: 'Home' });
    }
    next();
});

export default router;

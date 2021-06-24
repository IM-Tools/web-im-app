import { createRouter, createWebHistory } from 'vue-router'

import Home from "../views/Home.vue";
import Login from "../views/login/index.vue";

const  routerMap = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta:{
            title:'Home',
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta:{
            title:'login',
        }
    }
]

const router = createRouter({
    //路由分为 history 模式 hash模式
    history: createWebHistory(),
    routes: routerMap //`routes: routes` 的缩写
})


export default router
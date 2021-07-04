import axios from 'axios';
import QS from 'qs';
import Cookies from 'js-cookie';
import { ElNotification } from 'element-plus';
import store from '../store/index';

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000 // request timeout
});

service.interceptors.request.use(
    config => {
        //请求携带token
        const token = store.state.token;
        if (token != '' && token != undefined) {
            token && (config.headers.token = token);
        }
        return config;
    },
    error => {
        return Promise.error(error);
    }
);
// 响应拦截器
service.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        const { status, data } = response;
        if (status === 200) {
            return Promise.resolve(data);
        } else {
            return Promise.reject(data);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                case 401:
                    Cookies.remove('token');
                    Cookies.remove('auth');
                    store.state.auth = false;
                    ElNotification.error({
                        message: '登录过期,请重新登录'
                    });
                    break;
                case 403:
                    Cookies.remove('token');
                    Cookies.remove('auth');
                    store.state.auth = false;
                    ElNotification.error({
                        message: '登录过期,请重新登录'
                    });
                    break;
                case 404:
                    ElNotification.error({
                        message: '网络请求不存在'
                    });
                    break;
                default:
                    ElNotification.error({
                        message: error.response.data.message
                    });
            }
            return Promise.reject(error.response);
        }
    }
);

// /**
//   * get方法，对应get请求
//   * @param {String} url [请求的url地址]
//   * @param {Object} params [请求时携带的参数]
//   */
//  export function get(url, params={}){
//     return new Promise((resolve, reject) =>{
//         axios.get(url, {
//             params: params
//         }).then(res => {
//             resolve(res.data);
//         }).catch(err =>{
//             reject(err.data)
//     })
// });}

// /**
//   * post方法，对应post请求
//   * @param {String} url [请求的url地址]
//   * @param {Object} params [请求时携带的参数]
//   */
//  export function post(url, params) {
//     return new Promise((resolve, reject) => {
//           axios.post(url, QS.stringify(params))
//         .then(res => {
//             resolve(res.data);
//         })
//         .catch(err =>{
//             reject(err.data)
//         })
//     });
// }

// /**
//   * delete方法，对应delete请求
//   * @param {String} url [请求的url地址]
//   * @param {Object} params [请求时携带的参数]
//   */
//  export function del(url, params) {
//     return new Promise((resolve, reject) => {
//           axios.delete(url, QS.stringify(params))
//         .then(res => {
//             resolve(res.data);
//         })
//         .catch(err =>{
//             reject(err.data)
//         })
//     });
// }

export default service;

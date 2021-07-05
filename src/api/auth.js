import request from '/@/utils/request';
import qs from 'qs'
export function me(query) {
    return request({
        url: '/me',
        method: 'get',
        params: query
    });
}

export function login(query) {
    return request({
        url: '/login',
        method: 'post',
        data:qs.parse(query)
    });
}

export function WeiBoCallBack(query) {
    return request({
        url: '/WeiBoCallBack',
        method: 'get',
        params: query
    });
}

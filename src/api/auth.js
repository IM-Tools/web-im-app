import request from '/@/utils/request';

export function me(query) {
    return request({
        url: '/me',
        method: 'get',
        params: query
    });
}

export function login(params) {
    return request({
        url: '/login',
        method: 'post',
        params: query
    });
}

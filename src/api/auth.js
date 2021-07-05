import request from '/@/utils/request';

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
        data:query
    });
}

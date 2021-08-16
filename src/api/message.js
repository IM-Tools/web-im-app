import request from '../utils/request';

export function GetSmToken() {
    return request({
        url: '/getApiToken',
        method: 'get'
    });
}

export function GetGoodData(query) {
    return request({
        url: '/UsersList',
        method: 'get',
        params: query
    });
}

export function GetMsgList(query) {
   
    return request({
        url: '/InformationHistory',
        method: 'get',
        params: query
    });
}
export function ReadMessage(query) {
    return request({
        url:'/ReadMessage',
        method: 'get',
        params: query
    })
}

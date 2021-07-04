import request from '/@/utils/request';

export function WeiBoCallBack(query) {
    return request({
        url: '/WeiBoCallBack',
        method: 'get',
        query
    });
}

export function GetGoodData(query) {
    return request({
        url: '/UsersList',
        method: 'get',
        query
    });
}

export function GetMsgList(query) {
    return request({
        url: '/InformationHistory',
        method: 'get',
        query
    });
}

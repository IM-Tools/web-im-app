import request from '/@/utils/request';

export function WeiBoCallBack(params) {
    return request({
        url: '/WeiBoCallBack',
        method: 'get',
        params
    });
}

export function GetGoodData(params) {
    return request({
        url: '/UsersList',
        method: 'get',
        params
    });
}

export function GetMsgList(params) {
    console.log(params);
    return request({
        url: '/InformationHistory',
        method: 'get',
        params
    });
}

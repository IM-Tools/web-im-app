import request from '/@/utils/request';



export function GetGoodData(query) {
    return request({
        url: '/UsersList',
        method: 'get',
        params: query
    });
}

export function GetMsgList(query) {
    console.log("测试",query)
    return request({
        url: '/InformationHistory',
        method: 'get',
        params: query
    });
}

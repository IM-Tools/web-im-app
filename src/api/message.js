import request from '../utils/request';

export function GetSmToken() {
    return request({
        url: '/getApiToken',
        method: 'get'
    });
}

export function GetGroupList(params) {
    return request({
        url: '/GetGroupList',
        method: 'get',
        params:params
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
    if(query.channel_type==1){
        var url ='/InformationHistory'   
    }else{ 
        var url ='/GetGroupMessageList'
    }
   
    return request({
        url: url,
        method: 'get',
        params: query
    });
}

export function GetGroupMsgList(query) {
   
    return request({
        url: '/GetGroupMessageList',
        method: 'get',
        params: query
    });
}


//
export function ReadMessage(query) {
    return request({
        url:'/ReadMessage',
        method: 'get',
        params: query
    })
}

import request from '../utils/request';
import qs from 'qs'
export function GetFriendsList()
{
    return request({
        url: '/GetFriendsList',
        method: 'get',
        params: query
    });
}

export function GetFriendForRecord()
{
    return request({
        url: '/GetFriendForRecord',
        method: 'get',
        params: query
    });
}


export function SendFriendRequest(params)
{
    return request({
        url: '/SendFriendRequest',
        method: 'post',
        params: qs(params)
    });
}

export function ByFriendRequest(params)
{
    return request({
        url: '/ByFriendRequest',
        method: 'post',
        params: qs.stringify(params)
    });
}
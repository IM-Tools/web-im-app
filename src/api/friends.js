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


export function addFriendRequest(params)
{
    return request({
        url: '/SendFriendRequest',
        method: 'post',
        data:qs.stringify(params)
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




export function ByFriendRequest(params)
{
    return request({
        url: '/ByFriendRequest',
        method: 'post',
        params: qs.stringify(params)
    });
}
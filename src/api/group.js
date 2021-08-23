import request from '../utils/request';
import QS from 'qs';

export function CreateGroup(params) {
    return request({
        url: '/CreateGroup',
        method: 'post',
        data:QS.stringify(params)
    });
}
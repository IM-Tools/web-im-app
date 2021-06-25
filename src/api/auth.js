import {get} from '../request/http'

export default {
    /**
     * 获取用户信息
     * @param {*} data
     */
    me:function(){
        return get('/me')
    },
    /**
     * 微博登录
     * @param {*} token
     */
     WeiBoCallBack:function(params){
        return get('/WeiBoCallBack',params)
    }
}
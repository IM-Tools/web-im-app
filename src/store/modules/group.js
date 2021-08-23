// import { GetGroupList } from '../../api/group'
import nested from './nested'
const state = () => ({
    grouplist: localStorage.getItem('grouplist') ? JSON.parse(localStorage.getItem('grouplist')) : undefined, //好友列表
    groupMsgData: [],     // 群聊消息数据
    groupMsgDataList: [], // 群聊消息列表,

})
const getters = {

}
const actions = {
    // onGetGroupList({ commit }, params) {
    //     GetGroupList(params).then((response) => {
    //         const { code, data } = response
    //         commit('setGrouplist', data)
    //     })
    // },
    GetGroupMsgList({commit},params) {
        
    }
}
const mutations = {
    setGrouplist(state, data) {
        state.grouplist = data;
        localStorage.setItem('grouplist', JSON.stringify(data))
    },
    setMsg(state, data) {
        var  newList = setGoodsTop(state.grouplist,data)
        state.goodslist = newList;
        localStorage.setItem('grouplist', JSON.stringify(newList))
        state.msgData.push(data)
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    modules: {
        nested
    }
}
import { GetGoodData, GetMsgList, ReadMessage, GetSmToken, GetGroupList } from '../../api/message'
import nested from './nested'
import { setGoodsTop, cleanMsg, setUsersStatus, setGroupUserLists, setGroupsTop } from '../../utils/utils'

const state = () => ({
    goodslist: localStorage.getItem('goodslist') ? JSON.parse(localStorage.getItem('goodslist')) : undefined, //好友列表
    msgData: [],    //单人消息数据
    msgDataList: [],  //用户消息列表,
    smToken: undefined,
    grouplist: localStorage.getItem('grouplist') ? JSON.parse(localStorage.getItem('grouplist')) : undefined, //好友列表
    groupMsgData: [],     // 群聊消息数据
    groupMsgDataList: [], // 群聊消息列表,
    groupUserList: localStorage.getItem('groupUserList') ? JSON.parse(localStorage.getItem('groupUserList')) : undefined, //群聊用户列表 groupUserList
})

const getters = {

}
const actions = {
    onGetGroupList({ commit }, params) {
        GetGroupList(params).then((response) => {
            const { code, data } = response
            var groupUserMap = setGroupUserLists(data)
            commit('setGrouplist', data)
            commit('setGroupUserList', groupUserMap)

        })
    },
    onGetgoodlist: function ({ commit }, params) {
        if (state.goodslist != undefined) {
            return
        }
        GetGoodData(params).then(response => {
            const { code, data } = response;
            commit('setGoodslist', data.list);
        });
    },
    onGetMsgList({ commit }, params) {
        GetMsgList(params).then(response => {
            const { code, data } = response;
            if (params.channel_type == 2) {
                commit('setGroupMsgData', data);
            } else {
                commit('setMsgData', data);
            }

        });
    },
    onReadMessage({ commit }, params) {
        //ReadMessage
        ReadMessage(params).then((response) => {

        });
    },
    onTokenApi({ commit }) {
        GetSmToken().then(response => {
            if (response.success) {
                commit('setSmToken', response.data.token)
            }
        })
    },

}

const mutations = {
    setGroupUserList(state, data) {
        state.groupUserList = data;
        console.log(JSON.stringify(data))
        localStorage.setItem('groupUserList', JSON.stringify(data))
    },
    setSmToken(state, data) {
        state.smToken = data
    },
    setGoodslist(state, data) {
        state.goodslist = data;
        localStorage.setItem('goodslist', JSON.stringify(data))
    },
    setUserSelectStauts(state,id){
        let datas = state.goodslist
       
        datas.forEach((value,key)=>{
         
             if(id==value.id) {
                datas[key].is_guttered_class=1
             }else{
              
                datas[key].is_guttered_class=0
             }
        })
        state.goodslist = datas;
        localStorage.setItem('goodslist', JSON.stringify(datas))
   
    },
    setGroupSelectStauts(state,id){
        let datas = state.grouplist
       
        datas.forEach((value,key)=>{
         
             if(id==value.id) {
                datas[key].is_guttered_class=1
             }else{
              
                datas[key].is_guttered_class=0
             }
        })
        state.grouplist = datas;
        localStorage.setItem('grouplist', JSON.stringify(datas))
   
    },
    setMsgData(state, data) {
        var lets = data.length
        data.forEach((value, key) => {
            if (lets != key + 1) {
                var last_time = new Date(value.created_at)
                var next_time = new Date(data[key + 1].created_at)
                last_time = last_time.getTime(last_time)
                next_time = next_time.getTime(next_time)

                if (last_time - next_time > 7200) {
                    data[key].time_status = 1
                } else {
                    data[key].time_status = 0
                }
            } else {
                data[key].time_status = 0
            }
        });
        state.msgData = data;
    },
    setGroupMsgData(state, data) {
        var lets = data.length
        data.forEach((value, key) => {
            if (lets != key + 1) {
                var last_time = new Date(value.created_at)
                var next_time = new Date(data[key + 1].created_at)
                last_time = last_time.getTime(last_time)
                next_time = next_time.getTime(next_time)

                if (last_time - next_time > 7200) {
                    data[key].time_status = 1
                } else {
                    data[key].time_status = 0
                }
            } else {
                data[key].time_status = 0
            }
        });
        state.groupMsgData = data;
    },
    setOnline(state, data) {
        console.log(data)
        var newList = setUsersStatus(state.goodslist, data.id, 1)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    },
    setOffline(state, data) {
        var newList = setUsersStatus(state.goodslist, data.id, 0)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    },
    setOirderGoodList(state, data) {

    },
    clearGroupMsg(state, data) {
        var newList = cleanMsg(state.groupMsgData, data.id)
        state.groupMsgData = newList;
        localStorage.setItem('groupMsgData', JSON.stringify(newList))
    },
    clearMsg(state, data) {
        var newList = cleanMsg(state.goodslist, data.id)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    },
    setGrouplist(state, data) {
        state.grouplist = data;
        localStorage.setItem('grouplist', JSON.stringify(data))
    },
    setMsg(state, data) {
        var newList = setGoodsTop(state.goodslist, data)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
        state.msgData.push(data)
    },
    setGroupMsg(state, data) {
        data.users = state.groupUserList[data.to_id][data.from_id]
        var newList = setGroupsTop(state.grouplist, data)
        state.grouplist = newList;
        localStorage.setItem('grouplist', JSON.stringify(newList))
        state.groupMsgData.push(data)
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
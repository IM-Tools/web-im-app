import { GetGoodData, GetMsgList } from '../../api/message'
import nested from './nested'
import { setGoodsTop,cleanMsg,setUsersStatus } from '../../utils/utils'

const state = () => ({
    goodslist: localStorage.getItem('goodslist') ? JSON.parse(localStorage.getItem('goodslist')) : undefined, //好友列表
    msgData: [],    //单人消息数据
    msgDataList:[]  //用户消息列表
})

const getters = {

}
const actions = {
    onGetgoodlist({ commit }, params) {
        if (state.goodslist != undefined) {
            return
        }
        GetGoodData(params).then(response => {
            const { code, data } = response;
            console.log(response);
            commit('setGoodslist', data.list);
        });
    },
    onGetMsgList({ commit }, params) {
        GetMsgList(params).then(response => {
            const { code, data } = response;
            commit('setMsgData', data);
        });
    }
}

const mutations = {
    setGoodslist(state, data) {
        state.goodslist = data;
        localStorage.setItem('goodslist', JSON.stringify(data))
    },
    setMsgData(state, data) {
        state.msgData = data;
    },
    setMsg(state, data) {
        var  newList = setGoodsTop(state.goodslist,data)
       
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
        state.msgData.push(data)
    },
    setOnline(state, data){
        var  newList =  setUsersStatus(state.goodslist,data.id,1)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    },
    setOffline(state, data){
        var  newList =  setUsersStatus(state.goodslist,data.id,0)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    },
    setOirderGoodList(state, data) {

    },
    clearMsg(state, data){
        var  newList =  cleanMsg(state.goodslist,data.id)
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
    }
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
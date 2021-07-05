import { GetGoodData, GetMsgList } from '../../api/message'
import nested from './nested'

const state = () => ({
    goodslist: localStorage.getItem('goodslist') ? JSON.parse(localStorage.getItem('goodslist')) :[],
    msgData: []
})

const getters = {

}
const actions = {
    onGetgoodlist({ commit }, params) {
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
        localStorage.setItem('goodslist',JSON.stringify(data))
    },
    setMsgData(state, data) {
        state.msgData = data;
    },
    setMsg(state,data){
        state.msgData.push(data);
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
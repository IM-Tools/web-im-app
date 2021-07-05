import { GetGoodData, GetMsgList } from '../../api/message'
import nested from './nested'

const state = () => ({
    goodslist: [],
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
            console.log(data);
            commit('setMsgData', data);
        });
    }
}

const mutations = {
    setGoodslist(state, data) {
        console.log(data);
        state.goodslist = data;
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
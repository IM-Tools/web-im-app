import { GetGoodData, GetMsgList } from '../../api/message'
import nested from './nested'
import { setGoodsTop } from '../../utils/utils'

const state = () => ({
    goodslist: localStorage.getItem('goodslist') ? JSON.parse(localStorage.getItem('goodslist')) : undefined,
    msgData: []
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
        if (data.status == 1) {
            var  newList = setGoodsTop(state.goodslist, data.from_id)
        } else {
            var newList  = setGoodsTop(state.goodslist, data.to_id)
        }
        state.goodslist = newList;
        localStorage.setItem('goodslist', JSON.stringify(newList))
        state.msgData.push(data)
    },
    setOirderGoodList(state, data) {

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
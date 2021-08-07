import { GetGoodData, GetMsgList,ReadMessage } from '../../api/message'
import nested from './nested'
import { setGoodsTop,cleanMsg,setUsersStatus } from '../../utils/utils'
import moment  from '../../utils/moment'

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
    },
    onReadMessage({commit},params) {
        //ReadMessage
        ReadMessage(params).then(response => {
           
        });
    }
}

const mutations = {
    setGoodslist(state, data) {
        state.goodslist = data;
        localStorage.setItem('goodslist', JSON.stringify(data))
    },
    setMsgData(state, data) {
        var lets = data.length
        data.forEach((value, key) => {
            if(lets!=key+1){
                console.log(value)
                var last_time = new Date(value.created_at)
                var next_time = new Date(data[key+1].created_at)
                last_time = last_time.getTime(last_time)
                next_time = next_time.getTime(next_time)

              if(last_time-next_time >7200)
              {
                  data[key].time_status = 1
              }else{
                data[key].time_status=0
              }
            }else{
                data[key].time_status=0
            }
        });
     
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
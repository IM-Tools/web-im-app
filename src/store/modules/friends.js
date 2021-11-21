import nested from './nested'

import { addFriendRequest} from '../../api/friends'

const state = () => ({
    addFriendRequest({commit},params){
        addFriendRequest(params).then((response) => {
            const {code} = response.data
            if(code==200){

            }
        })
    }
})
const getters = {

}
const actions = {

}

const mutations = {

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
import { createStore } from 'vuex'


const store = createStore({
    state () {
        return {
            count: 0
        }
    },
    getters: {

        },
    actions:{

    },
    modules:{

    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})


export default store
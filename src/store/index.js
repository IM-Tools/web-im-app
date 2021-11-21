import { createStore, createLogger } from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import group from './modules/group'
import friends from './modules/friends'
const debug =
    import.meta.env.NODE_ENV !== 'production'

export default createStore({
    modules: {
        auth,
        user,
        group,
        friends
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
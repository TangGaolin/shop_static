import * as types from '../types'
import Cookies from 'js-cookie'
import router from '../../router'

const state = {
    userInfo: Cookies.getJSON('cashierinfo'),
    userRulesNode: router.options.routes
}
const mutations = {
    [types.SET_ACCOUNT] (state, account) {
        state.userInfo = account
        Cookies.set('cashierinfo', account)
    },
    [types.UNSET_ACCOUNT] (state) {
    	state.userInfo = null
        Cookies.remove('cashierinfo')
    },
    [types.SET_CONFIG] (state, config) {
        state.globalConfig = config
    },
}
export default {
    state: state,
    mutations: mutations
}
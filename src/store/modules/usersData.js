import * as types from '../types'

const state = {
    userOrders: {},
    userItems: {},
    currentUserData: {},
    useOrderList: {}
}
const mutations = {

    [types.SET_CURRENT_USER] (state, userData) {
        state.currentUserData = userData
    },
    [types.SET_USER_ORDERS] (state, orderData) {
        state.userOrders = orderData
    },

    [types.SET_USER_ITEMS] (state, itemData) {
        state.userItems = itemData
    },

    [types.SET_USE_ORDER_LIST] (state, itemData) {
        state.useOrderList = itemData
    },

    [types.INIT_USER_DATA] (state) {
        state.userOrders = {}
        state.userItems = {}
        state.useOrderList = {}
    }
}
export default {
    state: state,
    mutations: mutations
}

import * as types from '../types'

const state = {
    userOrders: {},
    userItems: {},
    currentUserData: {}
}
const mutations = {

    [types.SET_CURRENT_USER] (state, userData) {
        state.currentUserData = userData
    },
    [types.SET_USER_ORDERS] (state, orderData) {
        state.userOrders = orderData
    },

    [types.SET_USER_ITEMS] (state, itemData) {
        console.log(itemData)
        state.userItems = itemData
    }
}
export default {
    state: state,
    mutations: mutations
}

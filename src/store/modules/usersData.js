import * as types from '../types'

const state = {
    userOrders: {},
    currentUserData: {}
}
const mutations = {

    [types.SET_CURRENT_USER] (state, userData) {
        state.currentUserData = userData
    },
    [types.SET_USER_ORDERS] (state, orderData) {
        console.log(orderData)
        state.userOrders = orderData
    }
}
export default {
    state: state,
    mutations: mutations
}

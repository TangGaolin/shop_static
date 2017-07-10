import Vue from 'vue'
import Vuex from 'vuex'

import account from './modules/account'
import userData from './modules/usersData'
import * as actions from './actions'
import getters from './getters'


Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		account,
        userData
	},
	actions,
	getters
})



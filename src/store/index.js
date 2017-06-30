import Vue from 'vue'
import Vuex from 'vuex'

import account from './modules/account'
import * as actions from './actions'
import getters from './getters'


Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		account
	},
	actions,
	getters
})



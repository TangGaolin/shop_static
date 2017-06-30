import * as types from './types'
import { login,logout,getConfig } from '../api/login'
import {LoadingBar, Message} from 'iview'

export const loginAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> { 
	    login(params).then((response) => {
	    	if(0 != response.statusCode) {
				Message.error(response.msg)
	    	}else{
	    		commit(types.SET_ACCOUNT, response.data); //获得的数据通过mutation，存入store中
	    		resolve(response)
	    	}
	    }).catch((error) => {
	    	console.log(error)
	    })
  })
}

export const logoutAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> { 
	    logout(params).then((response) => {
	    	console.log(response)
	    	if(0 != response.statusCode) {
				Message.error(response.msg)
	    	}else{
	    		commit(types.UNSET_ACCOUNT); //获得的数据通过mutation，存入store中
	    		resolve(response)
	    	}
	    }).catch((error) => {
	    	console.log(error)
	    })
  })
}


export const getConfigAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        getConfig(params).then((response) => {
            console.log(response)
            if(0 != response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_CONFIG,response.data); //获得的数据通过mutation，存入store中
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}
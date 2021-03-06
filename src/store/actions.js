import * as types from './types'
import { login,logout, getConfig, getOrderList, getUserDetail, getUserItemList, getUseOrderList } from '../api/api'
import { Message } from 'iview'
import router from '../router'

export const loginAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        login(params).then((response) => {
            if(0 !== response.statusCode) {
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

export const updateAccountAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        commit(types.SET_ACCOUNT, params); //获得的数据通过mutation，存入store中
        resolve(params)
    })
}


export const logoutAction = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        logout(params).then((response) => {
            if(0 !== response.statusCode) {
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
            if(0 !== response.statusCode) {
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

export const loadUserDetail = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        //获取用户详细信息
        getUserDetail(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                if(false === response.data){
                    Message.error('用户信息不存在')
                    router.push('/')
                }else{
                    commit(types.SET_CURRENT_USER, response.data); //获得的数据通过mutation，存入store中
                }
            }
        }).catch((error) => {
            console.log(error)
        })

        //若是新创建用户则不执行
        if(!('uid' in params)){
            //初始化卡项数据
            commit(types.INIT_USER_DATA)
            return;
        }

        //加载用户卡项服务数据
        getUserItemList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USER_ITEMS,response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })


        //加载用户购买服务数据
        getOrderList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USER_ORDERS, response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })

        //加载用户耗卡记录数据
        getUseOrderList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USE_ORDER_LIST, response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })

    })
}


// 获取购买记录数据
export const getUserOrderList = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        getOrderList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USER_ORDERS,response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}

// 获取购买项目数据
export const getUserItems = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        getUserItemList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USER_ITEMS,response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}

// 获取消耗记录数据
export const getUseOrders = ({commit}, params) => {
    return new Promise((resolve, reject)=> {
        getUseOrderList(params).then((response) => {
            if(0 !== response.statusCode) {
                Message.error(response.msg)
            }else{
                commit(types.SET_USE_ORDER_LIST, response.data)
                resolve(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}
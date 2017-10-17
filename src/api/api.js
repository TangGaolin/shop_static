import { fetch } from '../utils/fetch';


export function getConfig(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/getConfig',
        method: 'post',
        data
    });
}

export function login(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/login',
        method: 'post',
        data
    });
}

export function logout(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/logout',
        method: 'post',
        data
    });
}

export function getEmployeeList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getServerEmpList',
        method: 'post',
        data
    });
}


export function addUser(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/addUser',
        method: 'post',
        data
    });
}

export function getUserDetail(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getUserDetail',
        method: 'post',
        data
    });
}

export function searchUserList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/searchUserList',
        method: 'post',
        data
    });
}


export function recharge(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/recharge',
        method: 'post',
        data
    });
}

// 获取订单列表接口
export function getOrderList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getOrderList',
        method: 'post',
        data
    });
}

export function getItemList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getItemList',
        method: 'post',
        data
    });
}

export function getUserItemList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getUserItemList',
        method: 'post',
        data
    });
}

export function buyItems(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/buyItems',
        method: 'post',
        data
    });
}

export function useItems(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/useItems',
        method: 'post',
        data
    });
}
// 获取消耗接口列表
export function getUseOrderList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getUseOrderList',
        method: 'post',
        data
    });
}


// 获取消耗接口列表
export function getShopDataView(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getShopDataView',
        method: 'post',
        data
    });
}

// 还款接口
export function repay(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/repay',
        method: 'post',
        data
    });
}

// 用户列表接口
export function getTodayUsers(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getTodayUsers',
        method: 'post',
        data
    });
}


// 产品卡充值接口
export function chargeGoods(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/chargeGoods',
        method: 'post',
        data
    });
}

// 获取产品列表接口
export function getGoodsList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getGoodsList',
        method: 'post',
        data
    });
}

// 购买产品
export function buyGoods(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/buyGoods',
        method: 'post',
        data
    });
}

// 退换功能
export function changeItems(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/changeItems',
        method: 'post',
        data
    });
}

// 修改密码功能
export function resetPassword(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/resetPassword',
        method: 'post',
        data
    });
}

//确认顾客到店
export function checkUserOrderTime(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/checkUserOrderTime',
        method: 'post',
        data
    });
}

//获取预约顾客列表
export function getOrderUser(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getOrderUser',
        method: 'post',
        data
    });
}

//根据order_id 和 单据类型 获取单据详情
export function getOrderInfo(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getOrderInfo',
        method: 'post',
        data
    });
}

//更新会员信息
export function updateUser(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/updateUser',
        method: 'post',
        data
    });
}

//会员预约功能
export function orderTime(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/orderTime',
        method: 'post',
        data
    });
}
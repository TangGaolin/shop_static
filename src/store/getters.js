const getters = {
    userInfo: state => state.account.userInfo, //登录账号信息
    globalConfig: state => state.account.globalConfig,  //会员订单信息

    currentUserData: state => state.userData.currentUserData, //当前账号
    userOrders: state => state.userData.userOrders,  //会员订单信息
    userItems: state => state.userData.userItems,  //会员卡项信息
    useOrderList: state => state.userData.useOrderList,  //会员消耗信息
}

export default getters

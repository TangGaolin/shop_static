const getters = {
    userInfo: state => state.account.userInfo, //登录账号信息
    currentUserData: state => state.userData.currentUserData,
    userOrders: state => state.userData.userOrders,  //会员订单信息

}
export default getters

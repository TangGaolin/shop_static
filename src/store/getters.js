const getters = {
    userInfo: state => state.account.userInfo,
    userRulesNode: state => state.account.userRulesNode,
    globalConfig: state => state.account.globalConfig,
}
export default getters

<style scoped>

</style>
<template>
    <div class="content">
        <!--<div class = "user-detail-area">-->
            <div>
                <h1>
                    <Icon type="person"></Icon>
                        {{currentUserData.user_name}}
                    <Tag color="blue">A 类</Tag>
                </h1>
                <br>
                <UserInfo :currentUserData = currentUserData></UserInfo>
            </div>
            <br/>
            <div>
                <Recharge
                        :currentUserData = currentUserData
                        :empData = empData
                        :userInfo = userInfo
                ></Recharge>

                <ChargeGoods
                        :currentUserData = currentUserData
                        :empData = empData
                        :userInfo = userInfo
                ></ChargeGoods>

                <BuyItems
                        :currentUserData = currentUserData
                        :empData = empData
                        :userInfo = userInfo
                >
                </BuyItems>
                <BuyGoods
                        :currentUserData = currentUserData
                        :empData = empData
                        :userInfo = userInfo
                >
                </BuyGoods>

                <Repayment v-if = "currentUserData.debt > 0"
                        :currentUserData = currentUserData
                        :empData = empData
                        :userInfo = userInfo
                        :globalConfig = globalConfig
                ></Repayment>

                <ChangeItems
                           :currentUserData = currentUserData
                           :userItems = userItems
                           :empData = empData
                           :userInfo = userInfo
                           :globalConfig = globalConfig
                ></ChangeItems>
            </div>

            <Tabs value="items" >
                <Tab-pane label="卡项服务" name="items">
                    <ItemList  :currentUserData = currentUserData
                               :userItems = userItems
                               :empData = empData
                               :userInfo = userInfo
                               :globalConfig = globalConfig
                    ></ItemList>
                </Tab-pane>

                <Tab-pane label="购买记录" name="buys">
                    <OrderList :currentUserData = currentUserData
                               :userOrders = userOrders
                               :globalConfig = globalConfig
                    ></OrderList>
                </Tab-pane>

                <Tab-pane label="耗卡记录" name="used">
                    <UseOrderList :currentUserData = currentUserData
                                  :useOrderList = useOrderList
                                  :globalConfig = globalConfig
                    >
                    </UseOrderList>
                </Tab-pane>
            </Tabs>
        <!--</div>-->
        <br/>
        <br/>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        props: {
            empData: Array
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'userOrders',
                'useOrderList',
                'userItems',
                'currentUserData',
                'globalConfig',
            ])
        },
        created() {
            this.getCurrentUserData()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'getCurrentUserData'
        },
        methods: {
            getCurrentUserData(){
                this.$store.dispatch('loadUserDetail', this.$route.query)
            }
        }
    }
</script>

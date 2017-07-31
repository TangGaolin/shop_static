<style scoped>
    .user-detail-area {
        width: auto;
        padding-top: 20px;
        margin-left: 55px;
        margin-right: 55px;
        font-size: 14px;
    }

</style>
<template>
    <div class="content">
        <div class = "user-detail-area">
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
                ></Recharge>

                <BuyItems
                        :currentUserData = currentUserData
                        :empData = empData
                >
                </BuyItems>
                <Button type="ghost">购买产品</Button>
                <Button type="ghost">还 款</Button>
            </div>

            <Tabs value="items" >
                <Tab-pane label="卡项服务" name="items">
                    <ItemList  :currentUserData = currentUserData
                               :userItems = userItems
                               :empData = empData
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

                </Tab-pane>
            </Tabs>
        </div>
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
                orderList:[],
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'userOrders',
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

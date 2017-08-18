<style>

</style>
<template>
    <div class="content">
        <h2>交班审核</h2>
        <br/>
        <Row>
            <Date-picker type="date" placeholder="选择日期" style="width: 200px" :options="options1" :value = chooseDate @on-change="changeDate"></Date-picker>
        </Row>
        <Tabs value="yeji" >
            <Tab-pane label="业绩单据" name="yeji">
                <Table stripe :columns="columns_yeji" :data="orderList.data"></Table>
                <br/>
                <div style="float: right;">
                    <Page :total = orderList.totalSize :page-size = yejiLimit :current = yejiCurPage @on-change="changePage"></Page>
                </div>
            </Tab-pane>

            <Tab-pane label="消耗单据" name="xioahao">
                <Table stripe :columns="columns" :data="useOrderList.data"></Table>
                <br/>
                <div style="float: right;">
                    <Page :total = useOrderList.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
                </div>
            </Tab-pane>
        </Tabs>

        <p>&nbsp;</p>
        <p>&nbsp;</p>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getOrderList, getUseOrderList } from '../api/api'
    import { formatDate } from '../utils/utils'
    import expandRow from '../components/UseOrderInfoTableRow.vue'
    import OrderInfoTableRow from '../components/OrderInfoTableRow.vue'
    export default {
        components: { expandRow,OrderInfoTableRow },
        data() {
            return {
                chooseDate: new Date(),
                orderList:[],
                useOrderList:[],
                limit:15,
                yejiLimit:15,
                curPage:1,
                yejiCurPage:1,
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                columns_yeji:[
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(OrderInfoTableRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '订单号',
                        key: 'order_id'
                    },
                    {
                        title: '会员姓名',
                        key: 'user_name',
                        width: 85

                    },
                    {
                        title: '类 型',
                        key: 'order_type',
                        render: (h, params) => {
                            return this.globalConfig.order_types[params.row.order_type]
                        },
                        width: 100
                    },
                    {
                        title: '金 额',
                        key: 'pay_money',
                        width: 90
                    },
                    {
                        title: '订单状态',
                        key: 'status',
                        render: (h, params) => {
                            return this.globalConfig.order_status[params.row.status]
                        },
                        width: 85,
                    },
                    {
                        title: '收银员',
                        width: 80,
                        key: 'cashier_name'
                    },
                    {
                        title: '结算时间',
                        key: 'add_time'
                    }
                ],
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    rows: params.row.items_info
                                }
                            })
                        }
                    },
                    {
                        title: '流水号',
                        key: 'use_order_id'
                    },
                    {
                        title: '会员',
                        width: 85,
                        key: 'user_name'
                    },
                    {
                        title: '金额(元)',
                        width: 80,
                        key: 'use_money'
                    },
                    {
                        title: '操作项目',
                        key: 'items_info',
                        render: (h, params) => {
                            let item_names = [];
                            params.row.items_info.forEach((item) => {
                                item_names.push(item.item_name)
                            })
                            return item_names.join(',')
                        }
                    },
                    {
                        title: '收银员',
                        width: 80,
                        key: 'cashier_name'
                    },
                    {
                        title: '结算时间',
                        key: 'add_time'
                    }

                ]
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'globalConfig',
            ])
        },
        created() {
            this.getOrderList(formatDate(new Date(), "yyyy-MM-dd"))
            this.getUseOrderList(formatDate(new Date(), "yyyy-MM-dd"))
        },
        methods: {
            changeDate(select_date) {
                this.getOrderList(select_date)
                this.getUseOrderList(select_date)
            },
            getOrderList(select_date) {
                getOrderList({
                    shop_id: this.userInfo.shop_id,
                    select_date: select_date
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.orderList = response.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },

            getUseOrderList(select_date) {
                getUseOrderList({
                    shop_id: this.userInfo.shop_id,
                    select_date: select_date
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.useOrderList = response.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            changePage() {

            }
        }
    }
</script>



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
                <Tag color="blue">单据数量: {{orderList.totalSize}}</Tag>
                <Tag color="red">业绩总和: {{orderList.totalMoney}}</Tag>
                <Table stripe :columns="columns_yeji" :data="orderList.data"></Table>
                <br/>
                <div style="float: right;">
                    <Page :total = orderList.totalSize :page-size = yejiLimit :current = yejiCurPage @on-change="changePageYeji"></Page>
                </div>
            </Tab-pane>

            <Tab-pane label="消耗单据" name="xioahao">
                <Tag color="blue">单据数量: {{useOrderList.totalSize}}</Tag>
                <Tag color="red">消耗总和: {{useOrderList.totalMoney}}</Tag>
                <Table stripe :columns="columns" :data="useOrderList.data"></Table>
                <br/>
                <div style="float: right;">
                    <Page :total = useOrderList.totalSize :page-size = limit :current = curPage @on-change="changePageXiaohao"></Page>
                </div>
            </Tab-pane>
        </Tabs>

        <p>&nbsp;</p>
        <Modal v-model="showModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>报单</span>
            </p>
            <h3>编辑内容</h3>
            <Input v-model="report_msg" type="textarea" :autosize="{minRows: 2,maxRows: 8}" ></Input>
            <p slot="footer">
                <Button type="primary" :loading="submitLoading" @click="handleSubmit">
                    <span v-if="!submitLoading">确认报单</span>
                    <span v-else>加载中...</span>
                </Button>
                <Button type="ghost" @click="getReportWords()" style="margin-left: 8px">重 置</Button>
            </p>
        </Modal>


        <p>&nbsp;</p>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getOrderList, getUseOrderList, reportOrderData } from '../api/api'
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
                showModel: false,
                submitLoading: false,
                currentOrder:{},
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                report_msg: "",
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
                        width: 90
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
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            let ac_array = [
                                h('LinkButton', {
                                    props: {
                                        to: "print-view?order_id=" + params.row.use_order_id + "&from_type=1&user_name=" + params.row.user_name,
                                        name: "打印小票",
                                        size: "small",
                                        type: "ghost"
                                    },
                                }, "打印小票")
                            ]
                            if(this.globalConfig.show_report_button){
                                ac_array.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showReportModel(params.row)
                                        }
                                    }
                                }, "报单"))
                            }
                            return h('div', ac_array)
                        }
                    }
                ],
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    rows: params.row
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
                            if(0 === params.row.uid){
                                params.row.items_info.use_items.forEach((item) => {
                                    item_names.push(item.item_name)
                                })
                            }else{
                                params.row.items_info.forEach((item) => {
                                    item_names.push(item.item_name)
                                })
                            }
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
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('LinkButton', {
                                    props: {
                                        to: "print-view?order_id=" + params.row.use_order_id + "&from_type=1&user_name=" + params.row.user_name,
                                        name: "打印小票",
                                        size: "small",
                                        type: "ghost"
                                    },
                                }, "打印小票")
                            ])
                        }
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

            getReportWords() {
                this.report_msg = this.userInfo.shop_name + "\n"
                if(0 == this.currentOrder.order_type) {
                    this.report_msg += "成交会员卡:"
                }
                if(1 == this.currentOrder.order_type) {
                    this.report_msg += "成交项目: "
                    this.currentOrder.order_info.forEach((item) => {
                        this.report_msg += item.item_name
                    })
                }
                if(2 == this.currentOrder.order_type) {
                    this.report_msg += "成交产品: "
                    this.currentOrder.order_info.forEach((item) => {
                        this.report_msg += item.good_name
                    })
                }
                if(3 == this.currentOrder.order_type) {
                    this.report_msg += "顾客回款: "
                }
                this.report_msg += "  " + this.currentOrder.pay_money + "元"

                if(this.currentOrder.emp_info.length > 0){
                    this.report_msg += "\n美容师/顾问: "
                    this.currentOrder.emp_info.forEach((item) => {
                        this.report_msg += item.emp_name + ""
                    })
                }
            },
            showReportModel(orderInfo) {
                this.showModel = true
                this.currentOrder = orderInfo
                this.getReportWords()
            },
            handleSubmit() {
                this.submitLoading = true
                reportOrderData({
                    report_msg: this.report_msg,
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.$Notice.success({
                            title: '报单成功',
                            desc: ''
                        })
                        this.showModel = false
                    }
                    this.submitLoading = false
                }).catch((error) => {
                    console.log(error)
                    this.submitLoading = false
                })
            },
            changePageYeji(page) {
                this.yejiCurPage = page
                this.getOrderData()
            },
            changePageXiaohao(page) {
                this.cur_page = page
                this.getUseOrderList()
            }
        }
    }
</script>



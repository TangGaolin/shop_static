<style>
    .page-view{
        width: 300px;
        margin-left: auto;
        margin-right: auto;
        padding: 20px 10px 88px;
        font-size: 13px;
        background-color: #efffee;
    }
    .div-margin-top {
        margin-top: 8px;
    }
</style>
<template>
    <div class="page-view">
        <div style="text-align: center">
            <h2>{{userInfo.shop_name}}</h2>
        </div>
        <br/>
        <div>
            <label>单&nbsp;据&nbsp;号: </label> {{ orderInfo.use_order_id ? orderInfo.use_order_id : orderInfo.order_id }}
            <br/>
            <label>消费时间: </label> {{orderInfo.add_time}} <br/>
            <label>会员姓名: </label>{{ $route.query.user_name }} <br/>

        </div>

        <!-- 耗卡单据 -->
        <div v-if="1 == $route.query.from_type" class="div-margin-top">
            <label>消耗明细</label>
            <div v-if="orderInfo.uid !== 0" style="border-top: 1px solid #ccc">
                <p v-for="item in orderInfo.items_info" :key="item.id">
                    <label>项目:</label>  {{item.item_name}}
                    <label>次数:</label>  {{item.use_time}}
                    <label>服务人员:</label>
                    <span v-for="emp in item.emps">
                        {{ emp.emp_name }}
                    </span>
                </p>
            </div>

            <div v-else>
                <p v-for="item in orderInfo.items_infos.use_items" :key="item.id">
                    <label>项目:</label>  {{item.item_name}} &nbsp;
                    <label>次数:</label>  {{item.use_time}}
                </p>
                <p>
                    <label>服务人:</label>
                    <span v-for="emp in orderInfo.items_infos.server_emps">
                        {{ emp.emp_name }}
                    </span>
                </p>
            </div>
        </div>

        <!-- 业绩单据 -->
        <div v-else class="div-margin-top">
            <label>消费明细 </label>
            <div style="border: 1px solid #ccc"></div>

            <div v-if="0 == orderInfo.order_type">
                <label>充值金额:</label>  {{orderInfo.worth_money}}
            </div>

            <div v-if="1 == orderInfo.order_type">
                <p v-for="item in orderInfo.order_info" :key="item.item_id">
                    <label>项目名称:</label> {{ item.item_name }}
                    <label>项目次数:</label> {{ item.times }}
                    <label>销售金额:</label> {{ item.sold_money }} 元
                </p>
            </div>

            <div v-if="2 == orderInfo.order_type">
                <p v-for="(item, index) in orderInfo.order_info" :key="index">
                    <label>产品名称:</label> {{ item.good_name }}
                    <label>产品数量:</label> {{ item.num + " " + item.unit}}
                    <label>金额:</label> {{ item.sold_money }} 元
                </p>
            </div>

            <div v-if="3 == orderInfo.order_type">
                <label>还款金额:</label> {{ orderInfo.pay_money }}
            </div>

            <div v-if="4 == orderInfo.order_type">
                <label>产品卡充值金额:</label> {{ orderInfo.order_info }}
                <br/>
                <label>产品充值金额:</label> {{ orderInfo.worth_money }}
            </div>

            <div v-if="orderInfo.order_type == 5 || orderInfo.order_type == 6">
                <div  v-for="item in orderInfo.order_info.select_items" :key="item.item_id">
                    <label>退项目名称:</label> {{ item.item_name }}
                    <label>次数:</label> {{ item.change_times }} 次
                    <br/>
                </div>
                <label>手续费:</label> {{ orderInfo.order_info.change_fee }}

                <div v-if="orderInfo.order_type == 6">
                    <div v-for="item in orderInfo.order_info.select_new_items" :key="item.item_id">
                        <label>新项目:</label> {{item.item_name}}
                        <label>次数:</label> {{item.times}} 次
                        <label>金额: </label> {{item.sold_money}}
                    </div>
                </div>
            </div>
        </div>

        <div class="div-margin-top">
            <label>支付方式 </label>
            <div style="border-top: 1px solid #ccc"></div>
            <p v-if="orderInfo.pay_cash != 0">
                <label>现金支付:</label> {{orderInfo.pay_cash}}
            </p>
            <p v-if="orderInfo.pay_card != 0">
                <label>银行卡支付:</label> {{orderInfo.pay_card}}
            </p>
            <p v-if="orderInfo.pay_mobile != 0">
                <label>扫码支付:</label> {{orderInfo.pay_mobile}}
            </p>
            <p v-if="orderInfo.debt > 0">
                <label>欠款金额:</label> {{orderInfo.debt}}
            </p>
            <p v-if="orderInfo.pay_balance > 0">
                <label>会员卡金额:</label> {{orderInfo.pay_balance}}
            </p>
            <p v-if="orderInfo.use_good_money > 0">
                <label>产品卡金额:</label> {{orderInfo.use_good_money}}
            </p>
        </div>



        <div class="div-margin-top">
            <label>收&nbsp;银&nbsp;员: </label> {{ orderInfo.cashier_name }}
            <br/>
            <label>门店电话: {{userInfo.shop_tel}}</label>
        </div>
        <div class="div-margin-top">
            <label>签字:</label>

        </div>

    </div>
</template>

<script>
    import { getOrderInfo } from  '../api/api'
    import { mapGetters } from 'vuex'
    export default {
        data () {
            return {
                orderInfo: {}
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        created() {
            this.getOrderData()
        },
        updated() {
            window.print()
        },
        methods: {
            getOrderData() {
                getOrderInfo({
                    from_type: this.$route.query.from_type,
                    order_id: this.$route.query.order_id
                }).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.orderInfo = response.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
</script>
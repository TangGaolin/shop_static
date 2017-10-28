<template>
    <span>
        <Button type="ghost" style="color: red;border-color: red" @click = "goShowModel()" >回 款</Button>
        <Modal v-model="showModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>还款 - {{currentUserData.user_name}} </span>
            </p>

            <Form ref="repayData" :model="repayData"  :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options = options1 :value= add_time style="width: 180px"></Date-picker>
                </Form-item>

                <h3 style="text-align: center">欠款订单</h3>
                <Table stripe :columns="columns" :data="debtOrderList.data"></Table>
                <br/>
                <div v-if="'' != repayData.order_id">
                    <Form-item label="还款订单:">
                        <Tag type="border" color="red"> {{ repayData.order_id }} </Tag>
                    </Form-item>

                    <Form-item label="还款金额:">
                        <Input v-model="repayData.repay_money" placeholder="还款金额" style="width: 100px"></Input> 元
                    </Form-item>

                    <Row>
                        <Col span="6">
                            <Form-item label="现金">
                                <Input v-model="repayData.pay_cash"></Input>
                            </Form-item>
                        </Col>

                        <Col span="6">
                            <Form-item label="银行卡">
                                <Input v-model="repayData.pay_card"></Input>
                            </Form-item>
                        </Col>

                        <Col span="6" offset = 1>
                            <Form-item label="微信/支付宝">
                                <Input v-model="repayData.pay_mobile"></Input>
                            </Form-item>
                        </Col>
                    </Row>


                    <Form-item label="销售人" prop="empRate">
                        <Select v-model="repayData.emp_ids" multiple style="width:360px" @on-change="setMoneyRate">
                            <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                        </Select>
                    </Form-item>

                    <Row>
                        <Col span="8" v-for="item in repayData.pay_emps" :key="item.emp_id">
                            <Form-item :label="item.emp_name">
                                <Input v-model="item.money"></Input>
                            </Form-item>
                        </Col>
                    </Row>

                    <p style="color: blue;text-align: center">
                    注: 销售人分配总金额 = 还款金额
                    </p>

                </div>
            </Form>


            <p slot="footer" style="text-align: center">
                <Button type="primary" :loading="submitLoading" @click="replaySubmit()">
                    <span v-if="!submitLoading">确认还款</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">取 消</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { repay, getOrderList } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            currentUserData: Object,
            empData: Array,
            userInfo: Object,
            globalConfig:Object
        },
        data () {
            return {
                showModel: false,
                submitLoading: false,
                add_time: new Date(),
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                repayData: {
                    add_time: "",
                    order_id: "",
                    repay_money: 0,
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[],
                    emp_ids:[]
                },
                empRate:[],
                payMoney: "0.00",
                debt: "0.00",
                debtOrderList:{},
                columns: [
                    {
                        title: '订单号',
                        key: 'order_id'
                    },
                    {
                        title: '类 型',
                        key: 'order_type',
                        render: (h, params) => {
                            return this.globalConfig.order_types[params.row.order_type]
                        },
                        width:85
                    },
                    {
                        title: '金 额',
                        key: 'pay_money',
                        width: 85
                    },
                    {
                        title: '欠款金额',
                        key: 'debt',
                        width: 85
                    },
                    {
                        title: '收银员',
                        key: 'cashier_name',
                        width: 85
                    },
                    {
                        title: '结算时间',
                        key: 'add_time',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 85,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.selectOrder(params.row)
                                        }
                                    }
                                }, '还款')
                            ])
                        }
                    }

                ]
            }
        },
        created() {
            getOrderList({
                uid: this.currentUserData.uid,
                status: 1
            }).then((response) => {
                this.debtOrderList = response.data
            })

        },

        methods: {
            selectOrder(order) {
                this.repayData.order_id = order.order_id;
                this.repayData.repay_money = order.debt;
            },
            setMoneyRate() {
                let money = (Number(this.repayData.repay_money) / this.repayData.emp_ids.length).toFixed(2)
                this.repayData.pay_emps = []
                this.empData.forEach((item) => {
                    if(this.repayData.emp_ids.indexOf(item.emp_id) >= 0) {
                        this.repayData.pay_emps.push(
                            {
                                "emp_id": item.emp_id,
                                "emp_name": item.emp_name,
                                "money" : money
                            }
                        )
                    }
                })
            },

            replaySubmit() {
                //验证规则
                // 是否选择订单
                if(this.repayData.order_id === "") {
                    this.$Message.error('请选择要还款的订单!')
                    return
                }
                //2.还款金额是否匹配
                let total_money = Number(this.repayData.pay_cash) + Number(this.repayData.pay_card) + Number(this.repayData.pay_mobile)
                if(Number(this.repayData.repay_money) !== total_money){
                    this.$Message.error('还款金额 = 现金 + 银行卡 + 移动支付,请验证!')
                    return
                }

                //3. 检查员工业绩分配
                let emps_sum = 0
                this.repayData.pay_emps.forEach((item) => {
                    emps_sum += Number(item.money)
                })

                if(emps_sum > this.repayData.repay_money) {
                    this.$Message.error({
                        content: '员工分配金额不能大于收入金额，请认真输入!',
                        duration: 5
                    })
                    return
                }

                this.repayData.add_time = formatDate(this.add_time,"yyyy-MM-dd HH:mm:ss")
                this.repayData.uid = this.currentUserData.uid
                this.repayData.shop_id = this.userInfo.shop_id
                this.submitLoading = true
                repay(this.repayData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$Message.success('还款成功!')
                        Object.assign(this.$data, this.$options.data())
                        this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                    }
                    this.submitLoading = false
                })
            },
            goShowModel() {
                this.showModel = true
                this.add_time = new Date()
            },

            handleReset() {
                this.repayData.order_id = ""
                this.repayData.repay_money = 0
                this.repayData.pay_cash = 0
                this.repayData.pay_card = 0
                this.repayData.pay_mobile = 0
                this.repayData.pay_emps = []
                this.repayData.emp_ids = []
                this.showModel = false
            }


        }
    }
</script>

<template>
    <span>
        <Button type="ghost" @click = "showRechargeModel()" >产品卡充值</Button>
        <Modal v-model="rechargeModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>产品卡充值 - {{currentUserData.user_name}} </span>
            </p>
            <Form ref="rechargeData" :model="rechargeData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间"  v-model="add_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="产品金额" prop="good_money">
                    <Input v-model="rechargeData.good_money" placeholder="输入产品金额" style="width: 150px" @on-change = "getPayMoney"></Input> <Tag type="dot" color="red">必填</Tag>
                </Form-item>
                <hr/>
                <br/>
                <Form-item label="支付金额" prop="money">
                    <Input v-model="rechargeData.charge_money" placeholder="输入需要支付金额" style="width: 150px" @on-change = "getPayMoney"></Input> <Tag type="dot" color="red">必填</Tag>
                </Form-item>

                <Row>
                    <Col span="6">
                        <Form-item label="现金">
                            <Input v-model="rechargeData.pay_cash" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                    <Col span="6">
                        <Form-item label="银行卡">
                            <Input v-model="rechargeData.pay_card" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>

                    <Col span="6" offset = 1>
                        <Form-item label="微信/支付宝">
                            <Input v-model="rechargeData.pay_mobile" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <Form-item label="实收金额" >
                            <Tag type="border" color="green">{{ rechargeData.pay_money }} 元</Tag>
                        </Form-item>
                    </Col>
                    <Col span="8">
                         <Form-item label="欠款金额" style="color: red">
                             <Tag type="border" color="red">{{ rechargeData.debt }} 元</Tag>
                         </Form-item>
                     </Col>
                </Row>
                <p style="color: blue;text-align: center">
                    注: 实收金额 = 现金+银行卡+微信+支付宝 &nbsp;&nbsp; 欠款金额 = 支付金额-实收金额
                </p>
                <br/>
                <hr/>
                <br/>
                <Form-item label="销售人" prop="empRate">
                    <Select v-model="rechargeData.emp_ids" multiple style="width:360px" @on-change="setMoneyRate">
                        <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                    </Select> <Tag type="dot" color="red">必填</Tag>
                </Form-item>

                <Row>
                    <Col span="8" v-for="item in rechargeData.pay_emps" :key="item.emp_id">
                        <Form-item :label="item.emp_name">
                            <Input v-model="item.money"></Input>
                        </Form-item>
                    </Col>
                </Row>

                <p style="color: blue;text-align: center">
                    注: 销售人分配总金额 = 实收金额
                </p>

                <br/>
            </Form>

            <p slot="footer" style="text-align: center">
                <Button type="primary" @click="rechargeSubmit()">确认充值</Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重 置</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { chargeGoods } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            currentUserData: Object,
            empData: Array,
            userInfo: Object
        },
        data () {
            return {
                rechargeModel: false,
                add_time: new Date(),
                rechargeData: {
                    add_time: "",
                    good_money: 0,
                    charge_money: 0,
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[],
                    emp_ids: [],
                    pay_money: "0.00",
                    debt: "0.00",
                },
                ruleValidate: {

                }
            }
        },

        methods: {

            getPayMoney() {
                this.rechargeData.pay_cash = Number(this.rechargeData.pay_cash)
                this.rechargeData.pay_card = Number(this.rechargeData.pay_card)
                this.rechargeData.pay_mobile = Number(this.rechargeData.pay_mobile)
                this.rechargeData.pay_money =  Number(this.rechargeData.pay_cash) + Number(this.rechargeData.pay_card) + Number(this.rechargeData.pay_mobile)
                this.rechargeData.pay_money = this.rechargeData.pay_money.toFixed(2)
                this.rechargeData.debt      =  Number(this.rechargeData.charge_money) - this.rechargeData.pay_money
                this.rechargeData.debt      = this.rechargeData.debt.toFixed(2)
            },

            setMoneyRate() {
                let money = (Number(this.rechargeData.pay_money) / Number(this.rechargeData.emp_ids.length)).toFixed(2)
                this.rechargeData.pay_emps = []
                this.empData.forEach((item) => {
                    if(this.rechargeData.emp_ids.indexOf(item.emp_id) >= 0) {
                        this.rechargeData.pay_emps.push(
                            {
                                "emp_id": item.emp_id,
                                "emp_name": item.emp_name,
                                "money" : money
                            }
                        )
                    }
                })
            },

            rechargeSubmit() {
                //验证规则
                //产品金额
                if(!this.rechargeData.good_money) {
                    this.$Message.error('产品金额不能为空!')
                    return
                }

                //支付金额不能为空
                if(!this.rechargeData.charge_money) {
                    this.$Message.error('支付金额不能为空!')
                    return
                }

                //1.欠款不能为负数
                if(this.rechargeData.debt < 0) {
                    this.$Message.error('收银金额大于充值金额，请认真输入!')
                    return
                }
                //2.销售人金额分配不能大于实收金额
                let emps_sum = 0
                this.rechargeData.pay_emps.forEach((item) => {
                    emps_sum += Number(item.money)
                })

                if(emps_sum > this.rechargeData.pay_money) {
                    this.$Message.error({
                        content: '员工分配金额不能大于收入金额，请认真输入!',
                        duration: 5
                    })
                    return
                }

                this.rechargeData.add_time = formatDate(this.add_time,"yyyy-MM-dd HH:mm:ss")
                this.rechargeData.uid = this.currentUserData.uid
                this.rechargeData.shop_id = this.userInfo.shop_id

                chargeGoods(this.rechargeData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$Message.success('充值成功!')
                        this.rechargeModel = false
                        this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                        this.handleReset()
                    }
                })
            },


            showRechargeModel(name) {
                this.rechargeModel = true
                this.add_time = new Date()
            },

            handleReset() {
                this.rechargeData = {
                    add_time: "",
                    good_money: 0,
                    charge_money: 0,
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[],
                    emp_ids: [],
                    pay_money: "0.00",
                    debt: "0.00",
                }
            }
        }
    }
</script>

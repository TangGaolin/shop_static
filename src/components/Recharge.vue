<template>
    <span>
        <Button type="ghost" @click = "showRechargeModel('rechargeData')" >充 值</Button>
        <Modal v-model="rechargeModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>充值 - {{currentUserData.user_name}} </span>
            </p>
            <Form ref="newUserData" :model="rechargeData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间"  v-model="rechargeData.add_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="充值金额" prop="charge_money">
                    <Input v-model="rechargeData.charge_money" placeholder="输入充值金额" style="width: 200px" @on-change = "getPayMoney"></Input>
                 </Form-item>
                <hr/>
                <br/>
                <Row>
                    <Col span="6">
                        <Form-item label="现金" prop="pay_cash">
                            <Input v-model="rechargeData.pay_cash" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                    <Col span="6">
                        <Form-item label="银行卡" prop="pay_card">
                            <Input v-model="rechargeData.pay_card" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>

                    <Col span="6">
                        <Form-item label="微信" prop="pay_weixin">
                            <Input v-model="rechargeData.pay_weixin" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                    <Col span="6">
                        <Form-item label="支付宝" prop="pay_zhifubao">
                            <Input v-model="rechargeData.pay_zhifubao" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <Form-item label="实收金额" prop="user_name">
                            <Input v-model="payMoney" disabled></Input>
                        </Form-item>
                    </Col>
                    <Col span="8">
                         <Form-item label="欠款金额" prop="user_name">
                            <Input v-model=debt disabled></Input>
                         </Form-item>
                     </Col>
                </Row>
                <p style="color: red;text-align: center">
                    注: 实收金额 = 现金+银行卡+微信+支付宝 &nbsp;&nbsp; 欠款金额 = 充值金额-实收金额
                </p>
                <br/>
                <hr/>
                <br/>
                <Form-item label="选择销售人" prop="pay_emps">
                    <Select v-model="rechargeData.pay_emps" multiple style="width:260px">
                        <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <ul>
                    <li v-for="item in  rechargeData.pay_emps">
                        <Form-item :label="item" prop="user_name">
                            <Input v-model="payMoney" disabled></Input>
                        </Form-item>
                    </li>
                </ul>

                <br/>

                <br/>

            </Form>

            <p slot="footer" style="text-align: center">
                <Button type="primary" @click="handleSubmit('newUserData')">确认充值</Button>
                <Button type="ghost" @click="handleReset('newUserData')" style="margin-left: 8px">重 置</Button>
            </p>

        </Modal>
    </span>
</template>
<script>

    import { addUser } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
//            globalConfig: Object,
//            empData: Array,
            currentUserData: Object,
            empData: Array
        },
        data () {
            return {
                rechargeModel: false,
                pay_cash: 0,
                rechargeData: {
                    add_time: "",
                    charge_money: "",
                    pay_cash: 0,
                    pay_card: 0,
                    pay_weixin: 0,
                    pay_zhifubao: 0,
                    pay_emps:[]
                },
                payMoney: 0,
                debt: 0,
//
//                ruleValidate: {
//                    charge_money: [
//                        { required: true, message: '姓名不能为空', trigger: 'blur' }
//                    ],
//                    pay_cash: [
//                        { required: true, message: '手机不能为空', trigger: 'blur' }
//                    ]
//                }
            }
        },

        methods: {

            getPayMoney() {
                this.payMoney =  Number(this.rechargeData.pay_cash) + Number(this.rechargeData.pay_card) + Number(this.rechargeData.pay_weixin) + Number(this.rechargeData.pay_zhifubao)
                this.payMoney = this.payMoney.toFixed(2)
                this.debt     =  Number(this.rechargeData.charge_money) - this.payMoney
                this.debt     = this.debt.toFixed(2)
            },
//            handleSubmit (name) {
//                this.$refs[name].validate((valid) => {
//                    if (valid) {
//                        this.newUserData.add_time = formatDate(this.newUserData.add_time,"yyyy-MM-dd HH:mm:ss")
//                        this.newUserData.birthday = formatDate(this.newUserData.birthday,"yyyy-MM-dd")
//                        this.newUserData.shop_id = this.shopConfig.shop_id
//
//                        addUser(this.newUserData).then((response) => {
//                            if (0 !== response.statusCode) {
//                                this.$Message.error(response.msg)
//                                //重置时间
//                                this.newUserData.add_time = new Date()
//                                this.newUserData.birthday = ""
//                            } else {
//                                this.$Message.success('提交成功!')
//                                this.newUserModel = false
//                                this.$emit('addUser', this.newUserData)
//                            }
//                        })
//                    } else {
//                        this.$Message.error('表单验证失败!')
//                    }
//                })
//            },
//            handleReset (name) {
//                this.$refs[name].resetFields()
//            },
            showRechargeModel(name) {
                this.rechargeModel = true
//                this.$refs[name].resetFields()
                this.rechargeData.add_time = new Date()
            }
        }
    }
</script>

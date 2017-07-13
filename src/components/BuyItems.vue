<style>
    .short_input {
        width: 70px;
    }
</style>
<template>
    <span>
        <Button type="ghost" @click = "showRechargeModel('BuyItemsData')" >购买服务</Button>
        <Modal v-model="rechargeModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>购买服务 - {{currentUserData.user_name}} </span>
            </p>
            <Form ref="BuyItemsData" :model="BuyItemsData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间"  v-model="BuyItemsData.add_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="选择项目" prop="select_item">
                    <Select
                        v-model="selectItem"
                        multiple
                        filterable
                        remote
                        :remote-method="getItemList"
                        :loading="loading"
                        @on-change = "converItemData"
                    >
                        <Option v-for="item in items" :value="JSON.stringify(item)" :key="item.item_id">
                            {{ item.item_name }}
                        </Option>
                    </Select>
                </Form-item>

                <Form-item label="" prop="select_item" >
                    <Row style="border-bottom: 1px solid #ccc;font-weight: bolder">
                        <Col span="4">
                            项目名称
                        </Col>
                        <Col span="4">
                            单价
                        </Col>
                        <Col span="4">
                            次数
                        </Col>
                        <Col span="4">
                            折扣
                        </Col>
                        <Col span="4">
                            销售价
                        </Col>
                    </Row>
                    <Row v-for="item in selectedItems" :key="item.item_id" style="border-bottom: 1px solid #ccc">
                        <Col span="4">
                            {{ item.item_name }}
                        </Col>
                        <Col span="4">
                            <Tag type="border" color="green">{{item.price}}</Tag>
                        </Col>
                        <Col span="4">
                            <Input v-model = item.times class="short_input" size="small" @on-change="changeTimes(item.item_id)"></Input>
                        </Col>
                        <Col span="4">
                            <Tag type="border" color="red">{{item.discount}}</Tag>
                        </Col>
                        <Col span="4">
                            <Input v-model = item.sold_money class="short_input" size="small" @on-change="changeMoney(item.item_id)"></Input>
                        </Col>
                    </Row>
                </Form-item>

                <hr/>


                <br/>
                <Row>
                    <Col span="6">
                        <Form-item label="现金" prop="pay_cash">
                            <Input v-model="BuyItemsData.pay_cash" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                    <Col span="6">
                        <Form-item label="银行卡" prop="pay_card">
                            <Input v-model="BuyItemsData.pay_card" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>

                    <Col span="6" offset = 1>
                        <Form-item label="微信/支付宝" prop="pay_mobile">
                            <Input v-model="BuyItemsData.pay_mobile" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <Form-item label="实收金额" prop="payMoney" >
                            <Tag type="border" color="green">{{payMoney}}</Tag>
                        </Form-item>
                    </Col>
                    <Col span="8">
                         <Form-item label="欠款金额" prop="debt" style="color: red">
                             <Tag type="border" color="red">{{debt}}</Tag>
                         </Form-item>
                     </Col>
                </Row>
                <p style="color: blue;text-align: center">
                    注: 实收金额 = 现金+银行卡+微信+支付宝 &nbsp;&nbsp; 欠款金额 = 充值金额-实收金额
                </p>
                <br/>
                <hr/>
                <br/>
                <Form-item label="销售人" prop="empRate">
                    <Select v-model="empRate" multiple style="width:360px" @on-change="setMoneyRate">
                        <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Row>
                    <Col span="8" v-for="item in BuyItemsData.pay_emps" :key="item.emp_id">
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
                <Button type="primary" @click="rechargeSubmit('BuyItemsData')">确认充值</Button>
                <Button type="ghost" @click="handleReset('BuyItemsData')" style="margin-left: 8px">重 置</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { getItemList } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            currentUserData: Object,
            empData: Array
        },
        data () {
            return {
                loading: false,
                rechargeModel: false,
                selectItem: [],
                selectedItems: [],
                items:[],
                BuyItemsData: {
                    add_time: "",
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[]
                },
                empRate:[],
                payMoney: "0.00",
                debt: "0.00",

                ruleValidate: {
                    charge_money: [
                        { required: true, message: '充值金额不能为空', trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {
            getItemList(query) {
                if (query !== '') {
                    this.loading = true
                    getItemList({item_name: query}).then((response) => {
                        this.loading = false
                        if (0 !== response.statusCode) {
                            this.$Message.error(response.msg)
                        } else {
                           this.items = response.data.data
                        }
                    })
                }
            },

            converItemData() {
                this.selectedItems = []
                this.selectItem.forEach((item) => {
                    let itemObj = JSON.parse(item)
                    itemObj.times = 1
                    itemObj.discount = 10.00
                    itemObj.sold_money = itemObj.price * itemObj.times
                    this.selectedItems.push(itemObj)
                })
            },

            changeTimes(item_id) {
                this.selectedItems.forEach((item) => {
                    if(item.item_id === item_id){
                        item.sold_money = item.price * item.times
                    }
                })
            },

            changeMoney(item_id) {
                this.selectedItems.forEach((item) => {
                    if(item.item_id === item_id){
                        console.log(item.times)
                        item.discount = (item.sold_money / item.price * item.times).toFixed(2)
                    }
                })
                this.selectedItems[item_id].discount = (this.selectedItems[item_id].sold_money / this.selectedItems[item_id].price * this.selectedItems[item_id].times).toFixed(2)
            },

            getPayMoney() {
                this.payMoney =  Number(this.BuyItemsData.pay_cash) + Number(this.BuyItemsData.pay_card) + Number(this.BuyItemsData.pay_mobile)
                this.payMoney = this.payMoney.toFixed(2)
                this.debt     =  Number(this.BuyItemsData.charge_money) - this.payMoney
                this.debt     = this.debt.toFixed(2)
            },

            setMoneyRate() {
                let money = (this.payMoney / this.empRate.length).toFixed(2)
                this.BuyItemsData.pay_emps = []
                this.empData.forEach((item) => {
                    if(this.empRate.indexOf(item.emp_id) >= 0) {
                        this.BuyItemsData.pay_emps.push(
                            {
                                "emp_id": item.emp_id,
                                "emp_name": item.emp_name,
                                "money" : money
                            }
                        )
                    }
                })
            },

            rechargeSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //验证规则
                        //1.欠款不能为负数
                        if(this.debt < 0) {
                            this.$Message.error('收银金额大于充值金额，请认真输入!')
                            return
                        }
                        //2.销售人金额分配不能大于实收金额
                        let emps_sum = 0
                        this.BuyItemsData.pay_emps.forEach((item) => {
                            emps_sum += Number(item.money)
                        })

                        if(emps_sum > this.payMoney) {
                            this.$Message.error({
                                content: '员工分配金额不能大于收入金额，请认真输入!',
                                duration: 5
                            })
                            return
                        }

                        this.BuyItemsData.add_time = formatDate(this.BuyItemsData.add_time,"yyyy-MM-dd HH:mm:ss")
                        this.BuyItemsData.uid = this.currentUserData.uid
                        recharge(this.BuyItemsData).then((response) => {
                            if (0 !== response.statusCode) {
                                this.$Message.error(response.msg)
                                //重置时间
                                this.BuyItemsData.add_time = new Date()
                            } else {
                                this.$Message.success('充值成功!')
                                this.rechargeModel = false
                                this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },


            showRechargeModel(name) {
                this.rechargeModel = true
                this.BuyItemsData.add_time = new Date()
            }
        }
    }
</script>

<style>
    .short_input {
        width: 70px;
        text-align: center;
    }
</style>
<template>
    <span>
        <Button type="ghost" @click = "showBuyItemsModel('BuyItemsData')" >购买服务</Button>
        <Modal v-model="buyItemsModel" width="780" :styles="{top: '20px'}">
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>购买服务 - {{currentUserData.user_name}} </span>
            </p>
            <Form ref="BuyItemsData" :model="BuyItemsData" :rules="ruleValidate" :label-width="90">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options="options1"  v-model="add_time" style="width: 180px"></Date-picker>
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

                <Form-item label="" prop="select_item" v-if = "BuyItemsData.selectedItems.length > 0">
                    <Row style="border-bottom: 1px solid #ccc;font-weight: bolder" >
                        <Col span="4">
                            项目名称
                        </Col>
                        <Col span="4">
                            单价（元）
                        </Col>
                        <Col span="4">
                            次数（次）
                        </Col>
                        <Col span="4">
                            折扣
                        </Col>
                        <Col span="4">
                            销售价（元）
                        </Col>
                    </Row>
                    <Row v-for="item in BuyItemsData.selectedItems" :key="item.item_id" style="border-bottom: 1px solid #ccc">
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


                <Form-item label="项目合计" >
                    <Tag type="dot" color="green">{{ BuyItemsData.itemsMoney }} 元</Tag>
                </Form-item>

                <hr/>
                <br/>
                <Form-item label="使用余额">
                    <Input v-model="BuyItemsData.pay_balance" :disabled="currentUserData.balance == 0" @on-change = "getPayMoney" style="width: 180px"></Input>
                    &nbsp; &nbsp;
                    <Tag type="dot" color="yellow">{{currentUserData.balance}}元可用</Tag>
                </Form-item>

                <Form-item label="使用赠送余额">
                    <Input v-model="BuyItemsData.pay_give_balance" :disabled="currentUserData.give_balance == 0" @on-change = "getPayMoney" style="width: 180px"></Input>
                    &nbsp; &nbsp;
                    <Tag type="dot" color="yellow">{{currentUserData.give_balance}}元可用</Tag>
                </Form-item>

                <hr/>
                <br/>

                <Form-item label="需要支付金额" >
                    <Tag type="dot" color="green">{{ BuyItemsData.itemsMoney - BuyItemsData.pay_balance - BuyItemsData.pay_give_balance }} 元</Tag>
                </Form-item>

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
                    注: 实收金额 = 现金+银行卡+微信+支付宝 &nbsp;&nbsp; 欠款金额 = 消费金额 - 会员卡余额 - 实收金额
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
                <Button type="primary" :loading="submitLoading" @click="buyItemsSubmit('BuyItemsData')">
                    <span v-if="!submitLoading">确认购买</span>
                    <span v-else>Loading...</span>
                </Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重 置</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { getItemList, buyItems } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            currentUserData: Object,
            empData: Array,
            userInfo: Object
        },
        data () {
            return {
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                add_time: "",
                loading: false,
                submitLoading: false,
                buyItemsModel: false,
                selectItem: [],
                items:[],
                BuyItemsData: {
                    add_time: "",
                    selectedItems: [],
                    itemsMoney: 0,
                    pay_balance: 0,
                    pay_give_balance: 0,
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[]
                },
                empRate:[],
                payMoney: "0.00",
                debt: "0.00",

                ruleValidate: {

                }
            }
        },

        methods: {
            // 获取项目列表
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

            // 转化数据
            converItemData() {
                this.BuyItemsData.selectedItems = []
                this.BuyItemsData.itemsMoney = 0
                this.selectItem.forEach((item) => {
                    let itemObj = JSON.parse(item)
                    itemObj.discount = 10.00 //初始化
                    itemObj.sold_money = itemObj.price * itemObj.times
                    this.BuyItemsData.itemsMoney += Number(itemObj.sold_money)
                    this.BuyItemsData.selectedItems.push(itemObj)
                })
            },

            // 修改次数
            changeTimes(item_id) {
                this.BuyItemsData.selectedItems.forEach((item) => {
                    if(item.item_id === item_id){
                        item.sold_money = item.price * item.times
                    }
                })
                this.getItemsMoney()
            },

            // 修改金额
            changeMoney(item_id) {
                this.BuyItemsData.selectedItems.forEach((item) => {
                    if(item.item_id === item_id){
                        item.discount = (item.sold_money / (item.price * item.times) * 10).toFixed(2)
                    }
                })
                this.getItemsMoney()
            },

            // 计算项目总金额
            getItemsMoney() {
                this.BuyItemsData.itemsMoney = 0
                this.BuyItemsData.selectedItems.forEach((item) => {
                    this.BuyItemsData.itemsMoney += Number(item.sold_money)
                })
            },

            //计算业绩金额
            getPayMoney() {
                this.payMoney =  Number(this.BuyItemsData.pay_cash) + Number(this.BuyItemsData.pay_card) + Number(this.BuyItemsData.pay_mobile)
                this.payMoney = this.payMoney.toFixed(2)
                this.debt     =  Number(this.BuyItemsData.itemsMoney) - this.payMoney - this.BuyItemsData.pay_balance - this.BuyItemsData.pay_give_balance
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

            buyItemsSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //验证规则
                        // 购买项目不能为空
                        if(0 === this.BuyItemsData.selectedItems.length) {
                            this.$Message.error('项目不能为空，确认之后再提交!')
                            return
                        }

                        // 欠款不能为负数
                        if(this.debt < 0) {
                            this.$Message.error('收银金额大于充值金额，请认真输入!')
                            return
                        }

                        //余额使用规则
                        if(Number(this.BuyItemsData.pay_balance) > Number(this.currentUserData.balance)) {
                            this.$Message.error('余额使用不正确！')
                            return
                        }

                        //赠送余额使用规则
                        if(Number(this.BuyItemsData.pay_give_balance) > Number(this.currentUserData.give_balance)) {
                            this.$Message.error('赠送余额使用不对！')
                            return
                        }

                        // 销售人金额分配不能大于实收金额
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

                        this.BuyItemsData.add_time = formatDate(this.add_time, "yyyy-MM-dd HH:mm:ss")
                        this.BuyItemsData.uid = this.currentUserData.uid
                        this.BuyItemsData.shop_id = this.userInfo.shop_id
                        this.submitLoading = true
                        buyItems(this.BuyItemsData).then((response) => {
                            if (0 !== response.statusCode) {
                                this.$Message.error(response.msg)
                            } else {
                                this.$Message.success('购买成功!')
                                Object.assign(this.$data, this.$options.data())
                                this.handleReset()
                                this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                            }
                            this.submitLoading = false
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },

            handleReset() {
                //清空数据
                this.BuyItemsData = {
                    add_time: "",
                    selectedItems: [],
                    itemsMoney: 0,
                    pay_balance: 0,
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    pay_emps:[]
                }
                this.empRate = []
                this.selectItem = []
                this.payMoney = "0.00"
                this.debt = "0.00"
            },

            showBuyItemsModel() {
                this.buyItemsModel = true
                this.add_time = new Date()
            }
        }
    }
</script>

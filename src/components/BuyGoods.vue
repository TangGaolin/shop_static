<style>
    .short_input {
        width: 70px;
    }
</style>
<template>
    <span>
        <Button type="ghost" @click = "showBuyItemsModel('BuyGoodsData')" >购买产品</Button>
        <Modal v-model="showModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>购买产品 - {{currentUserData.user_name}} </span>
            </p>
            <Form ref="BuyGoodsData" :model="BuyGoodsData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options="options1"  v-model="add_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="选择产品" prop="select_item">
                    <Select
                        v-model="selectGoods"
                        multiple
                        filterable
                        remote
                        :remote-method="getGoodsList"
                        :loading="loading"
                        @on-change = "converGoodsData"
                    >
                        <Option v-for="item in goods" :value="JSON.stringify(item)" :key="item.good_id">
                            {{ item.good_name }}
                        </Option>
                    </Select>
                </Form-item>

                <Form-item label="" prop="select_item" v-if = "BuyGoodsData.selectedGoods.length > 0">
                    <Row style="border-bottom: 1px solid #ccc;font-weight: bolder" >
                        <Col span="4">
                            产品名称
                        </Col>
                        <Col span="4">
                            售价（元）
                        </Col>
                        <Col span="4">
                            数量
                        </Col>
                        <Col span="4">
                            折扣
                        </Col>
                        <Col span="4">
                            金额（元）
                        </Col>
                    </Row>
                    <Row v-for="item in BuyGoodsData.selectedGoods" :key="item.good_id" style="border-bottom: 1px solid #ccc">
                        <Col span="4">
                            {{ item.good_name }}
                        </Col>
                        <Col span="4">
                            <Tag type="border" color="green">{{item.price}}</Tag>
                        </Col>
                        <Col span="4">
                            <Input v-model = item.num class="short_input" size="small" @on-change="changeNum(item.good_id)"></Input>
                        </Col>
                        <Col span="4">
                            <Tag type="border" color="red">{{item.discount}}</Tag>
                        </Col>
                        <Col span="4">
                            <Input v-model = item.sold_money class="short_input" size="small" @on-change="changeMoney(item.good_id)"></Input>
                        </Col>
                    </Row>


                </Form-item>
                <Form-item label="消费总计" >
                    <Tag type="dot" color="green">{{ BuyGoodsData.goodsMoney }} 元</Tag>
                </Form-item>
                <hr/>
                <br/>

                <Form-item label="使用余额">
                    <Input v-model="BuyGoodsData.pay_balance" @on-change = "getPayMoney" style="width: 180px"></Input>
                    &nbsp;
                    <Tag type="dot" color="yellow">{{currentUserData.balance}}元可用</Tag>
                </Form-item>

                <Form-item label="使用产品卡">
                    <Input v-model="BuyGoodsData.use_good_money" @on-change = "getPayMoney" style="width: 180px"></Input>
                    &nbsp;
                    <Tag type="dot" color="yellow">{{currentUserData.good_money}}元可用</Tag>
                </Form-item>

                <Row>
                    <Col span="6">
                        <Form-item label="现金" prop="pay_cash">
                            <Input v-model="BuyGoodsData.pay_cash" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>
                    <Col span="6">
                        <Form-item label="银行卡" prop="pay_card">
                            <Input v-model="BuyGoodsData.pay_card" @on-change = "getPayMoney"></Input>
                        </Form-item>
                    </Col>

                    <Col span="6" offset = 1>
                        <Form-item label="微信/支付宝" prop="pay_mobile">
                            <Input v-model="BuyGoodsData.pay_mobile" @on-change = "getPayMoney"></Input>
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
                    <Col span="8" v-for="item in BuyGoodsData.pay_emps" :key="item.emp_id">
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
                <Button type="primary" @click="buyItemsSubmit('BuyGoodsData')">确认购买</Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重 置</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { getGoodsList,buyGoods } from '../api/api'
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
                loading: false,
                showModel: false,
                selectGoods: [],
                goods:[],
                add_time: "",
                BuyGoodsData: {
                    add_time: "",
                    selectedGoods: [],
                    goodsMoney: 0,
                    pay_balance: 0,
                    use_good_money: 0,
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

            //获取产品列表
            getGoodsList(query) {
                if (query !== '') {
                    this.loading = true
                    getGoodsList({good_name: query}).then((response) => {
                        this.loading = false
                        if (0 !== response.statusCode) {
                            this.$Message.error(response.msg)
                        } else {
                            this.goods = response.data.data
                        }
                    })
                }
            },


            //选择商品时转化数据
            converGoodsData() {
                this.BuyGoodsData.selectedGoods = []
                this.BuyGoodsData.goodsMoney = 0
                this.selectGoods.forEach((item) => {
                    let goodObj = JSON.parse(item)
                    goodObj.discount = 10.00 //初始化
                    goodObj.num = 1 //初始化
                    goodObj.sold_money = goodObj.price * goodObj.num
                    this.BuyGoodsData.goodsMoney += Number(goodObj.sold_money)
                    this.BuyGoodsData.selectedGoods.push(goodObj)
                })
            },


            // 修改商品数量
            changeNum(good_id) {
                this.BuyGoodsData.selectedGoods.forEach((item) => {
                    if(item.good_id === good_id){
                        item.sold_money = item.price * item.num
                    }
                })
                this.getGoodsMoney()
            },

            // 修改金额
            changeMoney(good_id) {
                this.BuyGoodsData.selectedGoods.forEach((item) => {
                    if(item.good_id === good_id){
                        item.discount = (item.sold_money / (item.price * item.num) * 10).toFixed(2)
                    }
                })
                this.getGoodsMoney()
            },

            // 计算项目总金额
            getGoodsMoney() {
                this.BuyGoodsData.goodsMoney = 0
                this.BuyGoodsData.selectedGoods.forEach((item) => {
                    this.BuyGoodsData.goodsMoney += Number(item.sold_money)
                })
            },

            //计算业绩金额
            getPayMoney() {
                this.payMoney =  Number(this.BuyGoodsData.pay_cash) + Number(this.BuyGoodsData.pay_card) + Number(this.BuyGoodsData.pay_mobile)
                this.payMoney = this.payMoney.toFixed(2)
                this.debt     =  Number(this.BuyGoodsData.goodsMoney) - this.payMoney - this.BuyGoodsData.pay_balance - this.BuyGoodsData.use_good_money
                this.debt     = this.debt.toFixed(2)
            },

            setMoneyRate() {
                let money = (this.payMoney / this.empRate.length).toFixed(2)
                this.BuyGoodsData.pay_emps = []
                this.empData.forEach((item) => {
                    if(this.empRate.indexOf(item.emp_id) >= 0) {
                        this.BuyGoodsData.pay_emps.push(
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
                        if(0 === this.BuyGoodsData.selectedGoods.length) {
                            this.$Message.error('项目不能为空，确认之后再提交!')
                            return
                        }

                        // 欠款不能为负数
                        if(this.debt < 0) {
                            this.$Message.error('收银金额大于充值金额，请认真输入!')
                            return
                        }
                        // 销售人金额分配不能大于实收金额
                        let emps_sum = 0
                        this.BuyGoodsData.pay_emps.forEach((item) => {
                            emps_sum += Number(item.money)
                        })

                        if(emps_sum > this.payMoney) {
                            this.$Message.error({
                                content: '员工分配金额不能大于收入金额，请认真输入!',
                                duration: 5
                            })
                            return
                        }
                        this.BuyGoodsData.add_time = formatDate(this.add_time,"yyyy-MM-dd HH:mm:ss")
                        this.BuyGoodsData.uid = this.currentUserData.uid
                        this.BuyGoodsData.shop_id = this.userInfo.shop_id
                        buyGoods(this.BuyGoodsData).then((response) => {
                            if (0 !== response.statusCode) {
                                this.$Message.error(response.msg)
                            } else {
                                this.$Message.success('购买成功!')
                                location.reload()
//                                this.showModel = false
//                                this.$refs[name].resetFields()
//                                Object.assign(this.$data, this.$options.data())
//                                this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },

            handleReset () {
                this.BuyGoodsData.add_time = new Date()
                this.BuyGoodsData.selectedItems = []
                this.BuyGoodsData.pay_balance = 0
                this.BuyGoodsData.use_good_money = 0
                this.BuyGoodsData.pay_cash = 0
                this.BuyGoodsData.pay_card = 0
                this.BuyGoodsData.pay_mobile = 0
                this.BuyGoodsData.itemsMoney = 0
                this.BuyGoodsData.pay_emps = []
            },

            showBuyItemsModel() {
                this.showModel = true
                this.add_time = new Date()
            }
        }
    }
</script>

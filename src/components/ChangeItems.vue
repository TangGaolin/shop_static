<style>
    .div-border {
        border: 1px solid #ccc;
        border-radius: 5px;
    }


</style>

<template>
    <span>
        <Button type="ghost" style="color: blue;border-color: blue" @click = "goShowModel()" >退 换</Button>
        <Modal v-model="showModel" width="780" >
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="cash" size="18"></Icon>
                <span>退换 - {{currentUserData.user_name}} </span>
            </p>

            <Form ref="changeItemsData" :model="changeItemsData"  :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options = options1 :value= add_time style="width: 180px"></Date-picker>
                </Form-item>

                <h2 style="text-align: center">现有项目</h2>
                <Table size = "small" stripe :columns="columns" :data="userItems.data"></Table>
                <br/>
                <p style="float: right; display: inline-block">
                    <Page size = "small" :total = userItems.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
                </p>

                <br/>
                <br/>
                <div v-if = "changeItemsData.select_items.length > 0" class="div-border">
                    <Row style="border-bottom: 1px solid #ccc;font-weight: bolder;text-align: center" >
                    <h2 style="text-align: center">选择退的项目</h2>
                    <Col span="5">
                        项目名称
                        </Col>
                        <Col span="5">
                        购买单价(元)
                        </Col>
                        <Col span="5">
                        要退次数(次)
                        </Col>
                        <Col span="5">
                        应退金额
                        </Col>
                        <Col span="4">
                        操作
                        </Col>
                    </Row>

                    <Row v-for="item in changeItemsData.select_items" :key="item.item_id" style="border-bottom: 1px solid #ccc;text-align: center">
                        <Col span="5">
                            <Tag type="border"> {{ item.item_name }} </Tag>
                        </Col>
                        <Col span="5">
                            <Tag type="border" color="green">{{item.sold_price}}</Tag>
                        </Col>
                        <Col span="5">
                            <Input v-model = item.change_times class="short_input" size="small" @on-change="changeTimes(item.id)"></Input>
                        </Col>
                        <Col span="5">
                            <Tag type="border" color="red">{{ item.change_money }}</Tag>
                        </Col>
                        <Col span="4">
                            <Button size="small" @click="delSelectItem(item.id)">删除</Button>
                        </Col>
                    </Row>
                </div>
                <br/>

                <Form-item label="金额总计" v-if="changeItemsData.itemsMoney">
                    <Tag type="dot" color="green">{{ changeItemsData.itemsMoney }} 元</Tag>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="success" @click="newItem" >{{ newItemCtrlBtn }}</Button>
                </Form-item>
                <!--换购区域-->
                <div v-if="newItemCtrl && changeItemsData.select_items.length > 0" class="div-border">
                    <h2 style="text-align: center">选择换购项目</h2>
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

                    <Form-item label="" prop="select_item" v-if = "changeItemsData.selectedNewItems.length > 0">
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
                        <Row v-for="item in changeItemsData.selectedNewItems" :key="item.item_id" style="border-bottom: 1px solid #ccc">
                            <Col span="4">
                                {{ item.item_name }}
                            </Col>
                            <Col span="4">
                                <Tag type="border" color="green">{{item.price}}</Tag>
                            </Col>
                            <Col span="4">
                                <Input v-model = item.times class="short_input" size="small" @on-change="changeNewTimes(item.item_id)"></Input>
                            </Col>
                            <Col span="4">
                                <Tag type="border" color="red">{{item.discount}}</Tag>
                            </Col>
                            <Col span="4">
                                <Input v-model = item.sold_money class="short_input" size="small" @on-change="changeNewMoney(item.item_id)"></Input>
                            </Col>
                        </Row>
                    </Form-item>

                    <Form-item label="消费总计" >
                        <Tag type="dot" color="green">{{ changeItemsData.newItemMoney }} 元</Tag>
                    </Form-item>
                </div>

                <br/>



                <div v-if="changeItemsData.select_items.length > 0" class="div-border">

                    <h3 style="text-align: center">结算区</h3>

                    <Form-item label="本单手续费"  >
                        <Input v-model="changeItemsData.change_fee" style="width: 100px;" @on-change = "getPayMoney"></Input> 元
                    </Form-item>
                    <Form-item label="最后交易额">
                        <Tag type="dot" color="red">
                            {{ Number(-changeItemsData.itemsMoney) + Number(changeItemsData.newItemMoney) + Number(changeItemsData.change_fee) }}
                        </Tag>
                         元
                    </Form-item>


                    <Row>
                        <Col span="6">
                            <Form-item label="现金">
                                <Input v-model="changeItemsData.pay_cash" @on-change = "getPayMoney"></Input>
                            </Form-item>
                        </Col>

                        <Col span="6">
                            <Form-item label="银行卡">
                                <Input v-model="changeItemsData.pay_card" @on-change = "getPayMoney"></Input>
                            </Form-item>
                        </Col>

                        <Col span="6" offset = 1>
                            <Form-item label="微信/支付宝">
                                <Input v-model="changeItemsData.pay_mobile" @on-change = "getPayMoney"></Input>
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


                    <Form-item label="销售人" prop="empRate">
                        <Select v-model="changeItemsData.emp_ids" multiple style="width:360px" @on-change="setMoneyRate">
                            <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                        </Select>
                    </Form-item>

                    <Row>
                        <Col span="8" v-for="item in changeItemsData.pay_emps" :key="item.emp_id">
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
                <Button type="primary" @click="changeSubmit()">确认退换</Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">取 消</Button>
            </p>
        </Modal>
    </span>
</template>
<script>

    import { changeItems, getItemList } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            currentUserData: Object,
            userItems: Object,
            empData: Array,
            userInfo: Object,
            globalConfig:Object
        },
        data () {
            return {
                showModel: false,
                add_time: new Date(),
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },

                loading: false,
                curPage: 1,
                limit: 10,
                columns: [
                    {
                        title: '项目名称',
                        key: 'item_name'
                    },
                    {
                        title: '购买金额',
                        key: 'sold_money'
                    },
                    {
                        title: '购买折扣',
                        key: 'discount'
                    },
                    {
                        title: '总次数',
                        key: 'times'
                    },
                    {
                        title: '剩余次数',
                        key: 'used_times',
                        render: (h, params) => {
                            return params.row.times - params.row.used_times
                        }
                    },

                    {
                        title: '剩余金额',
                        key: 'now_money'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return !params.row.status ? h('div', [
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
                                            this.selectItems(params.row)
                                        }
                                    }
                                }, '退换')
                            ]) : "使用结束"
                        }
                    }
                ],

                items:[],  // 查询到的项目数据
                selectItem: [], //转化之后项目数据
                changeItemsData: {
                    select_items: [],
                    select_items_ids:[],
                    itemsMoney:0,
                    selectedNewItems:[],
                    newItemMoney:0,
                    pay_emps:[],
                    emp_ids:[],
                    pay_cash: 0,
                    pay_card: 0,
                    pay_mobile: 0,
                    use_balance: 0,
                    change_fee: 0, //手续费
                },
                newItemCtrl: false,
                newItemCtrlBtn: "换购",
                payMoney: "0.00",
                debt: "0.00",

            }
        },
        created() {

        },

        methods: {
            //选择要退的项目
            selectItems(param) {
                if(this.changeItemsData.select_items_ids.indexOf(param.id) < 0){
                    let item = {
                        id: param['id'],
                        order_id: param['order_id'],
                        item_id: param['item_id'],
                        item_name: param['item_name'],
                        times: param['times'],
                        used_times: param['used_times'],
                        sold_price: param['sold_price'],
                        change_times: 1,
                        change_money: (param['sold_price'] * 1).toFixed(2)
                    }
                    this.changeItemsData.select_items_ids.push(param.id)
                    this.changeItemsData.select_items.push(item)
                    this.getItemsMoney()
                }
            },
            //计算金额
            getItemsMoney() {
                this.changeItemsData.itemsMoney = 0
                this.changeItemsData.select_items.forEach((item) => {
                    this.changeItemsData.itemsMoney += Number(item.change_money)
                })
            },
            //修改次数
            changeTimes(id) {
                this.changeItemsData.select_items.forEach((item) => {
                    if(item.id === id){
                        item.change_money = item.sold_price * item.change_times
                    }
                })
                this.getItemsMoney()
            },

            //删除选择的项目
            delSelectItem(id) {
                let index = this.changeItemsData.select_items_ids.indexOf(id)
                this.changeItemsData.select_items.splice(index, 1)
                this.changeItemsData.select_items_ids.splice(index, 1)
                this.getItemsMoney()
            },

            // 控制是否购买新项目
            newItem() {
                this.newItemCtrl = !this.newItemCtrl
                this.newItemCtrlBtn = this.newItemCtrl ? "取消换购" : "换购"
                if(!this.newItemCtrl) {
                    this.changeItemsData.selectedNewItems = []
                    this.changeItemsData.newItemMoney = 0
                    this.selectItem = []
                }
            },
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

            // 转化项目数据
            converItemData() {
                this.changeItemsData.selectedNewItems = []
                this.changeItemsData.newItemMoney = 0
                this.selectItem.forEach((item) => {
                    let itemObj = JSON.parse(item)
                    itemObj.discount = 10.00 //初始化
                    itemObj.times = 1 //初始化
                    itemObj.sold_money = itemObj.price * 1
                    this.changeItemsData.newItemMoney += Number(itemObj.sold_money)
                    this.changeItemsData.selectedNewItems.push(itemObj)
                })
            },

            // 修改新项目次数
            changeNewTimes(item_id) {
                this.changeItemsData.selectedNewItems.forEach((item) => {
                    if(item.item_id === item_id){
                        item.sold_money = item.price * item.times
                    }
                })
                this.getNewItemsMoney()
            },

            // 修改新项目金额
            changeNewMoney(item_id) {
                this.changeItemsData.selectedNewItems.forEach((item) => {
                    if(item.item_id === item_id){
                        item.discount = (item.sold_money / (item.price * item.times) * 10).toFixed(2)
                    }
                })
                this.getNewItemsMoney()
            },

            // 计算项目总金额
            getNewItemsMoney() {
                this.changeItemsData.newItemMoney = 0
                this.changeItemsData.selectedNewItems.forEach((item) => {
                    this.changeItemsData.newItemMoney += Number(item.sold_money)
                })
            },

            //计算业绩金额
            getPayMoney() {
                this.payMoney = Number(this.changeItemsData.pay_cash) + Number(this.changeItemsData.pay_card) + Number(this.changeItemsData.pay_mobile)
                this.payMoney = this.payMoney.toFixed(2)
                let last_money= Number(-this.changeItemsData.itemsMoney) + Number(this.changeItemsData.newItemMoney) + Number(this.changeItemsData.change_fee)
                this.debt     = last_money - this.payMoney
                this.debt     = this.debt.toFixed(2)
            },

            setMoneyRate() {
                let money = (Number(this.payMoney) / this.changeItemsData.emp_ids.length).toFixed(2)
                if(money < 0){
                    money = 0
                }
                this.changeItemsData.pay_emps = []
                this.empData.forEach((item) => {
                    if(this.changeItemsData.emp_ids.indexOf(item.emp_id) >= 0) {
                        this.changeItemsData.pay_emps.push(
                            {
                                "emp_id": item.emp_id,
                                "emp_name": item.emp_name,
                                "money" : money
                            }
                        )
                    }
                })
            },

            changeSubmit() {
                this.changeItemsData.add_time = formatDate(this.add_time, "yyyy-MM-dd HH:mm:ss")
                this.changeItemsData.uid = this.currentUserData.uid
                this.changeItemsData.shop_id = this.userInfo.shop_id
                changeItems(this.changeItemsData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$Message.success('购买成功!')
                        this.buyItemsModel = false

                        this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                    }
                })
            },
            goShowModel() {
                this.showModel = true
                this.add_time = new Date()
            },

            handleReset() {

                this.showModel = false
            },

            changePage(page) {
                this.curPage = page
                this.$store.dispatch('getUserItems', {
                    uid: this.currentUserData.uid,
                    cur_page: page,
                    limit: this.limit
                })
            },
        }
    }
</script>

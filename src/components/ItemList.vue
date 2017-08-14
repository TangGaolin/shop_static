<style>
    .select-items {
        border: 1px solid #ccc;
        border-radius: 5px;
    }
</style>

<template>
    <div>

        <div class="select-items" v-if="selectedItems.length > 0">
            <h3 style="text-align: center">已选择项目</h3>
            <Row style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;font-weight: bolder;text-align: center">
                <Col span="4">
                项目名称
                </Col>
                <Col span="4">
                消耗单价(元)
                </Col>
                <Col span="4">
                消耗次数
                </Col>
                <Col span="6">
                服务人员
                </Col>
                <Col span="4">
                操作
                </Col>
            </Row>


            <Row v-for="item in selectedItems" :key="item.item_id" style="border-bottom: 1px solid #ccc;text-align: center">
                <Col span="4">
                    <Tag  type="border"  color="blue"> {{ item.item_name }} </Tag>
                </Col>
                <Col span="4">
                    <Tag  type="border"   color="blue"> {{ item.sold_price }} </Tag>
                </Col>
                <Col span="4">
                    <Tag type="border" color="green" > {{item.use_time}} </Tag>
                </Col>
                <Col span="6">
                    <Tag type="border" color="green" v-for="emp in item.emps" :key="emp.emp_id"> {{emp.emp_name}}({{emp.fee}}) </Tag>
                    <Tag v-if="item.emps.length < 1">未选择</Tag>
                </Col>
                <Col span="4">
                    <Button type="success" size="small" @click="editUserItem(item.id)">编辑</Button>
                    <Button type="warning" size="small" @click="delUserItem(item.id)" >删除</Button>
                </Col>
            </Row>


            <Form  :label-width="100" style="text-align: center;">
                <Form-item label="选择消耗时间" style="text-align: center;margin-bottom: 0px">
                    <Date-picker type="datetime" placeholder="选择日期和时间"  v-model="useItemTime" style="width: 180px" ></Date-picker>
                </Form-item>
            </Form>


            <p style="text-align: center">
                <Button type="primary" @click="useItemsSubmit()"  size="small" >确认耗卡</Button>
                <Button type="ghost" @click="resetItemData()" style="margin-left: 8px"  size="small">重 置</Button>
            </p>
        </div>

        <br/>

        <Table stripe :columns="columns" :data="userItems.data"></Table>
        <br/>
        <p style="float: right; display: inline-block">
            <Page :total = userItems.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
        </p>


        <Modal v-model="editItemModel" width="680">
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="navicon" size="18"></Icon>
                <span>编辑服务信息 - {{currentItem.item_name}} </span>
            </p>
            <Form ref="BuyItemsData" :model="currentItem" :rules="ruleValidate" :label-width="80">
                <Form-item label="消耗次数">
                    <Input-number  v-model="currentItem.use_time" @on-change = "" style="width: 80px" @on-change = "changeUseItem()"></Input-number>
                </Form-item>
                <Row>
                    <Col span="10">
                        <Form-item label="手工单价">
                            <Tag type="dot" color="blue">{{currentItem.emp_fee}} 元</Tag>
                        </Form-item>
                    </Col>
                    <Col span="10">
                        <Form-item label="单次消耗">
                            <Tag type="dot" color="green">{{currentItem.sold_price}}元</Tag>
                        </Form-item>
                    </Col>
                </Row>

                <Form-item label="服务销售人" prop="empRate">
                    <Select v-model="currentItem.emp_ids" multiple style="width:360px" @on-change="setMoneyRate">
                        <Option v-for="item in empData" :value="item.emp_id" :key="item.emp_id">{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Row>
                    <Col span="8" v-for="item in currentItem.emps" :key="item.emp_id">
                        <Form-item :label="item.emp_name">
                            <Input v-model="item.fee" icon="social-usd-outline"></Input>
                            <Input v-model="item.xiaohao" icon="coffee"></Input>
                        </Form-item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </div>



</template>
<script>

    import { useItems } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            userItems: Object,
            currentUserData: Object,
            globalConfig: Object,
            empData: Array,
            userInfo:Object
        },
        data() {
            return {
                editItemModel: false,
                curPage:1,
                limit: 10,
                select_item_ids:[],
                useItemTime:"",
                selectedItems:[],
                currentItem:{},
                ruleValidate: {

                },
                columns: [
                    {
                        title: '项目名称',
                        key: 'item_name'
                    },
                    {
                        title: '购买价格(元)',
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
                                            this.useItem(params.row)
                                        }
                                    }
                                }, '耗卡')
                            ]) : "使用结束"
                        }
                    }
                ]
            }
        },

        watch: {
            // 如果路由有变化，清空相关数据
            '$route': 'resetItemData'
        },
        methods: {
            resetItemData(){
                this.select_item_ids = [];
                this.selectedItems = [];
            },

            changePage(page) {
                this.curPage = page
                this.$store.dispatch('getUserItems', {
                    uid: this.currentUserData.uid,
                    cur_page: page,
                    limit: this.limit
                })
            },

            useItem(param) {
                this.useItemTime = new Date()
                if(this.select_item_ids.indexOf(param.id) < 0){
                    let item = {
                        order_id: param['order_id'],
                        use_time: 1,
                        times: param['times'],
                        used_times: param['used_times'],
                        item_name: param['item_name'],
                        item_id: param['item_id'],
                        id: param['id'],
                        sold_price: param['sold_price'],
                        emp_fee: param['emp_fee'],
                        emp_ids:[],
                        emps:[]
                    }
                    this.selectedItems.push(item)
                    this.select_item_ids.push(param.id)
                }else{
                    this.$Message.error('请勿重复选择')
                }
            },

            delUserItem(id){
                let index = this.select_item_ids.indexOf(id)
                this.selectedItems.splice(index,1)
                this.select_item_ids.splice(index,1)
            },

            editUserItem(id){
                this.selectedItems.forEach((item) =>{
                    if(item.id === id){
                        this.currentItem = item;
                    }
                })
                this.editItemModel = true
            },

            setMoneyRate() {
                let fee = (this.currentItem.emp_fee * this.currentItem.use_time / this.currentItem.emp_ids.length).toFixed(2)
                let xiaohao = (this.currentItem.sold_price * this.currentItem.use_time / this.currentItem.emp_ids.length).toFixed(2)
                this.currentItem.emps = []
                this.empData.forEach((item) => {
                    if(this.currentItem.emp_ids.indexOf(item.emp_id) >= 0) {
                        this.currentItem.emps.push(
                            {
                                "emp_id"  : item.emp_id,
                                "emp_name": item.emp_name,
                                "fee"     : fee,
                                "xiaohao" : xiaohao,
                            }
                        )
                    }
                })
            },

            changeUseItem() {
                //修改次数之后 这就重新选择员工
                this.currentItem.emps = [];
                this.currentItem.emp_ids = [];
            },

            useItemsSubmit() {

                //确认是否选择服务人员  确认耗卡次数是否正确  耗卡金额
                let item = {}, use_money = 0, fee = 0
                for(let i = 0; i < this.selectedItems.length; i += 1){
                    item =  this.selectedItems[i]
                    if(item.emps.length < 1){
                        this.$Message.warning('请选择服务人员!')
                        return
                    }
                    if(item.use_time + item.used_times > item.times){
                        this.$Message.warning(item.item_name + "消耗次数不正确，请验证")
                        return
                    }
                    //检查分配手工和消耗金额是否真确
                    item.emps.forEach((emp) =>{
                        fee += Number(emp.fee)
                        use_money += Number(emp.xiaohao)
                    });

                    console.log(fee)
                    console.log(use_money)
                    console.log(Number(item.emp_fee) * Number(item.use_time))

                    if(fee > (Number(item.emp_fee) * Number(item.use_time))){
                        this.$Message.warning(item.item_name + "手工数据不正确")
                        return
                    }

                    if(use_money > Number(item.sold_price) * Number(item.use_time)){
                        this.$Message.warning(item.item_name + "消耗数据不正确")
                        return
                    }
                }

                let add_time = formatDate(this.useItemTime,"yyyy-MM-dd HH:mm:ss")
                let param = {
                    uid: this.currentUserData.uid,
                    shop_id: this.userInfo.shop_id,
                    select_items: this.selectedItems,
                    add_time: add_time
                }
                useItems(param).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$Message.success('耗卡成功!')
                        this.resetItemData()
                        this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                    }
                })
            }

        }

    }


</script>

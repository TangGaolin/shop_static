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




        <Modal v-model="editItemModel">
            <p slot="header" style="color:#f60;text-align:center;font-size: 18px">
                <Icon type="navicon" size="18"></Icon>
                <span>编辑服务信息 - {{currentItem.item_name}} </span>
            </p>
            <Form ref="BuyItemsData" :model="currentItem" :rules="ruleValidate" :label-width="80">
                <Form-item label="消耗次数">
                    <Input v-model="currentItem.use_time" @on-change = "" style="width: 180px"></Input>
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
                            <Input v-model="item.fee"></Input>
                        </Form-item>
                    </Col>
                </Row>
            </Form>

            <p slot="footer" style="text-align: center">
                <Button type="primary">确认</Button>
            </p>
        </Modal>
    </div>



</template>
<script>

    export default {
        props: {
            userItems: Object,
            currentUserData: Object,
            globalConfig: Object,
            empData: Array
        },
        data() {
            return {
                editItemModel: false,
                curPage:1,
                limit: 10,
                select_item_ids:[],
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
                                            this.useItem(params.row)
                                        }
                                    }
                                }, '耗卡')
                            ]);
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
                this.cur_page = page
                this.$store.dispatch('getUserOrderList', {
                    uid: this.currentUserData.uid,
                    cur_page: page,
                    limit: this.limit
                })
            },

            useItem(param) {
                if(this.select_item_ids.indexOf(param.id) < 0){
                    let item = {
                        order_id: param['order_id'],
                        use_time: 1,
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
                this.currentItem.emps = []
                this.empData.forEach((item) => {
                    if(this.currentItem.emp_ids.indexOf(item.emp_id) >= 0) {
                        this.currentItem.emps.push(
                            {
                                "emp_id": item.emp_id,
                                "emp_name": item.emp_name,
                                "fee" : fee
                            }
                        )
                    }
                })
            },

            useItemsSubmit() {
                console.log(this.currentItem);
            }

        }

    }


</script>

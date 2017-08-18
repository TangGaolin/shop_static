<style>
    .select-items {
        border: 1px solid #ccc;
        border-radius: 5px;
    }
</style>

<template>
    <div>
        <useItem
                :select_item_ids = select_item_ids
                :selectedItems = selectedItems
                :currentUserData = currentUserData
                :empData = empData
                :userInfo = userInfo
                v-on:resetItemData = resetItemData
        ></useItem>
        <br/>
        <Table stripe :columns="columns" :data="userItems.data"></Table>
        <br/>
        <p style="float: right; display: inline-block">
            <Page :total = userItems.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
        </p>
    </div>

</template>
<script>

    import { useItems } from '../api/api'
    import { formatDate } from '../utils/utils'
    import useItem from './useItem.vue'
    export default {
        components: { useItem },
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
                                }, '耗卡'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changeItem(params.row)
                                        }
                                    }
                                }, '退换')
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
            // 项目卡翻页
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

            changeItem(param) {
                console.log(param)
            }

        }

    }


</script>

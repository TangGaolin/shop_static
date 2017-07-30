<template>
    <div>
        <Table stripe :columns="columns" :data="userItems.data"></Table>
        <br/>
        <div style="float: right;">
            <Page :total = userItems.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
        </div>

        <div>
            <Row v-for="item in useItemData.selectedItems" :key="item.item_id" style="border-bottom: 1px solid #ccc">
                <Col span="4">
                    {{ item.item_name }}
                </Col>
                <!--<Col span="4">-->
                <!--<Tag type="border" color="green">{{item.price}}</Tag>-->
                <!--</Col>-->
                <!--<Col span="4">-->
                <!--<Input v-model = item.times class="short_input" size="small" @on-change="changeTimes(item.item_id)"></Input>-->
                <!--</Col>-->
                <!--<Col span="4">-->
                <!--<Tag type="border" color="red">{{item.discount}}</Tag>-->
                <!--</Col>-->
                <!--<Col span="4">-->
                <!--<Input v-model = item.sold_money class="short_input" size="small" @on-change="changeMoney(item.item_id)"></Input>-->
                <!--</Col>-->
            </Row>
        </div>


    </div>



</template>
<script>

    export default {
        props: {
            userItems: Object,
            currentUserData: Object,
            globalConfig: Object
        },
        data() {
            return {
                curPage:1,
                limit: 10,
                select_item_ids:[],
                useItemData: {
                    selectedItems: []
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

        methods: {
            changePage(page) {
                this.cur_page = page
                this.$store.dispatch('getUserOrderList', {
                    uid: this.currentUserData.uid,
                    cur_page: page,
                    limit: this.limit
                })
            },

            useItem(param) {
                console.log(param)
                if(this.select_item_ids.indexOf(param.id) < 0){
                    this.useItemData.selectedItems.push(param)
                    this.select_item_ids.push(param.id)
                }else{
                    this.$Message.error('请勿重复选择')
                }
            }
        }

    }


</script>

<template>
    <div>
        <Table stripe :columns="columns" :data="useOrderList.data"></Table>
        <br/>
        <div style="float: right;">
            <Page :total = useOrderList.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
        </div>
    </div>

</template>
<script>
    import expandRow from './UseOrderInfoTableRow.vue'
    export default {
        components: { expandRow },
        props: {
            useOrderList: Object,
            currentUserData: Object,
            globalConfig: Object
        },
        data() {
            return {
                curPage:1,
                limit: 10,
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    rows: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '流水号',
                        key: 'use_order_id'
                    },
                    {
                        title: '消耗金额(元)',
                        key: 'use_money'
                    },
                    {
                        title: '操作项目',
                        key: 'items_info',
                        render: (h, params) => {
                            let item_names = [];
                            params.row.items_info.forEach((item) => {
                                item_names.push(item.item_name)
                            })
                            return item_names.join(',')
                        }
                    },
                    {
                        title: '收银员',
                        key: 'cashier_name'
                    },
                    {
                        title: '结算时间',
                        key: 'add_time'
                    },

                ]
            }
        },

        methods: {
            changePage(page) {
                this.cur_page = page
                this.$store.dispatch('getUseOrders', {
                    uid: this.currentUserData.uid,
                    cur_page: page,
                    limit: this.limit
                })
            }
        }

    }


</script>

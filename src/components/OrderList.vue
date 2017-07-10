<template>
    <div>
        <Table stripe :columns="columns" :data="userOrders.data"></Table>
        <br/>
        <div style="float: right;">
            <Page :total = userOrders.totalSize :page-size = limit :current = curPage @on-change="changePage"></Page>
        </div>
    </div>



</template>
<script>

    export default {
        props: {
            userOrders: Object,
            currentUserData: Object
        },
        data() {
            return {
                curPage:1,
                limit: 10,
                columns: [
                    {
                        title: '订单号',
                        key: 'order_id'
                    },
                    {
                        title: '类 型',
                        key: 'order_type',
                        render: (h, params) => {
                            return params.row.order_type == 0 ? "充值" : "其他";
                        }
                    },
                    {
                        title: '金 额',
                        key: 'pay_money'
                    },
                    {
                        title: '订单状态',
                        key: 'status'
                    },
                    {
                        title: '结算时间',
                        key: 'add_time'
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
            }
        }

    }


</script>

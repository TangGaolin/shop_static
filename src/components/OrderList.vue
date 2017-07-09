<template>
    <div>
        <Table stripe :columns="columns" :data="orderList"></Table>
    </div>

</template>
<script>
    export default {

        data() {
            return {
                columns: [
                    {
                        title: '订单号',
                        key: 'order_id'
                    },
                    {
                        title: '订单类型',
                        key: 'order_type'
                    },
                    {
                        title: '金额',
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
                ],
                orderList: []
            }
        },

        methods:{


        }

    }


</script>

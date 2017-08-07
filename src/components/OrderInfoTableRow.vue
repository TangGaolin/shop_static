
<template>
    <div>
        <div v-if="row.order_type == 1">
            <Row class="expand-row" v-for="item in row.order_info" :key="item.item_id">
                <Col span="6">
                    <span class="expand-key">项目名称：</span>
                    <span class="expand-value">{{ item.item_name }}</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">项目次数：</span>
                    <span class="expand-value">{{ item.times }} 次</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">销售金额：</span>
                    <span class="expand-value">{{ item.sold_money }} 元</span>
                </Col>

                <Col span="6">
                    <span class="expand-key">销售折扣：</span>
                    <span class="expand-value">{{ item.discount }}</span>
                </Col>
            </Row>
            <hr/>
        </div>

        <div v-if="row.order_type == 4">
            <Row class="expand-row">
                <Col span="6">
                    <span class="expand-key">产品卡充值金额：</span>
                    <span class="expand-value">{{ row.order_info }}</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">产品充值金额：</span>
                    <span class="expand-value">{{ row.worth_money }}</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">充值折扣：</span>
                    <span class="expand-value">{{ (row.worth_money / row.order_info * 10).toFixed(2)  }} </span>
                </Col>
            </Row>
            <hr/>
        </div>

        <div v-if="row.pay_balance > 0">
            <Row class="expand-row">
                <Col span="6" offset="12">
                    <span class="expand-key">卡扣金额：</span>
                    <span class="expand-value">{{ row.pay_balance }}</span>
                </Col>
            </Row>
            <hr/>
        </div>

        <div>
            <Row class="expand-row" v-for="emp in row.emp_info" :key="emp.emp_id">
                <Col span="6">
                    <span class="expand-key">员工姓名：</span>
                    <span class="expand-value">{{ emp.emp_name }}</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">业绩分配：</span>
                    <span class="expand-value">{{ emp.money }} 元</span>
                </Col>
            </Row>
        </div>


    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    }

</script>
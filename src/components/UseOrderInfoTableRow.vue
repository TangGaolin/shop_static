<style scoped>
</style>
<template>
    <div>
        <Row class="expand-row" v-for="row in rows" :key="row.id">
            <Col span="8">
                <span class="expand-key">项目名称：</span>
                <span class="expand-value">{{ row.item_name }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">消耗次数：</span>
                <span class="expand-value">{{ row.use_time }} 次</span>
            </Col>
            <Col span="8">
                <span class="expand-key">消耗单价：</span>
                <span class="expand-value">{{ row.sold_price }} 元</span>
            </Col>

            <Col span="24">
                <span class="expand-key">分配详情：</span>
                <span class="expand-value" v-for="emp in row.emps">
                    {{ emp.emp_name }} 手工:{{ emp.fee }} 消耗: {{ emp.xiaohao }} &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
            </Col>
        </Row>

    </div>
</template>
<script>
    export default {
        props: {
            rows: Array
        }
    }
</script>
<style>
    label {
        font-weight: bolder;
    }

</style>
<template>
    <div>
        <Row :gutter="16">
            <Col span="6">
            <div>
                <label>手机：</label>
                {{currentUserData.phone_no }}
            </div>
            </Col>
            <Col span="6">
            <div>
                <label>生日：</label>
                {{currentUserData.birthday}}
            </div>
            </Col>
            <Col span="6">
            <div>
                <label>美疗师：</label>
                {{currentUserData.emp_name}}
            </div>
            </Col>
        </Row>
        <br>
        <Row :gutter="16">
            <Col span="6">
                <div>
                    <label>余额：</label>
                    {{ currentUserData.balance }} 元
                </div>
            </Col>
            <Col span="6">
                <div>
                    <label>产品余额：</label>
                    {{ currentUserData.good_money }} 元
                </div>
            </Col>
            <Col span="6">
                <div>
                    <label>欠款：</label>
                    {{ currentUserData.debt }} 元
                </div>
            </Col>
            <Col span="6">
                <div>
                    <label>积分：</label>
                    {{ currentUserData.point }}
                </div>
            </Col>
        </Row>
        <br/>
        <Row :gutter="16">
            <Col span="10">
                <label>上次离店时间：</label>
                {{ currentUserData.leave_shop_time }}
            </Col>
            <Col span="10">
            <div>
                <label>到店渠道：</label>
                {{ currentUserData.source }}
            </div>
            </Col>
        </Row>
        <br/>
        <div>
            <label>备注：</label>
            {{ currentUserData.remark }}
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            currentUserData: Object
        }
    }
</script>

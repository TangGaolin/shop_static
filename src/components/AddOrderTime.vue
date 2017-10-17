<template>
    <span>
        <Button type="ghost" icon="ios-clock" @click = "showNewModel('newUserData')">新建预约</Button>
        <Modal v-model="newModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center" class = "red" >
                <Icon type="ios-clock"></Icon>
                <span>{{shopConfig.shop_name}} - 新建预约</span>
            </p>
            <Form ref="newUserData" :model="newOrderData" :label-width="80">
                <Form-item label="预约时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间" :options="options1" v-model="order_time" style="width: 180px"></Date-picker>
                </Form-item>

                <Form-item label="姓名" prop="user_name">
                    <Select
                            v-model="selectUser"
                            filterable
                            remote
                            :remote-method="searchUser"
                            :loading="loading"
                            @on-change = "converData"
                    >
                        <Option v-for="user in users" :value="JSON.stringify(user)"  :key="user.uid">
                            {{ user.user_name }}
                        </Option>
                    </Select>
                </Form-item>

                <Form-item label="美疗师" prop="emp_id">
                    <Select v-model="newOrderData.emp_id" placeholder="请选择美疗师...">
                        <Option v-for="item in empData" :value = item.emp_id :key = item.emp_id>{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Form-item label="备注" prop="remark">
                    <Input v-model="newOrderData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>

            </Form>

            <p slot="footer">
                <Button type="primary" @click="handleSubmit()">确认添加</Button>
                <Button type="ghost" @click="handleReset()" style="margin-left: 8px">取消</Button>
            </p>

        </Modal>
    </span>
</template>
<script>

    import { orderTime, searchUserList } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            globalConfig: Object,
            empData: Array,
            shopConfig: Object
        },
        data () {
            return {
                options1: {
                    disabledDate (date) {
                        return date && date.valueOf() <= Date.now();
                    }
                },
                loading: false,
                newModel: false,
                selectUser: "",
                order_time: "",
                user_name_phone: "",
                users: [],
                newOrderData: {
                    uid: "",
                    emp_id: "",
                    emp_name: "",
                    order_time: "",
                    remark: ""
                }
            }
        },
        methods: {
            searchUser(query) {
                if("" === query){
                    return
                }
                searchUserList({
                    user_name_phone: query,
                    shop_id: this.shopConfig.shop_id
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.users = response.data.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            handleSubmit () {
                this.newOrderData.order_time = formatDate(this.order_time, "yyyy-MM-dd HH:mm:ss")
                this.newOrderData.shop_id = this.shopConfig.shop_id

                this.empData.forEach((item) => {
                    if(item.emp_id === this.newOrderData.emp_id) {
                        this.newOrderData.emp_name = item.emp_name
                    }
                })

                orderTime(this.newOrderData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                        //重置时间
                    } else {
                        this.$Message.success('提交成功!')
                        this.newModel = false
                        Object.assign(this.$data, this.$options.data())
                    }
                })
            },
            handleReset () {
                this.newOrderData = {
                    uid: "",
                    emp_id: "",
                    emp_name: "",
                    order_time: "",
                    remark: ""
                }
                this.newModel = true
            },
            showNewModel(name) {
                this.newModel = true
                this.order_time = new Date()
            },

            converData() {
                if("" === this.selectUser) {
                    return
                }
                let selectUserObj = JSON.parse(this.selectUser)
                this.newOrderData.uid = selectUserObj.uid
                if(selectUserObj.emp_id){
                    this.newOrderData.emp_id = selectUserObj.emp_id
                }
            }
        }
    }
</script>

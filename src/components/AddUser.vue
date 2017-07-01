<template>
    <span>
        <Button type="ghost" icon="android-add" @click = "showNewUserModel('newUserData')" size = "large">新建会员</Button>
        <Modal v-model="newUserModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center" class = "red" >
                <Icon type="android-add"></Icon>
                <span>{{shopConfig.shop_name}} - 新建会员</span>
            </p>
            <Form ref="newUserData" :model="newUserData" :rules="ruleValidate" :label-width="80">
                <Form-item label="操作时间" prop="add_time">
                    <Date-picker type="datetime" placeholder="选择日期和时间"  v-model="newUserData.add_time" style="width: 180px"></Date-picker>
                </Form-item>
                <Form-item label="姓名" prop="user_name">
                    <Input v-model="newUserData.user_name" placeholder="会员姓名..."></Input>
                </Form-item>
                <Form-item label="手机" prop="phone_no">
                    <Input v-model="newUserData.phone_no" placeholder="会员手机..."></Input>
                </Form-item>

                <Form-item label="美疗师" prop="emp_id">
                    <Select v-model="newUserData.emp_id" placeholder="请选择美疗师...">
                        <Option v-for="item in empData" :value = item.emp_id :key = item.emp_id>{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Form-item label= "生日" prop="birthday">
                    <Date-picker type="date" format = "yyyy-MM-dd" placeholder="选择日期" v-model="newUserData.birthday" style="width: 180px" ></Date-picker>
                </Form-item>

                <Form-item label="到店渠道" prop="source">
                    <Input v-model="newUserData.source" placeholder=""></Input>
                </Form-item>

                <Form-item label="介绍" prop="remark">
                    <Input v-model="newUserData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>

            </Form>

            <p slot="footer">
                <Button type="primary" @click="handleSubmit('newUserData')">确认添加</Button>
                <Button type="ghost" @click="handleReset('newUserData')" style="margin-left: 8px">重 置</Button>
            </p>

        </Modal>
    </span>
</template>
<script>

    import { addUser } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {
        props: {
            globalConfig: Object,
            empData: Array,
            shopConfig: Object
        },
        data () {
            return {
                newUserModel: false,
                newUserData: {
                    user_name: "",
                    phone_no: "",
                    birthday: "",
                    emp_id: "",
                    source: "",
                    add_time: "",
                    remark: ""
                },
                ruleValidate: {
                    user_name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    phone_no: [
                        { required: true, message: '手机不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.newUserData.add_time = formatDate(this.newUserData.add_time,"yyyy-MM-dd HH:mm:ss")
                        this.newUserData.birthday = formatDate(this.newUserData.birthday,"yyyy-MM-dd")
                        this.newUserData.shop_id = this.shopConfig.shop_id

                        addUser(this.newUserData).then((response) => {
                            if (0 !== response.statusCode) {
                                this.$Message.error(response.msg)
                                //重置时间
                                this.newUserData.add_time = new Date()
                                this.newUserData.birthday = ""
                            } else {
                                this.$Message.success('提交成功!')
                                this.newUserModel = false
                                this.$emit('addUser', this.newUserData)
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            },
            showNewUserModel(name) {
                this.newUserModel = true
                this.$refs[name].resetFields()
                this.newUserData.add_time = new Date()
            }
        }
    }
</script>

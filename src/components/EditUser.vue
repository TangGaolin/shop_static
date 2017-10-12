<template>
    <span>
        <Button type="ghost" icon="edit"  size="small" @click = "showModel = true">编辑</Button>

        <Modal v-model="showModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center" class = "red" >
                <Icon type="android-add"></Icon>
                <span>{{currentUserData.user_name}} - 编辑会员</span>
            </p>
            <Form ref="currentUserData" :model="currentUserData" :rules="ruleValidate" :label-width="80">
                <Form-item label="姓名" prop="user_name">
                    <Input v-model="currentUserData.user_name" disabled placeholder="会员姓名..."></Input>
                </Form-item>

                <Form-item label="手机" prop="phone_no">
                    <Input v-model="currentUserData.phone_no" placeholder="会员手机..."></Input>
                </Form-item>

                <Form-item label="美疗师" prop="emp_id">
                    <Select v-model="currentUserData.emp_id" placeholder="请选择美疗师...">
                        <Option v-for="item in empData" :value = item.emp_id :key = item.emp_id>{{ item.emp_name }}</Option>
                    </Select>
                </Form-item>

                <Form-item label= "生日" prop="birthday">
                    <Date-picker type="date" format = "yyyy-MM-dd" placeholder="选择日期" v-model="birthday" style="width: 180px" ></Date-picker>
                </Form-item>


                <Form-item label="到店渠道" prop="source">
                    <Select v-model="currentUserData.source" placeholder="到店渠道...">
                        <Option v-for="source in globalConfig.user_channel" :value = source :key = source>{{ source }}</Option>
                    </Select>
                </Form-item>

                <Form-item label="介绍" prop="remark">
                    <Input v-model="currentUserData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>
            </Form>

            <p slot="footer">
                <Button type="primary" @click="updateUserInfo()">确认修改</Button>
                <Button type="ghost" @click="showModel = false" style="margin-left: 8px">取消</Button>
            </p>

        </Modal>
    </span>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { updateUser } from '../api/api'
    import {formatDate} from '../utils/utils'
    export default {
        props: {
            empData: Array,
        },
        data () {
            return {
                birthday : "",
                showModel: false,
                ruleValidate: {

                }
            }
        },

        computed: {
            ...mapGetters([
                'currentUserData',
                'globalConfig'
            ])
        },

        created() {
            if(this.currentUserData.birthday) {
                let date = this.currentUserData.birthday.split("-")
                this.birthday = new Date(date[0], parseInt(date[1])-1, date[2])
            }else{
                this.birthday = new Date()
            }
        },
        methods: {
            updateUserInfo() {
                this.currentUserData.birthday = formatDate(this.birthday,'yyyy-MM-dd')
                updateUser(this.currentUserData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$store.dispatch('loadUserDetail', {'uid': this.currentUserData.uid})
                        this.$Message.success("更新成功")
                        this.showModel = false
                    }
                })
            }
        }
    }
</script>

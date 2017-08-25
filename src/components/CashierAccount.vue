<template>
    <Dropdown @on-click = "clickFun">
        <a href="javascript:void(0)"  >
            {{ userInfo.emp_name }}
            <Icon type="arrow-down-b"></Icon>
        </a>
        <Dropdown-menu slot="list">
            <Dropdown-item name="resetPassword">重置密码</Dropdown-item>
            <Dropdown-item name="quit">退出</Dropdown-item>
        </Dropdown-menu>

        <Modal v-model="showModel" width="480" >
            <p slot="header" style="color:#f60;text-align:center" class = "red" >
                <Icon type="android-add"></Icon>
                <span>重置密码</span>
            </p>
            <Form ref="resetData" :model="resetData"  :label-width="85">
                <Form-item label="当前密码">
                    <Input v-model="resetData.current_password" type="password" placeholder="当前密码..."></Input>
                </Form-item>
                <Form-item label="新密码">
                    <Input v-model="resetData.new_password" type="password" placeholder="新密码..."></Input>
                </Form-item>

                <Form-item label="确认新密码">
                    <Input v-model="resetData.check_new_password" type="password" placeholder="确认新密码..."></Input>
                </Form-item>
            </Form>

            <p slot="footer">
                <Button type="primary" @click="handleSubmit('resetData')">确认修改</Button>
                <Button type="ghost" @click="handleReset('resetData')" style="margin-left: 8px">取消</Button>
            </p>

        </Modal>
    </Dropdown>
</template>
<script>
    import { resetPassword } from '../api/api'
    export default {
        props: {
            userInfo: Object,
        },

        data () {
              return {
                  showModel: false,
                  resetData: {
                      current_password: "",
                      new_password: "",
                      check_new_password: ""
                  }
              }
        },

        methods: {
            clickFun(value) {
                if("quit" === value) {
                    this.logout()
                }

                if("resetPassword" === value) {
                    this.showResetModel()
                }
            },
            logout() {
                this.$store.dispatch('logoutAction',{}).then(() => {
                    // 退出成功
                    this.$router.push('/login')
                })
            },
            showResetModel() {
                this.showModel = true
            },

            handleReset(name) {
                this.showModel = false
                this.$refs[name].resetFields()
            },

            handleSubmit() {
                //数据验证
                if(!this.resetData.current_password){
                    this.$Message.error("当前密码不能为空")
                    return
                }

                if(!this.resetData.new_password){
                    this.$Message.error("新密码不能为空")
                    return
                }
                if(!this.resetData.check_new_password){
                    this.$Message.error("确认密码不能为空")
                    return
                }
                if(this.resetData.check_new_password !== this.resetData.new_password){
                    this.$Message.error("两次密码输入不正确")
                    return
                }
                resetPassword(this.resetData).then((response) => {
                    if (0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    } else {
                        this.$Message.success("密码修改成功，请重新登录!")
                        this.logout()
                    }
                })
            }


        }
    }
</script>

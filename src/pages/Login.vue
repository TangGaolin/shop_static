<style scoped>
.wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 150px;
    padding-bottom: 200px;
    background: #f7fafc;
}
.wrapper > h1,p{
  text-align: center;
  vertical-align: middle;
  margin-bottom: 10px;
}
.login {
    margin: 0 auto;
    width: 350px;
    height: 100%;
}
.login-box {
    padding: 20px;
    border: 1px #ccc solid;
    border-radius: 5px;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.12);
    background: #FFF;
}

</style>

<template>
    <div class="wrapper">
        <h1 style="color:#2d8cf0">德美店务收银系统</h1>
        <p>让每一个家庭拥有健康、快乐、美丽！</p>
        <div class="login">
            <div class="login-box">
                <i-form ref="formInline" :model="formInline" :rules="ruleInline" style="padding-top:10px">
                    <Form-item prop="user">
                        <Input v-model="formInline.user" size="large" icon="person" placeholder="收银账号..."></Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input v-model="formInline.password" type="password" size="large" icon="key" placeholder="输入密码..." @on-enter="handleSubmit('formInline')"></Input>
                    </Form-item>
                    <Form-item>
                        <i-button type="primary" @click.native="handleSubmit('formInline')" long size="large">
                        登&emsp;&emsp;录
                        </i-button>
                    </Form-item>
                </i-form>
            </div>
        </div>

        <Modal
                v-model="showModel"
                title="选择门店"
                @on-ok="ok"
                @on-cancel="cancel">

            <Radio-group v-model="selectShop">
                <Radio v-for="shop in loginInfo.shop_list" :key = "shop.shop_id" :label="JSON.stringify(shop)">{{ shop.shop_name }}</Radio>
            </Radio-group>

        </Modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            showModel:false,
            loginInfo: {},
            selectShop: "",
            formInline: {
                user: '',
                password: '',
            },
            ruleInline: {
                user: [{
                    required: true,
                    message: '请填写用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请填写密码',
                    trigger: 'blur'
                }, {
                    type: 'string',
                    min: 6,
                    message: '密码长度不能小于6位',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('loginAction', {
                        user: this.formInline.user,
                        password: this.formInline.password
                    }).then((response) => {
                      // 登录成功
                        if(0 === response.data.shop_id) {
                            this.loginInfo = response.data
                            this.selectShop = JSON.stringify(this.loginInfo.shop_list[0])
                            this.showModel = true
                        }else{
                            this.$router.push('/')
                        }
                    })
                } else {
                    this.$Message.error('表单验证错误!')
                }
            })
        },
        ok () {
            let shop_info = JSON.parse(this.selectShop)
            this.loginInfo.shop_id = shop_info.shop_id
            this.loginInfo.shop_name = shop_info.shop_name
            this.$store.dispatch('updateAccountAction', this.loginInfo).then(() => {
                this.$router.push('/')
            })
        },
        cancel () {
            this.$store.dispatch('logoutAction',{}).then(() => {
                // 退出成功
                this.$router.push('/login')
            })
        }
    }
}

</script>

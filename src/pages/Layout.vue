<style scoped>
    .layout{
        border-top: 3px solid #ccc;
        background: #e7e8eb;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: auto;
        border-radius: 3px;
        line-height: 60px;
        float: left;
        position: relative;
        left: 100px;
        font-size: 30px;
        font-weight: bolder;
    }
    .layout-account{
        width: 300px;
        height: auto;
        border-radius: 3px;
        line-height: 60px;
        float: right;
        margin-left: 100px;
        position: relative;
        font-size: 13px;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        text-align: center;
    }
    .layout-body{
        width: 80%;
        /*max-width: 1200px;*/
        margin-left: auto;
        margin-right: auto;
        padding: 36px 0 88px;
    }
    .layout-content{
        border: 1px solid #d9dadc;
        background-color: #fff;
        min-height: 700px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-content a{
        color: #657180;
    }
    .user-area {
        padding: 15px;
        width: auto;
        height: 100%;
        border-right: 1px solid #ccc;
    }
    .function-button {
        margin-top: 20px;
        text-align: right;
        margin-right: 10px;
    }



</style>
<template>
    <div class="layout">
        <div class="layout-header">
            <div class="layout-logo">
                <a href="/">德美店务收银系统</a>
            </div>
            <div class='layout-account'  v-if="userInfo !== null">
                 {{userInfo.shop_name}} *
                <CashierAccount :userInfo = userInfo></CashierAccount>
            </div>
        </div>

        <div class="layout-body">
            <div class="layout-content">
                <div class="layout-content-main">
                    <Row>
                        <Col span="5">
                            <div class="user-area">
                                <UserSearch :shopConfig = userInfo
                                ></UserSearch>
                                <br/>
                                <UserSideList :shopConfig = userInfo>
                                </UserSideList>
                            </div>
                        </Col>
                        <Col span="19">

                        <div class = "function-button" v-if="userInfo !== null">
                            <Button type="ghost" @click="goDashboard">主页控制台</Button>

                            <AddOrderTime :empData = empData
                                     :shopConfig = userInfo
                                     :globalConfig = globalConfig
                            ></AddOrderTime>
                            <AddUser :empData = empData
                                     :shopConfig = userInfo
                                     :globalConfig = globalConfig
                            ></AddUser>
                            <NotUserBuyItems
                                    :empData = empData
                                    :userInfo = userInfo
                            >
                            </NotUserBuyItems>
                            <NotUserBuyGoods
                                    :empData = empData
                                    :userInfo = userInfo
                            >
                            </NotUserBuyGoods>
                        </Poptip>

                            <Button type="ghost"  @click="goCheckOrder">交班审核</Button>
                        </div>

                        <transition name="fade" mode="out-in">
                            <router-view :empData = empData></router-view>
                        </transition>
                        </Col>
                    </Row>

                </div>
            </div>
        </div>

        <div class="layout-copy">
            2011-2017 &copy; 德美中国
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getEmployeeList, getUserDetail } from '../api/api'
    export default {
        data() {
            return {
                empData: [],
                empTotal:0,
                currentUserData:{

                }
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'globalConfig'
            ])
        },
        created() {
            this.getEmployeeList()
        },
        methods: {
            getEmployeeList() {
                getEmployeeList({
                    is_server: 1,
                    shop_id: this.userInfo.shop_id,
                    limit: 100
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.empData = response.data.data
                        this.empTotal = response.data.totalSize
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            goDashboard() {
                this.$router.push('/dashboard')
            },
            goCheckOrder() {
                this.$router.push('/check-order')
            },

        }
    }
</script>

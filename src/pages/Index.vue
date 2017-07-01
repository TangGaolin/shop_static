<style scoped>
    .layout{
        border-top: 5px solid #3091f2;;
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
        color: #b3b6b7;
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
    }
    .layout-body{
        width: 1200px;
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
    }
    .function-button button{
        margin-right: 10px;
    }
    .user-detail-area {
        width: auto;
        padding-top: 20px;
        margin-left: 55px;
        margin-right: 55px;
        font-size: 14px;
    }

</style>
<template>
    <div class="layout">
        <div class="layout-header">
            <div class="layout-logo">德美店务收银系统</div>
            <div class='layout-account'  v-if="userInfo !== null">
                 {{userInfo.shop_name}} * {{userInfo.emp_name}} |
                 <a href="javascript:void(0);" v-on:click="logout">退出</a>
            </div>
        </div>

        <div class="layout-body">
            <div class="layout-content">
                <Row>
                    <Col span="5">
                        <div class="user-area">
                            <UserSearch></UserSearch>
                            <br/>
                            <Collapse >
                                <Panel name="1">
                                    预约顾客
                                    <ul slot="content">

                                    </ul>
                                </Panel>
                                <Panel name="2">
                                    生日提醒
                                    <p slot="content">

                                    </p>
                                </Panel>
                                <Panel name="3">
                                    今日顾客
                                    <p slot="content">

                                    </p>
                                </Panel>
                            </Collapse>
                        </div>

                    </Col>
                    <Col span="19">

                        <div class = "function-button">
                            <AddUser :empData = empData
                                     :shopConfig = userInfo
                                     v-on:addUser = "addUser"
                            ></AddUser>
                            <Button type="ghost" size="large">交班统计</Button>
                            <Button type="ghost" size="large">单据撤销</Button>
                        </div>

                        <transition name="slide-fade">
                            <div class = "user-detail-area" v-if = "currentUserData">
                                <div>
                                    <h1>
                                        <Icon type="person"></Icon>
                                        {{currentUserData.user_name}}
                                    </h1>
                                    <br>
                                    <UserInfo :currentUserData = currentUserData></UserInfo>
                                </div>
                                <br/>
                                <div>
                                    <Button type="ghost">充值</Button>
                                    <Button type="ghost">购买服务</Button>
                                    <Button type="ghost">购买产品</Button>
                                    <Button type="ghost">还款</Button>
                                </div>

                                <Tabs value="items">
                                    <Tab-pane label="卡项服务" name="items">

                                    </Tab-pane>
                                    <Tab-pane label="购买记录" name="buys">

                                    </Tab-pane>
                                    <Tab-pane label="耗卡记录" name="userd">

                                    </Tab-pane>
                                    <Tab-pane label="沟通记录" name="record">

                                    </Tab-pane>
                                </Tabs>
                            </div>
                        </transition>
                    </Col>
                </Row>
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
                currentUserData: false,
                empData: [],
                empTotal:0
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
//        filters: {
//            activeName: function(name){
//                const routes = name.split("/")
//                return "/" + routes[1] + "/" + routes[2]
//            }
//        },
        created() {
//            this.newUserData.shop_id = this.userInfo.shop_id
            this.getEmployeeList()
        },
        methods: {
            logout() {
                console.log('xxxx')
                this.$store.dispatch('logoutAction',{}).then(() => {
                    // 退出成功
                    this.$router.push('/login')
                })
            },
            getCurrentTime() {
                var date = new Date()
                var month = date.getMonth() + 1
                var strDate = date.getDate()
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                return date.getFullYear() + '-' + month + '-' + strDate
                    + " " + date.getHours() + ":" + date.getMinutes()
                    + ":" + date.getSeconds()
            },
            getEmployeeList() {
                getEmployeeList({
                        is_server: 1,
                        shop_id: this.userInfo.shop_id
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


            //加载用户信息
            loadUserDetail(userInfo) {
                getUserDetail(userInfo).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.currentUserData = response.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            addUser(userData) {
                this.loadUserDetail(userData);
            }
        }
    }
</script>

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
                <div class="layout-content-main">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
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
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        methods: {
            logout() {
                this.$store.dispatch('logoutAction',{}).then(() => {
                    // 退出成功
                    this.$router.push('/login')
                })
            }
        }
    }
</script>

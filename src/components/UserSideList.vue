<style>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .user-side .content{
        padding-left: 5px;
        padding-top: 5px;
        margin-left: 0px;
        margin-right: 0px;
    }
    .user-list {
        text-align: center;
        font-size: 14px
    }
    .user-list p {
        padding: 5px;
    }
</style>
<template>
    <div class="user-side">
        <Collapse >
            <Panel name="1">
                预约顾客 <Badge v-if="sideUsers.res_user" :count="sideUsers.res_user.length"></Badge>
                <p slot="content" >
                    <Timeline>
                        <TimelineItem v-for="(user, index) in sideUsers.res_user" :key="index">
                            <p class="time">{{user.order_time}}</p>
                            <p class="content">
                                <router-link :to = "'user-controller?uid=' + user.uid">{{user.user_name}} ({{user.emp_name}})</router-link>
                            </p>
                            <p class="content">{{user.remark}}</p>
                        </TimelineItem>
                    </Timeline>
                </p>

            </Panel>
            <Panel name="2">
                生日提醒
                <p slot="content">

                </p>
            </Panel>
            <Panel name="3" >
                今日顾客 <Tag color="green" v-if="sideUsers.today_user"> {{ sideUsers.today_user.length }}  </Tag>
                <div slot="content" class="user-list">
                    <!--<Button type="text" size="large" @click="chooseUser(user.uid)"> {{user.user_name}} &nbsp; {{user.phone_no}}</Button>-->
                    <p  v-for="user in sideUsers.today_user" >
                        <router-link :to = "'user-controller?uid=' + user.uid">{{user.user_name}} &nbsp; {{user.phone_no}}</router-link>
                    </p>
                </div>
            </Panel>
        </Collapse>

    </div>
</template>
<script>
    import { getShopSideUsers } from '../api/api'
    export default {

        props: {
            shopConfig: Object
        },
        data () {
            return {
                sideUsers: {},
            }
        },
        created() {
            this.getShopSideUsers()
        },
        methods: {
            getShopSideUsers() {
                getShopSideUsers({
                    shop_id: this.shopConfig.shop_id
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.sideUsers = response.data

                        if(this.sideUsers.res_user.length > 0) {
                            this.sideUsers.res_user.sort(function(a, b) {
                                return a.order_time > b.order_time;
                            })
                        }
                        console.log(this.sideUsers)
                    }
                    this.searchResModel = true
                }).catch((error) => {
                    console.log(error)
                })
            },
            chooseUser (uid) {
                this.$router.push('/user-controller?uid=' + uid)
            }
        }
    }
</script>

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
                <Button type="ghost" icon="refresh" size="small" @click.stop="getOrderUserData()"></Button>
                预约顾客 <Tag color="red">{{ orderUser.length }}</Tag>
                <p slot="content" >
                    <Timeline>
                        <TimelineItem v-for="(user, index) in orderUser" :key="index">
                            <p class="time">{{user.order_time}}</p>
                            <p class="content">
                                <router-link :to = "'user-controller?uid=' + user.uid">{{user.user_name}} ({{user.emp_name}})</router-link>
                            </p>
                            <p class="content">
                                {{user.remark}}
                                <Button type="ghost" size="small" @click="checkOrderTime(user,1)">确定到店</Button>
                                <Button type="warning" size="small" @click="checkOrderTime(user,-1)">取消</Button>
                            </p>
                        </TimelineItem>
                    </Timeline>
                </p>
            </Panel>
            <Panel name="3" >
                <Button type="ghost" icon="refresh" size="small" @click.stop="getTodayUserData()"></Button>
                今日顾客 <Tag color="green"> {{ todayUser.length }}  </Tag>
                <div slot="content" class="user-list">
                    <p  v-for="user in todayUser" >
                        <router-link :to = "'user-controller?uid=' + user.uid">{{user.user_name}} &nbsp; {{user.phone_no}}</router-link>
                    </p>
                </div>
            </Panel>
        </Collapse>

    </div>
</template>
<script>
    import { getTodayUsers, checkUserOrderTime, getOrderUser } from '../api/api'
    import { formatDate } from '../utils/utils'
    export default {

        props: {
            shopConfig: Object
        },
        data () {
            return {
                todayUser: [],
                orderUser: []
            }
        },
        created() {
            this.getOrderUserData()
            this.getTodayUserData()
        },
        methods: {
            getTodayUserData() {
                getTodayUsers({
                    shop_id: this.shopConfig.shop_id
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.todayUser = response.data
                    }
                    this.searchResModel = true
                }).catch((error) => {
                    console.log(error)
                })
            },
            chooseUser (uid) {
                this.$router.push('/user-controller?uid=' + uid)
            },

            checkOrderTime(user, status) {
                checkUserOrderTime({
                    order_time_id: user.id,
                    status: status
                }).then((response) => {
                    this.getOrderUserData()
                    if(1 === status) {
                        this.chooseUser(user.uid)
                    }

                }).catch((e) => {
                    console.log(e)
                })
            },

            getOrderUserData() {
                getOrderUser({
                    shop_id: this.shopConfig.shop_id,
                    status: 0,
                    start_time: formatDate(new Date(), "yyyy-MM-dd"),
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.orderUser = response.data
                        if(this.orderUser.length > 0) {
                            this.orderUser.sort(function(a, b) {
                                return a.order_time > b.order_time;
                            })
                        }
                    }
                    this.searchResModel = true
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
</script>

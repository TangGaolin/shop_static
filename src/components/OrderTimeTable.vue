<template>
    <div>
        <h2>预约看板 <Button type="ghost" icon="refresh" size="small" @click="getOrderTimeData()">刷新</Button></h2>

        <p style="text-align: center">
            <RadioGroup v-model="selectDate"  type="button" @on-change="getOrderTimeData()">
                <Radio :label = 0> 今天 </Radio>
                <Radio :label = 1> 明天 </Radio>
                <Radio :label = 2> 后天 </Radio>
            </RadioGroup>
        </p>

        <br/>
        <table class="calendar">
            <thead>
            <tr>
                <th class="calendar-head">员工</th>
                <th class="calendar-head">0-8: 00</th>
                <th class="calendar-head">10: 00</th>
                <th class="calendar-head">12: 00</th>
                <th class="calendar-head">14: 00</th>
                <th class="calendar-head">16: 00</th>
                <th class="calendar-head">18: 00</th>
                <th class="calendar-head">23: 59</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(orderTime, index) in orderTimeData" :key="index">
                <td class="full-calendar-cell">
                    <div class="full-calendar-date">
                        <div class="full-calendar-content">
                            <ul class="events">
                                {{orderTime.emp_name}}
                            </ul>
                        </div>
                    </div>
                </td>

                <td class="full-calendar-cell" v-for="index in [1, 2, 3 ,4 ,5 ,6 ,7]" :class="index == now_time ? 'td-active':''">
                    <div class="full-calendar-date">
                        <div class="full-calendar-content">
                            <ul class="events" v-if="orderTime.order_user[index] != 'undefined'">
                                <li v-for="user in orderTime.order_user[index]" :key="user.uid">
                                    {{user.user_name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getOrderTimeView } from '../api/api'
    import { formatDate } from "../utils/utils"
    export default {
        props: {
            empData: Array
        },

        data () {
            return {
                orderTimeData: [], //用户页面显示的数据
                convertTableData:{},
                now_time: 0,
                selectDate: 0
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },

        created() {
            this.getOrderTimeData()
            let now = new Date()
            let now_h = now.getHours()
            if(now_h < 8) {
                this.now_time = 1
            }else if(8 <= now_h && now_h < 10) {
                this.now_time = 2
            }else if(10 <= now_h && now_h < 12) {
                this.now_time = 2
            }else if(12 <= now_h && now_h < 14) {
                this.now_time = 4
            }else if(14 <= now_h && now_h < 16) {
                this.now_time = 5
            }else if(16 <= now_h && now_h < 18) {
                this.now_time = 7
            }else{
                this.now_time = 8
            }
        },

        methods: {
            getOrderTimeData() {
                let queryDate = new Date()
                queryDate.setTime(queryDate.getTime() + this.selectDate * 24 * 60 * 60 * 1000)
                let start_time = formatDate(queryDate, "yyyy-MM-dd")
                let end_time   = start_time + " 23:59:59"
                this.orderTimeData = []
                getOrderTimeView({
                    shop_id: this.userInfo.shop_id,
                    start_time: start_time,
                    end_time: end_time
                }).then((response) => {
                    if(0 !== response.statusCode) {
                        this.$Message.error(response.msg)
                    }else{
                        this.orderTimeData = response.data
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },

        },

    }
</script>

<style scoped>
    .calendar {
        border-collapse: collapse;
        max-width: 100%;
        background-color: transparent;
        width: 100%;
        border: 0;
        position: relative;
        table-layout: fixed;
        border-bottom: 1px solid #E7E9F1;
    }
    tbody tr {
        border-top: 1px solid #E7E9F1;
    }

    th,
    td {
        text-align: right;
        border: 0;
    }

    td:last-child {
        border-right: 1px solid #E7E9F1;
    }

    td:first-child {
        background-color: #F7F8FD;
    }

    .td-active {
        background-color: #eaf8fe;
    }

    caption {
        color: #333;
        font-weight: 500;
        font-size: 1.3em;
    }

    .calendar-head {
        line-height: 18px;
        padding: 0;
        text-align: right;
        padding-right: 12px;
        padding-bottom: 10px;
        font-weight: 600;
        color: #666;
        width: 14%;
    }

    .full-calendar-cell {
        position: relative;
        border-left: 1px solid #E7E9F1;
    }

    .full-calendar-date {
        text-align: left;
        display: block;
        color: #666;
        height: 50px;
        padding: 4px 8px;
        -webkit-transition: background .3s ease;
        transition: background .3s ease;
    }

    .full-calendar-date:hover {
        background: #eaf8fe;
        cursor: pointer;
    }

    .events {
        line-height: 24px;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .full-calendar-content {
        height: 90px;
        overflow-y: auto;
        position: static;
        width: auto;
        left: auto;
        bottom: auto;
    }

    .events li {
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        background-color: rgba(255, 76, 76, .05);
        line-height: 1.5;
        margin: 3px 0;
    }
    .events li:before {
        content: '●';
        margin-right: 2px;
        color: #FE4D63;
    }
</style>

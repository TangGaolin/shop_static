<template>
    <div>

        <Row style="padding: 20px;color: #ffffff">
            <Col span = "11">
            <Card style="background-color: #4e9c28">
                <div style="text-align:center">
                    <h4>今日业绩</h4>
                    <h1>
                        <Icon type="social-usd"></Icon>
                        {{ shopDataView.yeji_today }}
                    </h1>
                    <h5>本月累计 {{ shopDataView.yeji_sum }}</h5>
                </div>
            </Card>
            </Col>
            <Col span = "11" offset="2">
            <Card style="background-color: #e9660f">
                <div style="text-align:center">
                    <h4>今日消耗</h4>
                    <h1>
                        <Icon type="coffee"></Icon>
                        {{ shopDataView.xiaohao_today }}
                    </h1>
                    <h5>本月累计 {{ shopDataView.xiaohao_sum }}</h5>
                </div>
            </Card>
            </Col>

        </Row>

        <VeHistogram :data="chartData" :settings="chartSettings" tooltip-visible legend-visible></VeHistogram>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import VeHistogram from 'v-charts/lib/histogram'
    import { getShopDataView } from '../api/api'
    import {formatDate} from "../utils/utils";
    export default {
        components: {
            VeHistogram
        },
        data() {
            return {
                chartData: {
                    columns: ['day', 'yeji', 'xiaohao'],
                    rows: []
                },
                chartSettings: {

                },
                viewData:[],
                shopDataView: {
                    yeji_today: 0,
                    xiaohao_today: 0,
                    yeji_sum: 0,
                    xiaohao_sum: 0,
                }
            }
        },

        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        created: function () {
            getShopDataView({shop_id: this.userInfo.shop_id}).then((response) => {
                if (0 !== response.statusCode) {
                    this.$Message.error(response.msg)
                } else {
                    this.viewData = response.data
                    this.chartData = {
                        columns: ['day', 'yeji', 'xiaohao'],
                        rows: this.viewData
                    }
                    this.chartSettings = {
                        dimension: ['day'],
                        metrics: ['yeji', 'xiaohao'],
                        yAxisName: ['业绩', '消耗'],
                        yAxisType: ['KMB'],
                        area: false,
                        labelMap: {
                            day: '日期',
                            xiaohao: '消耗',
                            yeji: '业绩'
                        }
                    }
                    this.countData()
                }
            })
        },
        methods: {
            countData() {
                this.shopDataView = {
                    yeji_today: 0,
                    xiaohao_today: 0,
                    yeji_sum: 0,
                    xiaohao_sum: 0
                }
                let currentDay = formatDate(new Date(), "dd")
                console.log(currentDay)
                this.viewData.forEach((item) => {
                    this.shopDataView.yeji_sum += Number(item.yeji)
                    this.shopDataView.xiaohao_sum += Number(item.xiaohao)
                    if(currentDay == item.day) {
                        this.shopDataView.yeji_today = item.yeji
                        this.shopDataView.xiaohao_today = item.xiaohao
                    }
                })
            }

        }
    }


</script>

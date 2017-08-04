<template>
    <div>
        <VeHistogram :data="chartData" :settings="chartSettings" tooltip-visible legend-visible></VeHistogram>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import VeHistogram from 'v-charts/lib/histogram'
    import { getShopDataView } from '../api/api'
    export default {
        components: {
            VeHistogram
        },
        data() {
            return {
                chartData: {
                },
                chartSettings: {
                },
                viewData: []
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
                    //重置时间
                    this.rechargeData.add_time = new Date()
                } else {
                    response.data.forEach((items) => {
                        var day_data = {
                            '日期': items.day,
                            '业绩': items.yeji,
                            '消耗': items.xiaohao,
                        }
                        this.viewData.push(day_data)
                    });
                }
            })

            this.chartData = {
                columns: ['日期', '业绩', '消耗'],
                rows: this.viewData
            }
            this.chartSettings = {
                dimension: ['日期'],
                metrics: [ '业绩', '消耗'],
                axisSite: {
                    right: ['占比']
                },
                yAxisType: ['KMB', 'normal'],
                yAxisName: ['业绩', '消耗'],
                area: true
            }
        },
        methods: {


        }
    }


</script>

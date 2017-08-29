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
                    columns: ['day', 'yeji', 'xiaohao'],
                    rows: []
                },
                chartSettings: {

                },
                viewData:[]
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
                }
            })
        },
        methods: {


        }
    }


</script>

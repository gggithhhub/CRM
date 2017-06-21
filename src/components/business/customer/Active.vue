<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="btList" id="btList">
			<el-row class="headline" style="background-color: #F6F6F6;">
				<el-col :span="6"><div class="reportList">已成交客户</div></el-col>
				<el-col :span="6"><div class="reportList">消耗中</div></el-col>
				<el-col :span="6"><div class="reportList">待消耗</div></el-col>
				<el-col :span="6"><div class="reportList">待充值</div></el-col>
			</el-row>
			<el-row class="bgColor">
				<el-col :span="6"><div class="reportList">{{list.user_state.deal_user}}</div></el-col>
				<el-col :span="6"><div class="reportList">{{list.user_state.consume_user}}</div></el-col>
				<el-col :span="6"><div class="reportList">{{list.user_state.not_consume_user}}</div></el-col>
				<el-col :span="6"><div class="reportList">{{list.user_state.not_recharge_user}}</div></el-col>
			</el-row>
		</div>
		<div class="btBox">
			<div class="leftbt">
				<div id="container" style="width: 100%;height:350px;margin: 0 auto;"></div>
			</div>
			<div class="rightbt">
				<div id="container1" style="width: 100%;height:350px;margin: 0 auto;"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	var leftPie ={
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            spacing : [10, 0 , 10, 0]
        },
        colors: ['#55a8ff', '#8ac4ff', '#b0d7ff', '#ffd38a', '#ffad17'],
        title: {
            text: '行业占比'
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            pointFormat: '<b>占比：{point.percentage:.1f}%</b>'
        },
        legend: {
        	align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 0,
            y: 0,
            width: 60
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b> /{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                ['Chrome',12.8],
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['其他',   0.7]
            ]
        }]
    }
    var rightZx =  {
        chart: {
            type: 'column'
        },
        title: {
            text: '行业消耗'
        },
        subtitle: {
            text: null
        },
        colors: ['#56a8fe', '#ffc150'],
        xAxis: {
            categories: [
                
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '金额 (元)'
            }
        },
        credits: {
        	enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
        },
        series: [{
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            showInLegend: false,
            name: '',
        }]
    }
	export default {
		watch: {
			list() {
				// new Highcharts.Chart('container1', this.rightZx);
			}
		},
		created() {
			this.$store.dispatch('searchReportList', {url: 'userActiveReport'})
		},
		beforeUpdate() {
			setTimeout( () => {
				this.changeData()
			}, 200)
		},
		data() {
			return {
				leftPie,
				rightZx,
			}
		},
		components: {
			search,
		},
		computed: {
			list() {
				return this.$store.getters.reportLists
			}
		},
		methods: {
			changeData() {

				var leftData = this.list.industry_user
				var leftArray = []
				leftData.forEach((val, index) => {
					
					let nub = Number(val.proportion.substring(0, val.proportion.length - 1))
					leftArray.push([val.name, nub])

				})
				this.leftPie.series[0].data = leftArray

				var rightData = this.list.industry_consume
				this.rightZx.xAxis.categories = []
				this.rightZx.series[0].data = []

				rightData.forEach((val, index) => {
					this.rightZx.xAxis.categories.push(val.name)
					this.rightZx.series[0].data.push(Number(val.money))
				})
				new Highcharts.Chart('container1', this.rightZx);
				new Highcharts.Chart('container', this.leftPie);

			}
		}
	}
</script>
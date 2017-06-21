<template>
	<div>
		<div class="tranTop">
			<ul>
				<li><span>新增客户</span><em>{{tranTopData.sum_user}}</em><span>人</span></li>
				<li><span>联系成功数</span><em>{{tranTopData.sum_succs_count}}</em><span>人</span></li>
				<li><span>联系成功率</span><em>{{tranTopData.sum_succs_rate}}</em></li>
				<li><span>触达KP数</span><em>{{tranTopData.sum_kp_count}}</em></li>
				<li><span>触达KP率</span><em>{{tranTopData.sum_kp_rate}}</em></li>
				<li><span>成交数</span><em>{{tranTopData.sum_complete_count}}</em></li>
				<li><span>成交率</span><em>{{tranTopData.sum_complete_rate}}</em></li>
			</ul>
		</div>
		<div class="query" style="width: 96%; margin: 0 auto;">
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="上级领导"  v-model="searchData.parentid" @change="changeSale">
					<el-option label="上级领导" :value="allVal">
				    </el-option>
				    <el-option v-for="item in allManageSales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<div class="nextDate tranDate">
					<el-date-picker v-model="searchData.start_date" type="date" placeholder="起始日期" :picker-options="pickerOptions0" :editable=false :clearable=true @change="getFirstDate" :editable=false>
					</el-date-picker>
				</div>
				<div class="nextDate tranDate">
					<el-date-picker v-model="searchData.end_date" type="date" placeholder="结束日期" :picker-options="pickerOptions1" :editable=false :clearable=true @change="getLastDate" :editable=false>
					</el-date-picker>
				</div>

				<el-select placeholder="快捷选择"  v-model="quickly" @change="quick">
				    <el-option v-for="item in quicklyItem" :label="item.label" :value="item.value">
				    </el-option>
				</el-select>

				<el-button type="primary" size="small" @click="searchAll">查询</el-button>
			</div>
		</div>
		<div class="tranList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">姓名</div></el-col>
				<el-col :span="2"><div class="grid-content">上级领导</div></el-col>
				<el-col :span="2"><div class="grid-content">分配客户</div></el-col>
				<el-col :span="2"><div class="grid-content">独立开发客户</div></el-col>
				<el-col :span="2"><div class="grid-content">新增联系记录</div></el-col>
				<el-col :span="2"><div class="grid-content">联系成功客户数</div></el-col>
				<el-col :span="2"><div class="grid-content">联系成功客户率</div></el-col>
				<el-col :span="2"><div class="grid-content">触达KP数</div></el-col>
				<el-col :span="2"><div class="grid-content">触达KP率</div></el-col>
				<el-col :span="2"><div class="grid-content">成交客户数</div></el-col>
				<el-col :span="2"><div class="grid-content">成交率</div></el-col>
				<el-col :span="2"><div class="grid-content">洽谈失败客户</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in tranLists.list">
				<el-col :span="2"><div class="grid-content">{{val.realname}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.parent}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.distributs_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.Independ_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.follows_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.succs_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.succ_rate}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.kp_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.getkp_rate}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.complete_count}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.complete_rate}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.fail_users}}</div></el-col>
			</el-row>
			<div class="footer" style="bottom: -30px;">
				<el-pagination small layout="prev, pager, next" :total="tranLists.count * 10" @current-change="getList"></el-pagination>
			</div>
		</div>
		<div class="pie">
			<div class="leftPie">
				<p>客户阶段统计状态</p>
				<div id="container" style="width: 100%;height:300px;margin: 0 auto;"></div>
			</div>
			<div class="rightPie">
				<p>触达KP转化率</p>
				<div id="container1" style="width: 100%;height:300px;margin: 0 auto;"></div>
			</div>
			<div class="bottomPie">
				<p>注释：</p>
				<p>·里表中显示的联系成功客户率、触达KP率、成交率是基于所有新增客户数的状态转化率，新增客户数包含分配客户数和独立开发客户数；</p>
				<p>·客户状态阶段图统计中显示的是，当前每个客户的所在状态统计；</p>
				<p>·触达KP转化图中显示的是，触达KP后客户转化情况。</p>
			</div>
		</div>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import getDate from '../../js/common.js'
	const quicklyItem = [{
		value: '1',
		label: '本周'
	},{
		value: '6',
		label: '上周'
	}, {
		value: '2',
		label: '本月'
	}, {
		value: '3',
		label: '上月'
	}, {
		value: '4',
		label: '本季度'
	}, {
		value: '5',
		label: '本年'
	}, ]
	//本周 本月 本季度什么的
	var chart = null;
	var leftPie = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            spacing : [10, 0 , 10, 0]
        },
        colors: ['#55a8ff', '#8ac4ff', '#b0d7ff', '#aac0d7', '#dcdcdc', '#ffe9c0', '#ffd38a', '#ffc150', '#ffad17'],
        title: {
            floating:true,
            text: ''
        },
        tooltip: {
            pointFormat: '<b>占比：{point.percentage:.1f}%</b>'
        },
        credits: {
        	enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> /{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                point: {
                    events: {
                        mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                            // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                            // chart.setTitle({
                            //     text: e.target.name+ '\t'+ e.target.y + ' %'
                            // });
                        }
                        //, 
                        // click: function(e) { // 同样的可以在点击事件里处理
                        //     chart.setTitle({
                        //         text: e.point.name+ '\t'+ e.point.y + ' %'
                        //     });
                        // }
                    }
                },
            }
        },
        series: [{
            type: 'pie',
            innerSize: '80%',
            data: [
                ['Firefox',  45.0],
                ['IE',       26.8],
                ['Chrome',  12.8 ],
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['其他',   0.7]
            ]
        }]
    }	
    var rightPie = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            spacing : [10, 0 , 10, 0]
        },
        colors: ['#55a8ff', '#8ac4ff', '#b0d7ff', '#ffd38a', '#ffad17'],
        title: {
            text: false
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            pointFormat: '<b>占比：{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> /{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
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
   

	function setTime(d) {
		d = Number(d)
		switch(d) {
			case 1: return getDate.getCurrentWeek();
			case 2: return getDate.getCurrentMonth();
			case 3: return getDate.getPreviousMonth();
			case 4: return getDate.getCurrentSeason();
			case 5: return getDate.getCurrentYear();
			case 6: return getDate.getPreviousWeek();
		}
	}
	export default {
		data() {
			return {
				allVal: '',
				all: '全部',
				all_sales: [],
				allManageSales: [],//所有上级领导
				searchData: { //搜索数据
					parentid: '',
					sale_id: '',
					start_date: '',
					end_date: '',
				},
				pickerOptions0: {
			        disabledDate(time) {
			            return time.getTime() > Date.now();
			        }
		        },
		        pickerOptions1: {
			        disabledDate(time) {
			            return time.getTime() > Date.now();
			        }
		        },
		        rightPie,
		        leftPie,
		        quickly: '', //快捷日期
		        quicklyItem, //
			}
		},
		created(){
		  	this.all_sales = Cookie.get('data').allSales
		  	this.allManageSales = Cookie.get('data').allManageSales

			this.$store.dispatch('searchTranAll',{ p: 1 })
			this.$store.dispatch("searchTranList", { p: 1 })
			this.getCircle()
		},
		computed: {
			tranLists() {
				return this.$store.getters.tranLists
			},
			tranTopData() {
				return this.$store.getters.tranTopData
			}
		},
		methods: {
			getFirstDate(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.searchData.start_date = d
				this.pickerOptions1.disabledDate = function(time) {
					return time.getTime() < Date.parse(new Date(this.searchData.start_date)) - 8.64e7 ;
				}.bind(this)
			},
			getLastDate(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.searchData.end_date = d
				this.pickerOptions0.disabledDate = function(time) {
					return time.getTime() > Date.parse(new Date(this.searchData.end_date));
				}.bind(this)
			},
			//快捷选择日期
			quick(d) {
				if(!d) {
					return
				}
				let startstop = setTime(d)
				this.searchData.start_date = startstop[0]
				this.searchData.end_date = startstop[1]
				setTimeout(() => {
					this.quickly = d
				}, 20)
			},
			//根据上级获取下属销售包括自己
			changeSale(id) {
				this.$http.post('/base/getSelfChild', {id: id}).then(d => {
					this.all_sales = d.body.data
				})
				this.searchData.sale_id = ''
			},
			getList(currentPage) {
				this.$store.dispatch("searchTranList", { p: currentPage })
			},
			searchAll() {
				this.$store.dispatch('searchTranAll', this.searchData)
				this.$store.dispatch("searchTranList", this.searchData)
				this.getCircle()
			},
			getCircle() {
				this.$http.post('Sale/stageStatistics', this.searchData).then(function(data) {
		            let d = data.body.data
		            let leftAry = []
		            for(var key in d) {
						let str = d[key].title + '：' + d[key].count
						d[key].rate = Number(d[key].rate.substring(0, d[key].rate.length - 1))
						leftAry.push([str, d[key].rate])
					}
					this.leftPie.series[0].data = leftAry

					new Highcharts.Chart('container', this.leftPie);
		        })
		        this.$http.post('Sale/getKpStatistics', this.searchData).then(function(data) {
		            let d = data.body.data
		            let RightAry = []
		            for(var key in d) {
						let str = d[key].title + '：' + d[key].count
						d[key].rate = Number(d[key].rate.substring(0, d[key].rate.length - 1))
						RightAry.push([str, d[key].rate])
					}
					this.rightPie.series[0].data = RightAry
					new Highcharts.Chart('container1', this.rightPie);
		        })
			}
		},
	}
</script>
<style scoped>
	.nextDate {
		margin-right: 10px;
	}
	.query .nextDate .el-date-editor--date {
		width: 140px;
	}
	.tranList{
	    position: relative;
	    right: 0;
	    left: 0;
	    min-height: 473px;
	}
</style>
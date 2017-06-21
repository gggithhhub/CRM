<template>
	<div>
		<div class="query">
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<!-- <el-select placeholder="上级领导"  v-model="searchData.parentid">
					<el-option :label="all" :value="allVal">
				    </el-option>
				    <el-option v-for="item in allManageSales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select> -->
				<!-- <el-select placeholder="提成级别"  v-model="searchData.level">
					<el-option label="提成级别" :value="allVal">
				    </el-option>
				    <el-option v-for="item in level" :label="item.lable" :value="item.id">
				    </el-option>
				</el-select> -->
				<el-date-picker v-model="start_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions0" @change="getStartMonth"></el-date-picker>
				<el-date-picker v-model="end_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions1" @change="getEndMonth"></el-date-picker>

				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<el-button type="primary" size="small" @click="addTarget" icon="plus" v-if="jurisdiction.addtarget == 1">添加销售目标</el-button>
			</div>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">姓名</div></el-col>
				<el-col :span="2"><div class="grid-content">个人排名</div></el-col>
				<el-col :span="2"><div class="grid-content">上级领导</div></el-col>
				<el-col :span="2"><div class="grid-content">个人目标业绩</div></el-col>
				<el-col :span="2"><div class="grid-content">个人实际完成业绩</div></el-col>
				<el-col :span="2"><div class="grid-content">个人完成率</div></el-col>
				<el-col :span="2"><div class="grid-content">团队目标业绩</div></el-col>
				<el-col :span="2"><div class="grid-content">团队实际完成业绩</div></el-col>
				<el-col :span="2"><div class="grid-content">团队完成率</div></el-col>
				<el-col :span="2"><div class="grid-content">提成级别</div></el-col>
				<el-col :span="2"><div class="grid-content">提成</div></el-col>
				<el-col :span="2"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for='(val, index) in targetLists.list'>
				<el-col :span="2"><div class="grid-content">{{val.realname}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.rank}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.parent}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.target}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.real_target}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.complete_rate}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.team_target}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.team_real_target}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.team_complete_rate}}</div></el-col>
				<!-- <el-col :span="2"><div class="grid-content">-</div></el-col>
				<el-col :span="2"><div class="grid-content">-</div></el-col> -->
				<el-col :span="2"><div class="grid-content">{{val.level}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.commission}}</div></el-col>
				<el-col :span="2"><div class="grid-content">
					<el-button type="text" size="mini" class="textBtn" @click="bianji(val.id, val.realname)" v-if="jurisdiction.updatetarget == 1">编辑</el-button>
				</div></el-col>
			</el-row>
			<div class="footer" style="bottom: -30px;">
				<el-pagination small layout="prev, pager, next" :total="targetLists.count * 10" @current-change="getList"></el-pagination>
			</div>
		</div>

		<div id="container" style="height: 420px; margin-top:45px;min-width:800px;"></div>
		<el-dialog :close-on-click-modal="false" v-model="addDialog" size="tiny" @close="offTarget"> 
			<div class="addTarget">
				<div class="addContent">
					<div class="leftTarger"><span>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</span></div>
					<div class="rightTarger addMonth">
						<el-date-picker v-model="addData.time" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions2" size="small" @change="getMonth"></el-date-picker>
					</div>
				</div>
				<div class="addContent">
					<div class="leftTarger"><span>销售目标</span></div>
					<div class="rightTarger" v-for="(val, index) in addData.addDetial">
						<el-select placeholder="姓名"  v-model="val.name"  size="small" @change='hasSelect'>
						    <el-option v-for="item in addSales" :label="item.realname" :value="item.id" :disabled="item.disabled">
						    </el-option>
						</el-select>

						<el-input v-model="val.target" placeholder="请输入业绩目标（元）" size="small"></el-input>
						
						<el-button type="primary" icon="plus" size="small" @click="addOneMsg"></el-button>
						<el-button type="primary" icon="minus" size="small" @click="removeOneMsg(index)"></el-button>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="offTarget">取 消</el-button>
				<el-button type="primary" @click="sendTarget">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="bjDialog" size="tiny" title="编辑"  @close="offBj">
			<div class="bjContent">
				<div class="bjRow">
					<div class="bjLeft">
						<span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
					</div>
					<div class="bjRight">
						<span>{{bjName}}</span>
					</div>
				</div>
				<div class="bjRow">
					<div class="bjLeft">
						<span>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</span>
					</div>
					<div class="bjRight">
						<el-select placeholder="月份"  v-model="bjData.time" size="small" @change="monthChange">
						    <el-option v-for="item in bjMonth" :label="item.label" :value="item.value">
						    </el-option>
						</el-select>
					</div>
				</div>
				<div class="bjRow">
					<div class="bjLeft">
						<span>业绩目标</span>
					</div>
					<div class="bjRight">
						<el-input v-model="bjData.target" placeholder="目标" size="small"></el-input><span>元</span>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="offBj">取 消</el-button>
				<el-button type="primary" @click="sendBj">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	const level = [
		{
			lable: '无档级（X < 12,511）',
			id: '0, 12511',
		}, {
			lable: 'P0=4%(12,511 ≤ X < 25,015)',
			id: '12511, 25015',
		}, {
			lable: 'P1=5%(25,015 ≤ X < 35,842)',
			id: '25015, 35842',
		}, {
			lable: 'P2=5.25%(35,842 ≤ X < 54,957)',
			id: '35842, 54957',
		}, {
			lable: 'P3=5.5%(54,957 ≤ X < 89,605)',
			id: '54957, 89605',
		}, {
			lable: 'P4=6%(89,605 ≤ X < 162,069)',
			id: '89605, 162069',
		}, {
			lable: 'P5=6.6%(162,069 ≤ X < 279,825)',
			id: '162069, 279825',
		}, {
			lable: 'P6=7.2%(279,825 ≤ X < 424,499)',
			id: '279825, 424499',
		}, {
			lable: 'P7=7.8%(424,499 ≤ X < 722,977)）',
			id: '424499, 722977',
		}, {
			lable: 'P8=7.9%(722,977 ≤ X < 1,073,992)',
			id: '722977, 1073992',
		}, {
			lable: 'P9=7.95%(1,073,992 ≤ X < 1,653,334)',
			id: '1073992, 1653334',
		}, {
			lable: 'P10=8%(X ≥ 1,653,334)',
			id: '1653334',
		}, 
	]

	var histogram = {
        chart: {
            type: 'column'
        },
        title: {
            text: '完成情况统计图'
        },
        subtitle: {
            text: null
        },
        colors: ['#56a8fe', '#ffc150'],
        xAxis: {
            categories: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
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
            }
        },
        series: [{
            name: '目标',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            name: '完成',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
        }]
    }

	var date = new Date;
	var year = date.getFullYear(); 
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" + month : month); 

	import Cookie from '../../vuex/cookie.js'
	export default {
		data() {
			return {
				searchData: {
					sale_id:  '',
					// parentid: '',
					level: '',
					start_date: year + '-' + month + '-' + '01',
					end_date: year + '-' + month + '-' + '01'
				},
				//日期
				end_date: year + '-' + month,
				start_date: year + '-' + month,

				allVal: '',
				all: '全部',
				pickerOptions0: {
					disabledDate(time) {
						return false;
					}
				},
				pickerOptions1: {
					disabledDate(time) {
						return false;
					}
				},
				all_sales: [],
				allManageSales: [],//所有上级领导
				level,
				//添加
				pickerOptions2: {
					disabledDate(time) {
						return time.getTime()  < Date.now() - 8.64e7 - 267840000;
					}
				},
				addSales: [], //可以添加的销售

				addDialog: false,
				addData: {
					time: year + '-' + month + '-' + '01',
					addDetial: [
						{name: '', target: ''}
					]
				},
				//编辑
				bjDialog: false,
				bjData: {
					name: '',
					time: '',
					target: '',
				},
				bjMonth: [],//获取编辑月份
				bjMoney: [],
				bjName: '',//获取编辑的名字
				//柱状图
				histogram,
			}
		},
		created() {
			var positionid = Cookie.get('data').position_id
			if(positionid <= 2 || positionid == 9 || positionid == 8 || positionid == 7) {
					this.all_sales = Cookie.get('data').allSales
			} else {
				Cookie.get('data').childSales.forEach((val, index) => {
					if(val.realname == Cookie.get('data').username) {
						this.all_sales.push(Cookie.get('data').childSales[index])
					}
				})
			}
			
		  	// this.allManageSales = Cookie.get('data').allManageSales
		  	this.$store.dispatch("searchTargetList", this.searchData)
		  	// setTimeout(() => {
		  	// 	new Highcharts.Chart('container', this.histogram);
		  	// },20)

		  	this.changeTarget(1)
		  	
		},
		computed: {
			targetLists() {
				return this.$store.getters.targetLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.sale
			},
		},
		methods: {
			searchAlllist() {
				this.$store.dispatch("searchTargetList", this.searchData)
				this.changeTarget()
			},
			getStartMonth(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.searchData.start_date = !d ? d : d + '-01'
				this.pickerOptions1.disabledDate = function(time) {
					return time.getTime() <= Date.parse(new Date(this.searchData.start_date)) - 8.64e7 - 267840000;
				}.bind(this)
			},
			getEndMonth(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.searchData.end_date = !d ? d : d + '-01'
				this.pickerOptions0.disabledDate = function(time) {
					return time.getTime() >= Date.parse(new Date(this.searchData.end_date))  - 8.64e7 + 267840000;
				}.bind(this)
			},
			getList(currentPage) {
				this.$store.dispatch("searchTargetList", { p: currentPage })
			},
			//添加销售目标
			addTarget() {
				this.addDialog = true
				this.$http.post('/base/getNotTargetSale', {time: this.addData.time}).then(d => {
					this.addSales = d.body.data
				})
			},
			addOneMsg() {
				this.addData.addDetial.push({name: '', target: ''})
			},
			removeOneMsg(index) {
				if(this.addData.addDetial.length > 1) {
					this.addData.addDetial.splice(index, 1)
				}
			},
			offTarget() {
				this.addDialog = false
				this.addData = {
					time: year + '-' + month + '-' + '01',
					addDetial: [
						{name: '', target: ''}
					]
				}
				this.addSales = []
			},
			sendTarget() {
				if(!this.addData.time) {
					this.$notify.error({
			    		title: '错误',
			    		message: '请选择时间'
			    	})
			    	return
				}
				for(let i = 0; i < this.addData.addDetial.length; i++) {
					var val = this.addData.addDetial[i]
					if(val.name == '') {
						this.$notify.error({
				    		title: '错误',
				    		message: '请选择姓名'
				    	})
				    	return
					}
					if(!(Number(val.target) > 0)) {
						this.$notify.error({
				    		title: '错误',
				    		message: '请输入正确的金额'
				    	})
				    	return
					}
				}


				this.$http.post('/Sale/addTarget', this.addData).then( d => {
					if(d.body.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '添加成功',
				    		type: 'success'
				    	})
				    	this.offTarget()
						this.$store.dispatch("searchTargetList", this.searchData)
					} else {
						this.$notify.error({
				    		title: '错误',
				    		message: '添加失败'
				    	})
					}
					
				})
				
			},
			getMonth(d) {
				this.addData.time = !d ? '' : d + '-01'
				if(d) {
					this.$http.post('/base/getNotTargetSale', {time: this.addData.time}).then(d => {
						this.addSales = d.body.data
						//清空已选中的销售
						for(let i = 0; i < this.addData.addDetial.length; i++) {
							let data = this.addData.addDetial[i]
							data.name = ''
							data.target = ''
						}
					})
				}
			},
			hasSelect(d) {
				for(let i = 0; i < this.addData.addDetial.length; i++) {
					let id = this.addData.addDetial[i].name
					for(let j = 0; j < this.addSales.length; j++) {
						//第一遍先全可选
						if(i == 0) {
							this.addSales[j].disabled = false
						}
						//再禁用选中的
						if(this.addSales[j]['id'] == id) {
							this.addSales[j].disabled = true
						}
					}
				}
				this.addData.addDetial.push({name: '', target: ''})
				this.addData.addDetial.splice(this.addData.addDetial.length - 1, 1)
			},
			//编辑
			bianji(id, name) {
				this.bjDialog = true
				this.bjData.name = id
				this.bjName = name
				this.$http.post('/base/getSaleTargetTime', {id: id}).then(d => {
					for(let i = 0; i < d.body.data.length; i++) {
						this.bjMonth.push({value: d.body.data[i].date, label: d.body.data[i].date.slice(0, 7)})
						this.bjMoney = d.body.data
						//默认第一个月
					}
					this.bjData.time = this.bjMonth[0].value

				})
			},
			monthChange(d) {
				//金钱自动变化
				for(let i = 0; i < this.bjMoney.length; i++) {
					if(this.bjMoney[i].date == d) {
						this.bjData.target = this.bjMoney[i].target
					}
				}
			},
			offBj() {
				this.bjDialog = false
				this.bjData =  {
					name: '',
					time: '',
					target: '',
				}
				this.bjMonth = []
				this.bjName = ''
			},
			sendBj() {
				if(!this.bjData.time) {
					this.$notify.error({
			    		title: '错误',
			    		message: '请选择时间'
			    	})
			    	return
				}
				if(!this.bjData.target) {
					this.$notify.error({
			    		title: '错误',
			    		message: '请输入业绩目标'
			    	})
			    	return
				}
				if(!(Number(this.bjData.target) > 0)) {
					this.$notify.error({
			    		title: '错误',
			    		message: '请输入正确的业绩目标'
			    	})
			    	return
				}
				this.$http.post('/sale/updateTarget', this.bjData).then(d => {
					if(d.body.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '编辑成功',
				    		type: 'success'
				    	})
				    	this.offBj()
						this.$store.dispatch("searchTargetList", this.searchData)
					} else {
						this.$notify.error({
				    		title: '错误',
				    		message: '编辑失败'
				    	})
					}

				})
			},

			changeTarget(type) {
				if(type == 1) { //第一次传type 时间
					var type = {}
					type.start_date = this.searchData.start_date
					type.end_date = this.searchData.end_date
					type.type = 1
				} else {
					var type = this.searchData
				}
				this.$http.post('Sale/targetHistogram', type).then(d => {
					var data = d.body.data
					this.histogram.xAxis.categories = []
					this.histogram.series[0].data = []
					this.histogram.series[1].data = []
					for(let i = 0; i < data.length; i++){
						this.histogram.xAxis.categories[i] = data[i].realname
						this.histogram.series[0].data[i] = data[i].target - 0
						this.histogram.series[1].data[i] = data[i].real_target - 0
					}

					new Highcharts.Chart('container', this.histogram);
				})
			},
		},
	}
</script>
<style scoped>
	.el-date-editor.el-input {
	    width: 127px;
	}
	.addTarget {
		width: 97%;
		padding: 0 3%;
		overflow: hidden;
	}
	.addTarget .addContent {
		height: 30px;
		width: 100%;
		margin-top: 10px;
	}
	.addTarget .leftTarger {
		float: left;
		width: 66px;
		height: 30px;
		line-height: 30px;
	}
	.addTarget .rightTarger {
		float: right;
		width: 310px;
		height: 30px;
		margin-bottom: 10px;
	}
	.addTarget .addMonth .el-date-editor.el-input {
	    width: 180px;
	}
	.addTarget .el-select {
		width: 75px;
	}
	.addTarget .el-input {
		width: 150px;
	}
	.addTarget .addContent .el-button {
		margin-left: -1px;
	}
	.allList .textBtn {
		margin: 0;
	}
	

	.bjContent {
		width: 97%;
		padding: 0 3%;
		overflow: hidden;
	}
	.bjContent .bjRow {
		height: 30px;
		width: 100%;
		margin-top: 10px;
	}
	.bjContent .bjLeft {
		float: left;
		width: 66px;
		height: 30px;
		line-height: 30px;
	}
	.bjContent .bjRight {
		float: right;
		width: 310px;
		height: 30px;
		margin-bottom: 10px;
		line-height: 30px;
	}
	.bjContent .bjRight .el-input {
		width: 180px;
		margin-right: 5px;
	}

	.allList {
		position: relative;
		top: 0;
	}
</style>
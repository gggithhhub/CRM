<template>
<div>
	<div class="searchName">
		<el-input placeholder="客户名称/联系人" icon="search" v-model="searchData.username" @change="changUsername" :on-icon-click="handleIconClick" v-if="showName">
		</el-input>
	</div>
	<div class="leftBtn">
		<span v-if="bt">查询：</span>
		<el-select placeholder="行业"  v-model="searchData.industry_id" v-if="showIndustry_id">
		    <el-option v-for="item in all_industry" :label="item.name" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="负责销售"  v-model="searchData.sale_id" v-if="showSale_id">
		    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="负责售后"  v-model="searchData.after_sale_id" v-if="showAfter_sale_id">
		    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="投放类型"  v-model="searchData.put_type" v-if="showPut_type">
		    <el-option label="PC" value="0"></el-option>
		    <el-option label="无线" value="1"></el-option>
		</el-select>

		<el-select placeholder="投放地区"  v-model="searchData.put_province" v-if="showPut_province">
			<el-option  v-for="item in allprovince"  :label="item.name" :value="item.id"></el-option>
		</el-select>

		<el-select placeholder="提成级别"  v-model="searchData.level" v-if="showLevel">
		    <el-option v-for="item in level" :label="item.lable" :value="item.id"></el-option>
		</el-select>

		<el-date-picker v-model="searchData.start_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions0" @change="getStartMonth" v-if="showMonth"></el-date-picker>

		<el-date-picker v-model="searchData.end_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions1" @change="getEndMonth" v-if="showMonth"></el-date-picker>
		
		<el-date-picker v-model="searchData.start_date" type="date" placeholder="选择日期" :editable=false :picker-options="pickerOptions2" @change="getStartDate" v-if="showDate"></el-date-picker>

		<el-date-picker v-model="searchData.end_date" type="date" placeholder="选择日期" :editable=false :picker-options="pickerOptions3" @change="getEndDate" v-if="showDate"></el-date-picker>

		<el-button type="primary" size="small" @click="searchAlllist" v-if="bt">查询</el-button>
	</div>
	<div class="rightBtn">
		<el-button type="primary"size="small" @click="goBack">返回上一级</el-button>
	</div>
</div>
</template>
<script>
	import Cookie from '../../../vuex/cookie.js'
	import getDate from '../../../js/common.js'
	
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
	
	export default {
		created() {
			this.$http.post('/base/getProvince').then(d => {
 				this.allprovince = d.body.data
 			})

 			
		},
		data() {
			return {
				searchData: {
					username: '',
					put_type: '',
					sale_id: '',
					after_sale_id: '',
					industry_id: '',
					put_province: '',
					start_date: '',
					end_date: '',
					level: '',
				},
				level,
				pickerOptions0: {
					disabledDate(time) {
						return false;
					}
				},
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() < Date.parse(new Date());
					}
				},
				pickerOptions2: {
					disabledDate(time) {
						return false;
					}
				},
				pickerOptions3: {
					disabledDate(time) {
						return time.getTime() < Date.parse(new Date());
					}
				},
				allprovince: [],
			}
		},
		computed: {
			all_sales() {
				return Cookie.get('data').childSales
			},
			all_after_sales() {
				return Cookie.get('data').childAfterSales
			},
			all_industry() {
				return Cookie.get('data').industry
			},
			showName() {
				if(this.$route.path.indexOf('active') > -1) {
					return false
				}
				return true
			},
			showIndustry_id() {
				if(this.$route.path.indexOf('recharge') > -1) {
					return true
				}
				return false
			},
			showSale_id() {
				if(this.$route.path.indexOf('active') > -1) {
					return false
				}
				return true
			},
			showAfter_sale_id() {
				if(this.$route.path.indexOf('active') > -1 || this.$route.path.indexOf('premiumDown') > -1 || this.$route.path.indexOf('commissionDetail') > -1 || this.$route.path.indexOf('commission') > -1 || this.$route.path.indexOf('demandTable') > -1 || this.$route.path.indexOf('premiumUp') > -1 || this.$route.path.indexOf('check') > -1) {
					return false
				}
				return true
			},
			showPut_type() {
				if(this.$route.path.indexOf('premiumDown') > -1 || this.$route.path.indexOf('consume') > -1 || this.$route.path.indexOf('premiumUp') > -1 || this.$route.path.indexOf('commissionDetail') > -1 ) {
					return true
				}
				return false
			},
			showPut_province() {
				if(this.$route.path.indexOf('consume') > -1 || this.$route.path.indexOf('premiumDown') > -1 || this.$route.path.indexOf('commissionDetail') > -1 || this.$route.path.indexOf('premiumUp') > -1) {
					return true
				}
				return false
			},
			showLevel() {
				if(this.$route.path.indexOf('commissionDetail') > -1 || this.$route.path.indexOf('commission') > -1) {
					return true
				}
				return false
			},
			showMonth() {

				//如果router里有值 就带上值
				if(this.$route.params.hasOwnProperty('sale_id')) {
					this.searchData.sale_id = this.$route.params.sale_id
				}
				if(this.$route.params.hasOwnProperty('username')) {
					this.searchData.username = this.$route.params.username
				}
				if(this.$route.params.hasOwnProperty('demand_id')) {
					this.searchData.demand_id = this.$route.params.demand_id
				}
				if(this.$route.params.hasOwnProperty('start_date')) {
					this.searchData.start_date = this.$route.params.start_date + ' 00:00:00'
					this.searchData.end_date = new Date().format("yyyy-MM-dd") + ' 23:59:59'
				}
				if(this.$route.params.hasOwnProperty('date')) {
					this.searchData.start_date = this.$route.params.date + ' 00:00:00'
					this.searchData.end_date = new Date(getDate.getPreviousMonth()[1]).format('yyyy-MM-dd') + ' 23:59:59'
				}

				
				if(this.$route.path.indexOf('commission') == -1 || this.$route.path.indexOf('commissionDetail') > -1) {
					//请求放到这里了
					this.searchAlllist()
					return false
				}
	 			if(!this.searchData.start_date) {
	 				this.searchData.start_date = new Date(getDate.getCurrentMonth()[0]).format('yyyy-MM-dd')  + ' 00:00:00'
					this.searchData.end_date = new Date(getDate.getCurrentMonth()[1]).format('yyyy-MM-dd')  + ' 23:59:59'
	 			}
	 			
	 			this.searchAlllist()

				return true
			},
			showDate() {

				if(this.$route.path.indexOf('consume') > -1 || this.$route.path.indexOf('commissionDetail') > -1 || this.$route.path.indexOf('premiumUp') > -1 || this.$route.path.indexOf('premiumDown') > -1) {
					this.searchData.start_date = new Date(getDate.getCurrentMonth()[0]).format('yyyy-MM-dd')  + ' 00:00:00'
					this.searchData.end_date = new Date(getDate.getCurrentMonth()[1]).format('yyyy-MM-dd')  + ' 23:59:59'
					return true
				} else {
					return false
				}
			},
			bt() {
				if(this.$route.path.indexOf('active') > -1) {
					return false
				}
				return true
			},
		},
		methods: {
			searchAlllist() {
				if(this.$route.path.indexOf('consume') > -1) {
					this.searchName('userConsumeReport')
					return
				}
				if(this.$route.path.indexOf('recharge') > -1) {
					this.searchName('userRechargeReport')
					return
				}
				if(this.$route.path.indexOf('active') > -1) {
					this.searchName('userActiveReport')
					return
				}
				if(this.$route.path.indexOf('demandTable') > -1) {
					this.searchName('demandSummary')
					return
				}
				if(this.$route.path.indexOf('commissionDetail') > -1) {//放上边面 短路操作
					this.searchName('commissionDetail')
					return
				}
				if(this.$route.path.indexOf('commission') > -1) {
					this.searchName('commissionOverview')
					return
				}
				if(this.$route.path.indexOf('premiumUp') > -1) {
					this.searchName('premiumDetaile')
					return
				}
				if(this.$route.path.indexOf('premiumDown') > -1) {
					this.searchName('depreciationDetaile')
					return
				}
				if(this.$route.path.indexOf('accounting') > -1) {
					this.searchName('paymentBusiness')
					return
				}
				if(this.$route.path.indexOf('check') > -1) {
					this.searchName('demandCheckData')
					return
				}
			},
			searchName(str) {
				this.$store.dispatch('searchReportList', {searchData: this.searchData, url: str})
			}, 
			goBack() {
				this.$router.go(-1)
			},
			getStartMonth(d) {
				if(!d) {
					d = ''
					this.searchData.start_date = ''
				} else {
					this.searchData.start_date = d + '-01' + ' 00:00:00'
				}
				// this.quickly = ''
				this.pickerOptions1.disabledDate = function(time) {
					return time.getTime() <= Date.parse(new Date(this.searchData.start_date));
				}.bind(this)
			},
			getEndMonth(d) {
				if(!d) {
					d = ''
					this.searchData.end_date = ''
				} else {
					var day = getDate.getMonthDays(d.split('-')[0], Number(d.split('-')[1]) - 1)
					this.searchData.end_date = d + '-' + day + ' 23:59:59'
				}
				// this.quickly = ''
				
				this.pickerOptions0.disabledDate = function(time) {
					return time.getTime() >= Date.parse(new Date(this.searchData.end_date));
				}.bind(this)
			},

			getStartDate(d) {
				if(!d) {
					d = ''
					this.searchData.start_date = ''
				} else {
					this.searchData.start_date = d + ' 00:00:00'
				}
				// this.quickly = ''
				this.pickerOptions3.disabledDate = function(time) {
					return time.getTime() <= Date.parse(new Date(this.searchData.start_date));
				}.bind(this)
			},
			getEndDate(d) {
				if(!d) {
					d = ''
					this.searchData.end_date = ''
				} else {
					this.searchData.end_date = d + ' 23:59:59'
				}
				// this.quickly = ''
				
				this.pickerOptions2.disabledDate = function(time) {
					return time.getTime() >= Date.parse(new Date(this.searchData.end_date));
				}.bind(this)
			},

			handleIconClick() {
				this.searchAlllist()
			}
		}

	}
</script>
<style scoped>
	.el-date-editor.el-input {
		width: 120px;
		margin-right: 10px;
	}
</style>
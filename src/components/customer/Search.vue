<template>
<div>
	<div class="searchName">
		<el-input placeholder="客户名称" icon="search" v-model="username" @change="changUsername" :on-icon-click="handleIconClick">
		</el-input>
	</div>
	<div class="leftBtn">
		<span>查询：</span>
		<el-select placeholder="客户状态"  v-model="searchData.type_id" v-if="isDeal">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option label="待充值" value="1"></el-option>
	    	<el-option label="待消耗" value="2"></el-option>
	    	<el-option label="消耗中" value="3"></el-option>
		</el-select>
		<el-select placeholder="负责销售"  v-model="searchData.sale_id" v-if="secretary">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="客户状态"  v-model="searchData.level" v-if="secretary && !isDeal">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in level" :label="item.label" :value="item.value">
		    </el-option>
		</el-select>
		<el-select placeholder="行业"  v-model="searchData.industry_id">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in all_industry" :label="item.name" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="负责售后"  v-model="searchData.after_sale_id">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>
		<div class="nextDate" v-if="secretary && !isDeal">
			<el-date-picker v-model="searchData.return_time" type="date" placeholder="下次回访" :picker-options="pickerOptions0" :editable=false :clearable=true @change="getDate">
			</el-date-picker>
		</div>

		<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
	</div>
</div>
</template>
<script type="text/javascript">
	import Cookie from '../../vuex/cookie.js'
	const level = [{
			value: '1',
			label: '未联系'
		}, {
			value: '2',
			label: '联系失败'
		}, {
			value: '3',
			label: '联系成功'
		}, {
			value: '4',
			label: '触达KP'
		}, {
			value: '5',
			label: '发送资料/案例'
		}, {
			value: '6',
			label: '方案/报价议价'
		}, {
			value: '7',
			label: '签约(未打款)'
		}, {
			value: '0',
			label: '洽谈失败'
		}
	]

	// const after = [{
	// 	value: '选项0',
	// 	label: '负责售后'
	// }]
	export default {
		created(){
		  	this.all_industry = Cookie.get('data').industry
		  	this.all_sales = Cookie.get('data').childSales
		  	this.all_after_sales = Cookie.get('data').childAfterSales

			if(Cookie.get('data').position_id == 6 && this.$route.path.indexOf('deal') > 0) {

		  		this.all_after_sales = Cookie.get('data').allAfterSales
			}
			this.username = this.$store.getters.all_state.username
		},
		data(){
			return {
				all_after_sales: [],
				all_industry: [],
				all_sales: [],

				allVal: ' ',
				all: '全部',
				// searchData: {//搜索的数据
				// 	sale_id: '',
				// 	level: '',
				// 	industry_id: '',
				// 	after_sale_id: '',
				// 	return_time: '',
				// 	type_id: '',
				// 	p: 1
				// },
				username: '',
				
				level,
				pickerOptions0: {
			        disabledDate(time) {
			            return time.getTime() < Date.now() - 8.64e7;
			        }
		        },
			}
		},
		computed: {
			isDeal() {
				if(this.$route.path.indexOf('deal') > -1) {
					return true
				}
				return false
			},
			//5的时候为内勤
			secretary() {
				if(this.$route.path.indexOf('allcus') > 0 && Cookie.get('data').position_id == 5) {
					return false
				} 
				if(this.$route.path.indexOf('common') > 0) {
					return false
				}
				return true
			},
			searchData() {
				if(this.$route.path.indexOf('allcus') > -1) {
					return this.$store.getters.all_state.allcusSearchData
				}
				if(this.$route.path.indexOf('deal') >  -1) {
					return this.$store.getters.all_state.dealSearchData
				}
				if(this.$route.path.indexOf('record') > -1) {
					return this.$store.getters.all_state.recordSearchData
				}
				if(this.$route.path.indexOf('common') > -1) {
					return this.$store.getters.all_state.commonSearchData
				}
			},
			
		},
		methods: {
			searchAlllist() {
				//根据路由判断调用哪个接口
				if(this.$route.path.indexOf('allcus') > -1) {
					this.$store.dispatch('searchAllcusList', this.searchData)
				}
				if(this.$route.path.indexOf('deal') >  -1) {
					this.$store.dispatch('searchDealList', this.searchData)
				}
				if(this.$route.path.indexOf('record') > -1) {
					this.$store.dispatch('searchRecordList', this.searchData)
				}
				if(this.$route.path.indexOf('common') > -1) {
					this.$store.dispatch('searchCommonList', this.searchData)
				}
			},
			//获取时间
			getDate(d) {
				if(!d) {
					d = ''
				}
				this.searchData.return_time = d
			},

			changUsername() {
				console.log(this.username)

				this.$store.commit('changeUsername', { username: this.username })
			},

			handleIconClick() {
				if(this.username == '') {
					this.searchData.p = 1
					this.searchAlllist()
					return
				} else {
					for(var key in this.searchData) {
						this.searchData[key] = ''
					}
					this.searchData.p = 1
					this.searchAlllist()
				}
			}
		}
	}
</script>
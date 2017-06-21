<template>
<div>

	<div class="searchName">
		<el-input placeholder="客户/方案 名称" icon="search" v-model="username" @change="changUsername" :on-icon-click="handleIconClick">
		</el-input>
	</div>


	<div class="leftBtn">
		<span>查询：</span>
		<el-select placeholder="负责销售"  v-model="searchData.sale_id">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>
		<el-select placeholder="方案状态"  v-model="searchData.status">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in zd" :label="item.label" :value="item.value">
		    </el-option>
		</el-select>
		<el-select placeholder="负责售后"  v-model="searchData.after_sale_id">
			<el-option :label="all" :value="allVal">
		    </el-option>
		    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
		    </el-option>
		</el-select>

		<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
	</div>
</div>
</template>
<script type="text/javascript">
	import Cookie from '../../vuex/cookie.js'
	const level = [{
			value: '1',
			label: 'A级：潜在客户'
		}, {
			value: '2',
			label: 'B级：普通客户'
		}, {
			value: '3',
			label: 'C级：意向客户'
		}, {
			value: '4',
			label: 'D级：关键客户'
		}, {
			value: '5',
			label: 'E级：无意向客户'
		}
	]

	const zd = [{
		value: '3',
		label: '待制定'
	}, {
		value: '1',
		label: '制定中'
	}, {
		value: '2',
		label: '已完成'
	}, ]

	export default {
		created(){
			this.all_after_sales = Cookie.get('data').allAfterSales
			this.all_sales = Cookie.get('data').allSales
			this.username = this.$store.getters.all_state.username
		},
		data(){
			return {
				all_after_sales: [],
				all_industry: [],
				all_sales: [],

				allVal: '-1',
				all: '全部',
				username: '',
				zd,
				level,

			}
		},
		computed: {
			isDeal() {
				if(this.$route.path.indexOf('deal') == -1) {
					return true
				}
				return false
			},
			searchData() {
				if(this.$route.path.indexOf('scheme') > -1) {
					return this.$store.getters.all_state.schemeSearchData
				}
				if(this.$route.path.indexOf('target') >  -1) {
					return this.$store.getters.all_state.targetSearchData
				}
				if(this.$route.path.indexOf('transition') > -1) {
					return this.$store.getters.all_state.tranSearchData
				}
				if(this.$route.path.indexOf('manage') > -1) {
					return this.$store.getters.all_state.manageSearchData
				}
			},
		},
		methods: {
			searchAlllist() {
				//根据路由判断调用哪个接口
				if(this.$route.path.indexOf('scheme') > 0) {
					this.$store.dispatch('searchSchemeList',this.searchData)
				}
				if(this.$route.path.indexOf('manage') > 0) {
					this.$store.dispatch('searchManageList',this.searchData)
				}
			},

			changUsername() {
				this.$store.commit('changeUsername', { username: this.username })
			},

			handleIconClick() {
				if(this.username == '') {
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
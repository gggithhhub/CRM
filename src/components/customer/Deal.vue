<template>
	<div>
		<div class="query">
			<search></search>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">创建时间</div></el-col>
				<el-col :span="2"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="2"><div class="grid-content">客户状态</div></el-col>
				<el-col :span="2"><div class="grid-content">客户余额</div></el-col>
				<el-col :span="2"><div class="grid-content">累计消耗</div></el-col>
				<el-col :span="2"><div class="grid-content">行业</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="4"><div class="grid-content">详情</div></el-col>
				<el-col :span="4"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in dealLists.list">
				<el-col :span="2"><div class="grid-content">{{val.check_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content" style="cursor: pointer">
					<router-link tag="span" :to="{name:'dealDetails', params: {id: val.id}}" v-if="jurisdiction.getdealdetails == 1">
					{{val.username}}
					</router-link>
					<span v-if="jurisdiction.getdealdetails != 1">{{val.username}}</span>
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.type_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.balance}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.consume}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.industry_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.alter_sale_name}}</div></el-col>
				<el-col :span="4"><div class="grid-content"><span class="bjText">{{val.detail}}</span></div></el-col>
				<el-col :span="4"><div class="grid-content">
					<el-button type="text"  size="mini" v-if="val.btn == 1 && jurisdiction.editdealuser == 1"><router-link :to="{name:'Bianji',params: {id:val.id, type: 'deal'}}" tag="span">编辑</router-link></el-button>

					<el-dropdown>
						<span class="el-dropdown-link">
							更多<i class="el-icon-caret-bottom el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item v-if="val.btn_make_plan == 1">
								<el-button type="text" size="mini" @click="schemed(val.id)">制定方案</el-button>
							</el-dropdown-item>
							<el-dropdown-item v-if="jurisdiction.recharge == 1 && val.btn == 1">
								<el-button type="text" size="mini" @click="openSigned(val.username, val.id)">充值</el-button>
							</el-dropdown-item>
							<el-dropdown-item v-if="val.btn == 1">
								<router-link :to="{name: 'AddDemand', params: {id: val.id, name: val.username}}">
									<el-button type="text" size="mini" class="textBtn">需求确认</el-button>
								</router-link>
							</el-dropdown-item>
							<el-dropdown-item v-if="val.btn == 1">
								<el-button type="text" size="mini" @click="schemed(val.id)">制定方案</el-button>
							</el-dropdown-item>
							<el-dropdown-item  v-if="val.btn == 1 && refundadd == 1">
								<router-link :to="{name: 'addRefund', params: {id: val.id, name: val.username, sale_name: val.sale_name, alter_sale_name: val.alter_sale_name}}" tag="span">
									<el-button type="text" size="mini" @click="compileBtn(val.id, val.detail)">退款</el-button>
								</router-link>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</div></el-col>
			</el-row>
		</div>

		<div class="footer">
		<!-- @current-change="getList"  -->
			<el-pagination small layout="prev, pager, next" :total="dealLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>


  		<div class="scheme">
		<el-dialog :close-on-click-modal="false" v-model="schemeIsOpen" size="tiny" >
			<el-form :model="scheme" ref="scheme" label-width="100px" class="demo-ruleForm">
				<el-form-item label="预计完成时间:">
			    	<el-date-picker
						type="date"
						placeholder="预计完成时间"
						@change="getDate"
						v-model="scheme.estimated_time"
						:picker-options="pickerOptions0"
						:editable=false>
				    </el-date-picker>
				</el-form-item>

			    <el-form-item label="需求描述:">
				    <el-input type="textarea" v-model="scheme.describe"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeSchemed">取 消</el-button>
				<el-button type="primary" @click="schemeSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>

	<signed></signed>
	</div>
</template>
<script>
	import Search from './Search.vue'
	import Signed from './Signed.vue'
	import Cookie from '../../vuex/cookie.js'
	export default {
		data() {
			return {
				form: {
					detail: '',
					user_id: ''
				},

				schemeIsOpen: false,
				scheme: {//制定方案
					estimated_time: '',
					describe: '',
					user_id: '',
				}, 
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
			}
		},
		created() {
			//组件加载完成获取列表
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchDealList')
			} ,200)
		},
		components: {
			'search': Search,
			'signed': Signed
		},
		computed: {
			dealLists() {
				return this.$store.getters.dealLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.customer
			},
			refundadd() { //权限
				return Cookie.get('data').operation.finance.refundadd
			},
			currentPage() {
				return this.$store.getters.all_state.dealSearchData.p || 1
			}
		},
		methods: {
			goto(id) {
				if(this.jurisdiction.getdealdetails == 1) {
					this.$router.push({name:'dealDetails',params: {id: id}})
				}
			},
			//翻页
			getList(currentPage) {
				this.$store.dispatch('searchDealList', {p: currentPage})
			},

			//打开制定方案将id传进scheme
			schemed(id) {
				this.schemeIsOpen = true
				this.scheme.user_id = id
			},
			//关闭指定方案并清空数据
			closeSchemed() {
				this.schemeIsOpen = false
				for(var key in this.scheme) {
					this.scheme[key] = ''
				}
			},
			//制定方案点击确定
			schemeSubmit() {
				let that = this
				this.$http.post('/customer/makePlan', this.scheme).then(function(data){
					if(data.data = 1) {
						that.$notify({
				    		title: '成功',
				    		message: '制定方案成功',
				    		type: 'success'
				    	})
				    	this.$router.push({path:'/market/scheme'})
					} else {
						that.$notify.error({
				    		title: '失败',
				    		message: '制定方案失败',
				    	})
					}
					that.closeSchemed()
				})
			},
			//制定方案时间
			getDate(d) {
				this.scheme.estimated_time = d
			},

			//打开或关闭签约客户弹窗
			openSigned(name, user_id) {
				this.$store.commit('openOrCloseSigned', {name: name, user_id:user_id})
			},
		}
	}
</script>
<style scoped>
</style>
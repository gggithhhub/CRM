<template>
	<div>
		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="返现/反量"  v-model="searchData.return_cash_type">
					<el-option label="返现/反量" :value="allVal"></el-option>
				    <el-option label="充值返现" value="1"></el-option>
				    <el-option label="消耗百分比返" value="2"></el-option>
				    <el-option label="差价返" value="3"></el-option>
				</el-select>
				<el-select placeholder="状态"  v-model="searchData.type">
					<el-option label="状态" :value="allVal">
				    </el-option>
				    <el-option label="无" value="1"></el-option>
				    <el-option label="返现(正价)" value="2"></el-option>
				    <el-option label="返现(跌价)" value="3"></el-option>
				    <el-option label="反量" value="4"></el-option>
				</el-select>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<el-select placeholder="负责售后"  v-model="searchData.after_sale_id">
					<el-option label="负责售后" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>

				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn" v-if="jurisdiction.demandadd == 1">
				<el-button type="primary" size="small" @click="addDem" icon="plus">添加需求单</el-button>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">提交日期</div></el-col>
				<el-col :span="4"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="4"><div class="grid-content">需求单名称</div></el-col>
				<el-col :span="2"><div class="grid-content">返现/反量</div></el-col>
				<el-col :span="3"><div class="grid-content">审核状态</div></el-col>
				<el-col :span="2"><div class="grid-content">下级订单</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="3"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allDemList.list">
				<el-col :span="2"><div class="grid-content">{{val.create_time | time}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="4"><div class="grid-content detailColor" style="cursor: pointer" @click="showDetail(index, val.id)">{{val.demand_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.type | deType}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.status | deStatus}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.orderCount}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.after_sale}}</div></el-col>
				<el-col :span="3"><div class="grid-content">
					<el-button type="text" size="mini" v-if="val.status == 0 && jurisdiction.demandcheck == 1 && val.but_check == 1" @click="checkOpen(val.id)">审核</el-button>
					<el-button type="text" size="mini" v-if="val.status == 1 && jurisdiction.demandcheck == 1 && val.but_check == 1" @click="checkOpen(val.id)">审核</el-button>
					
					<el-button type="text" size="mini" v-if="val.status != 9 && val.status != 2 && val.but_edit == 1 && jurisdiction.demandedit == 1">
						<router-link :to="{name: 'redDemand', params: {id:val.id}}" tag="span">编辑</router-link>
					</el-button>

					<el-button type="text" size="mini" v-if="val.status == 2 && val.but_edit == 1 &&jurisdiction.demandedit == 1">
						<router-link :to="{name: 'redDemand', params: {id:val.id}}" tag="span">重新提交</router-link>
					</el-button>

					<el-button type="text" size="mini" v-if="val.status == 9 && jurisdiction.demandupdate == 1 && val.but_change == 1">
						<router-link :to="{name: 'changeDemand', params: {id:val.id}}" tag="span">变更</router-link>
					</el-button>
						
					<el-button type="text" size="mini" v-if="val.status == 9 && jurisdiction.orderadd == 1 && val.but_order == 1">
						<router-link :to="{name: 'AddIndent', params: {id:val.id, username: val.username, demand_name: val.demand_name, type: val.type, return_cash_type: val.return_cash_type, return_cash_num: val.return_cash_num}}" tag="span">添加订单</router-link>
					</el-button>

					<router-link :to="{name: 'addQuantity', params: {user_id: val.user_id, username: val.username, demand_id: val.id, demand_name: val.demand_name, type: val.return_flow}}" tag="span" style="cursor: pointer">
						<el-button type="text" size="mini" v-if="val.status == 9 && val.type == 4 && fxfl && val.but_amount == 1">返量</el-button>
					</router-link>



					<router-link :to="{name: 'addCash', params: {user_id: val.user_id, username: val.username, demand_id: val.id, demand_name: val.demand_name}}" tag="span" style="cursor: pointer">
						<el-button type="text" size="mini" v-if="val.status == 9 && (val.type == 2 || val.type == 3) && fxfl && val.but_cashback == 1">返现</el-button>
					</router-link>


					<el-button type="text" size="mini" v-if="val.but_del == 1" @click="delDemand(val.id)">删除</el-button>


				</div></el-col>
				<el-col :span="24" v-show="val.is_show == 1">
					<div class="deBox" v-for="(val, index) in detail" :class="{deTrue: index == 0, deFalse: index != 0}">
				        <div class="cotentTop" v-if="index != 0">
				            <ul>
				                <li><span class="fontWight">提交日期：</span><span>{{val.examine_time | time}}</span></li>
				                <li><span class="fontWight">返现返量：</span><span>{{val.type | deType}}</span></li>
				                <li><span class="fontWight">审核状态：</span><span>{{val.status | deStatus}}</span></li>
				                <li><span class="fontWight">下级订单：</span><span>{{val.orderCount}}</span></li>
				            </ul>
				        </div>
				        <div class="deContent">
				            <ul>
				                <li class="deBoxLi">
				                    <div><span class="fontWight">合同单价：</span><em>￥{{val.contract_price}}</em></div>
				                    <div>
				                        <span class="fontWight" style="vertical-align: top;">需求描述：</span>
				                        <ul>
				                            <li class="contentLi">{{val.demand_describe}}</li>
				                        </ul>
				                    </div>
				                </li>

				                <li class="deBoxLi" v-if="val.type != 1 && val.type != 4">
				                    <div><span class="fontWight">返现方式：</span><span>{{val.return_cash_type | cash_type}}</span></div>
				                    <div v-if="val.return_cash_type != 3"><span class="fontWight">{{val.type | detailType}}：</span><span>{{val.return_cash_num}}%</span></div>

				                    <div v-if="val.return_cash_type == 3"><span class="fontWight">实际单价：</span><span>{{val.actual_price}}</span></div>
				                </li>

				                <li class="deBoxLi" v-if="val.type == 4">
				                    <div><span class="fontWight">返量方式：</span><span>{{val.return_flow | flow_type}}</span></div>
				                    <div><span class="fontWight">{{val.type | detailType}}：</span><span>{{val.return_cash_num}}</span></div>
				                </li>

				                <li class="deBoxLi lastLi">
				                    <div>
				                        <ul>
				                            <li class="anotherLi"><span class="fontWight">收款人姓名：</span><span>{{val.payee_name}}</span></li>
				                            <li class="anotherLi"><span class="fontWight">联系方式：</span><span>{{val.payee_contact}}</span></li>
				                            <li class="anotherLi"><span class="fontWight">打款方式：</span><span>{{val.pay_type | payType1}}</span></li>
				                        </ul>
				                    </div>
				                    <div>
				                        <ul>
				                            <li class="anotherLi"><span class="fontWight">开户行：</span><span>{{val.bank_name}}</span></li>
				                            <li class="anotherLi"><span class="fontWight">账户名：</span><span>{{val.account_name}}</span></li>
				                            <li class="anotherLi"><span class="fontWight">账户：</span><span>{{val.account}}</span></li>
				                        </ul>
				                    </div>
				                </li>
				            </ul>
				        </div>
				        <p><span class="currentSpan">备注：</span>{{val.remark}}</p>
				        <p>
				            <span><span class="currentSpan">提交人：</span>{{val.submit_realname}}</span>
				            <span class="shenhe"><span class="currentSpan">审核通过日期：</span>{{val.examine_time | time}}</span>
				        </p>
				    </div>
				</el-col>
			</el-row>
			<div class="pageBox">
				<el-pagination small layout="prev, pager, next" :total="allDemList.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
			</div>
		</div>

		<el-dialog :close-on-click-modal="false" title="提示" v-model="check" size="tiny" @close="checkClose">
			<span>是否通过</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="checkFalse">不通过</el-button>
				<el-button type="primary" @click="checkTrue">通过</el-button>
			</span>
		</el-dialog>
		

		<el-dialog :close-on-click-modal="false" title="删除" v-model="delStatus" size="tiny" @close="delClear">
			<span>是否删除</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delClear">取消</el-button>
				<el-button type="primary" @click="delTrue">通过</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import search from './Search.vue'
	export default {
		data() {
			return {
				all: '全部',
				allVal: '',

				detail: '',

				check: false,
				checkData: {
					id: '',
					submit_status: '',
				},


				delStatus: false,
				delData: {
					id: ''
				},
			}
		},

		watch: {
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchDemandList', this.searchData)
				} else {
					this.searchData = {
						return_cash_type: '',
						type: '',
						sale_id: '',
						after_sale_id: '',
						p: 1,
						username: this.searchUsername
					}
					this.$store.dispatch('searchDemandList', this.searchData)
				}
			}
		},
		created() {
			this.$store.dispatch('searchDemandList', {p: 1})
		},
		computed: {
			all_sales() {
				return Cookie.get('data').childSales
			},
			all_after_sales() {
				return Cookie.get('data').allAfterSales
			},
			allDemList() {
				return this.$store.getters.demandLists
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.business
			},
			//返现放量权限
			fxfl() {
				if(Cookie.get('data').operation.finance.addcashback == 1) {
					return true
				} else {
					return false
				}
			},
			searchData() {
				return this.$store.getters.all_state.demandSearchData
			},

			currentPage() {
				return this.$store.getters.all_state.demandSearchData.p || 1
			}
		},
		components: {
			search
		},
		methods: {
			searchAlllist() {
				this.$store.dispatch('searchDemandList', this.searchData)
			},
			getList(currentPage) {
				this.$store.dispatch('searchDemandList', {p: currentPage})
			},
			//详情显示隐藏
			showDetail(i, id) {
				if(this.jurisdiction.getdemandinfo != 1) {
					return
				}
				if(this.allDemList.list[i].is_show == 1) {
					this.allDemList.list[i].is_show = 0
					return
				}
				this.$http.post('/base/getDemandInfo', { id: id }).then(d => {
					this.detail = d.body.data
				})
				for(let i = 0; i < this.allDemList.list.length; i++) {
					var d = this.allDemList.list[i]
					d.is_show = 0
				}
				this.allDemList.list[i].is_show = 1

			},
			addDem() {
				this.$router.push('/business/demand/addDemand')
			},

			checkOpen(id) {
				this.check = true
				this.checkData.id = id
			},
			checkTrue() {
				this.sendCheck(1)
			},
			checkFalse() {
				this.sendCheck(2)
			},
			checkClose() {
				this.checkData = {
					id: '',
					submit_status: ''
				}
				this.check = false
			},
			sendCheck(status) {
				this.checkData.submit_status = status
				this.$http.post('/business/demandCheck', this.checkData).then(d => {
					if(d.body.ret == 1) {
						if(status == 1) {
							this.$notify({
					    		title: '成功',
					    		message: '审核通过',
					    		type: 'success'
					    	})
						} else {
							this.$notify({
					    		title: '成功',
					    		message: '审核未通过',
					    		type: 'success'
					    	})
						}
						
					} else {
						this.$notify({
				    		title: '失败',
				    		message: '操作错误',
				    		type: 'error'
				    	})
					}
					this.checkClose()
					this.$store.dispatch('searchDemandList')
				})
			},

			delDemand(id) {
				this.delStatus = true
				this.delData.id = id
			},
			delClear() {
				this.delStatus = false
				this.delData.id = ''
			},
			delTrue() {
				this.$http.post('/business/demandDel', this.delData).then(d => {
					if(d.body.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '删除成功',
				    		type: 'success'
				    	})
						this.delClear()
						this.$store.dispatch('searchDemandList')
					} else {
						this.$notify({
				    		title: '失败',
				    		message: d.body.msg,
				    		type: 'error'
				    	})
					}
				})
			}
		}
	}
</script>
<style scoped>
	.allList {
		position: relative;
		top: 0;
	}
</style>
<template>
	<div>
		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal"></el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<el-select placeholder="负责售后"  v-model="searchData.after_sale_id">
					<el-option label="负责售后" :value="allVal"></el-option>
				    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>

				<el-select placeholder="状态"  v-model="searchData.status">
					<el-option label="状态" :value="allVal"></el-option>
				    <el-option label="待审核" value="1"></el-option>
				    <el-option label="审核未通过" value="2"></el-option>
				    <el-option label="待返" value="3"></el-option>
				    <el-option label="已返" value="4"></el-option>
				</el-select>

				<el-select placeholder="返量原因"  v-model="searchData.type">
					<el-option label="返量原因" :value="allVal"></el-option>
				    
				    <el-option label="充值返量" value="1"></el-option>
				    <el-option label="测试返量" value="3"></el-option>
				    <el-option label="活动返量" value="2"></el-option>
				</el-select>

				
				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<router-link to="/finace/returnQuantity/addQuantity" tag="div" v-if="">
					<el-button type="primary" size="small" icon="plus">返量申请</el-button>
				</router-link>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="3"><div class="grid-content">创建日期</div></el-col>
				<el-col :span="4"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="3"><div class="grid-content">需求单名称</div></el-col>
				<el-col :span="2"><div class="grid-content">状态</div></el-col>
				<el-col :span="2"><div class="grid-content">返量原因</div></el-col>
				<el-col :span="2"><div class="grid-content">赠送量（cpm）</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="3"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allLists.list">
				<el-col :span="3"><div class="grid-content">{{val.create_time}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.user_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.demand_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.status | quStatus}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.type}}</div></el-col>
				<el-col :span="2"><div class="grid-content">
					<!-- <router-link :to="{name: 'detailQuantity', params: {id: val.id}}" tag="span" style="cursor: pointer">
						{{val.gift_cpm}}
					</router-link> -->
					<el-button type="text" size="small" @click="goto(val.id)">{{val.gift_cpm}}</el-button>
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.after_sale_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content">
					<el-button type="text" size="small" v-if="val.status == 0 && jurisdiction.reviewdata == 1" @click="checkOpen(val.id, 1)">审核</el-button>
					<el-button type="text" size="small" v-if="val.status == 1 && jurisdiction.reviewdata == 1" @click="checkOpen(val.id, 3)">审核</el-button>
					<el-button type="text" size="small" v-if="val.status == 3 && jurisdiction.confirmdata == 1" @click="returnOpen(val.id)">确认返量</el-button>
					<el-button type="text" size="small" v-if="val.status == 4" :disabled="true">已返</el-button>
					<el-button type="text" size="small" v-if="val.status == 2" :disabled="true">未通过</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="allLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>

		<el-dialog :close-on-click-modal="false" title="提示" v-model="check" size="tiny" @close="checkClose">
			<span>是否通过</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="checkFalse">不通过</el-button>
				<el-button type="primary" @click="checkTrue">通过</el-button>
			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="确认返量" v-model="returnStatus" size="tiny" @close="returnClose">

			<span>是否确认</span>
			
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="returnClose">取消</el-button>
				<el-button type="primary" @click="returnTrue">确定</el-button>
			</span>
			
		</el-dialog>
	</div>
</template>
<script>
	import search from './search.vue'
	import Cookie from '../../vuex/cookie.js'
	export default {
		created() {
			this.$store.dispatch('searchQuantityList', this.searchData)
		},
		watch: {
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchQuantityList', this.searchData)
				} else {
					this.searchData = {
						sale_id: '',
						after_sale_id: '',
						status: '',
						p: 1,
						username: this.searchUsername
					},
					this.$store.dispatch('searchQuantityList', this.searchData)
				}
			}
		},
		data() {
			return {
				allVal: '',
				check: false,
				checkData: {},
				returnStatus: false,
				returnData: {},
			}
		},
		components: {
			search
		},
		computed: {
			all_sales() {
				if(Cookie.get('data').position_id == 6) {
					return Cookie.get('data').allSales
				}
				return Cookie.get('data').childSales
			},
			all_after_sales() {
				return Cookie.get('data').allAfterSales
			},
			allLists() {
				return this.$store.getters.quantityLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.finance
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			searchData() {
				return this.$store.getters.all_state.refundSearchData
			},
			currentPage() {
				return this.$store.getters.all_state.quantitySearchData.p || 1
			}
		},
		methods: {
			goto(id) {
				if(this.jurisdiction.returnamountdetail != 1) {
					return
				}
				this.$router.push({name: 'detailQuantity', params: {id: id}})
			},
			getList(currentPage) {
				this.$store.dispatch('searchQuantityList', {p: currentPage})
			},
			searchAlllist() {
				this.$store.dispatch('searchQuantityList', this.searchData)
			},
			checkOpen(ra_id, status) {
				this.check = true
				this.checkData.ra_id = ra_id
				this.checkData.status = status
			},
			checkClose() {
				this.check = false
				this.checkData = {}
			},
			checkFalse() {
				this.checkData.status = 2
				this.$http.post('/Finance/reviewData', this.checkData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('审核不通过')
						this.searchAlllist()
						this.checkClose()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			checkTrue() {
				this.$http.post('/Finance/reviewData', this.checkData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('审核通过')
						this.searchAlllist()
						this.checkClose()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},

			returnOpen(ra_id) {
				this.returnStatus = true
				this.returnData.ra_id = ra_id
			},
			returnClose() {
				this.returnStatus = false
				this.returnData = {}
			},
			returnTrue() {
				this.$http.post('/Finance/confirmData', this.returnData).then(d => {
					if(d.body.ret == 1) {
					 	this.openSuccess('已确认')
					 	this.returnClose()	
					 	this.searchAlllist()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},


			openSuccess(str) {
				this.$notify({
		    		title: '成功',
		    		message: str,
		    		type: 'success'
		    	})
			},
			openDefeat(str) {
				this.$notify({
		    		title: '失败',
		    		message: str,
		    		type: 'error'
		    	})
			}
		}
	}
</script>
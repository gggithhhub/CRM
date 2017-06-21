<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="4"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="4"><div class="grid-content">最近联系时间</div></el-col>
				<el-col :span="4"><div class="grid-content">行业</div></el-col>
				<el-col :span="4"><div class="grid-content">联系人</div></el-col>
				<el-col :span="4"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="4"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in commonLists.list">
				<el-col :span="4"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.last_contact_time | time}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.industry_name}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.contact}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.alter_sale_name}}</div></el-col>
				<el-col :span="4"><div class="grid-content">
					<el-button type="text" size="mini" class="textBtn" @click="share(val.id)" v-if="jurisdiction.commondistribu == 1">分配</el-button>
				</div></el-col>
				
			</el-row>
		</div>

		<div class="footer">
		<!-- @current-change="getList"  -->
			<el-pagination small layout="prev, pager, next" :total="commonLists.count * 10" @current-change="getList"></el-pagination>
		</div>

		<el-dialog :close-on-click-modal="false" title="分配" v-model="dialogShare" size="tiny" @close="shareClose">
			<span>选择销售：</span>
			<el-select v-model="shareData.sale_id" placeholder="请选择" :popper-class="shareSelect">
				<el-option v-for="item in allSales" :label="item.realname" :value="item.id"></el-option>
			</el-select>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="shareClose">取 消</el-button>
			    <el-button type="primary" @click="subShare">确 定</el-button>
			</div>

		</el-dialog>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import Search from './Search.vue'
	// /customer/commonUser
	export default {
		created() {
			this.all_industry = Cookie.get('data').industry
			this.all_after_sales = Cookie.get('data').childAfterSales

			this.$store.dispatch("searchCommonList", {p: 1})
		},
		components: {
			'search': Search
		},
		data() {
			return {
				all_industry: [],
				all_after_sales: [],
				allVal: ' ',
				all: '全部',
				searchData: {
					industry_id:  '',
					after_sale_id: '',
				},
				dialogShare: false,
				shareData: {
					user_id: '',
					sale_id: '',
				},
			}
		},
		computed: {
			commonLists() {
				return this.$store.getters.commonLists
			},
			allSales() {
				return Cookie.get('data').allSales
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.customer
			},
		},
		methods: {
			cancel() {},
			success() {},
			searchAlllist() {
				this.$store.dispatch("searchCommonList", this.searchData)
			},
			getList(currentPage) {
				this.$store.dispatch("searchCommonList", {p: currentPage})
			},
			share(id) {
				this.dialogShare = true
				this.shareData.user_id = id
			},
			shareClose() {
				this.shareData.user_id = ''
				this.shareData.sale_id = ''
				this.dialogShare = false
			},
			subShare() {
				this.$http.post('/customer/commonDistribu', this.shareData).then(d => {
					if(d.body.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '分配成功',
				    		type: 'success'
				    	})
				    	this.$store.dispatch('searchCommonList')
					} else {
						this.$notify.error({
				    		title: '失败',
				    		message: d.body.msg,
				    	})
					}
					this.shareClose()
				})
			}
		}
	}
</script>
<style></style>
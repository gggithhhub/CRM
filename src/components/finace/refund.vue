<template>
	<div>
		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<!-- <el-option :label="all" :value="allVal"></el-option> -->
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>

				<el-select placeholder="状态"  v-model="searchData.status">
					<!-- <el-option :label="all" :value="allVal"></el-option> -->
				    <el-option label="待总监审核" value="0"></el-option>
				    <el-option label="通过审核" value="1"></el-option>
				    <el-option label="未通过" value="2"></el-option>
				    <el-option label="财务确认退款" value="3"></el-option>
				    <el-option label="完成" value="9"></el-option>
				</el-select>

				
				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn" v-if="jurisdiction.refundadd == 1">
				<router-link to="/finace/refund/addRefund" tag="div">
					<el-button type="primary" size="small" icon="plus">退款申请</el-button>
				</router-link>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="3"><div class="grid-content">创建日期</div></el-col>
				<el-col :span="4"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="3"><div class="grid-content">退款金额</div></el-col>
				<el-col :span="3"><div class="grid-content">状态</div></el-col>
				<el-col :span="4"><div class="grid-content">备注</div></el-col>
				<el-col :span="3"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="4"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allLists.list">
				<el-col :span="3"><div class="grid-content">{{val.create_time | time}}</div></el-col>
				<el-col :span="4"><div class="grid-content">
					<router-link :to="{name: 'detailDefund', params: {id: val.id}}" tag="div">
						{{val.username}}
					</router-link>
				</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.money}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.status | refstatus}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.remark}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.sale}}</div></el-col>
				<el-col :span="4"><div class="grid-content">
					<router-link :to="{name: 'editRefund', params: {id: val.id}}" tag="div" v-if="val.status == 2 && jurisdiction.refundedit == 1">
						<el-button type="text" size="small">重新提交</el-button>
					</router-link>
					<el-button type="text" size="small" v-if="val.status == 0 && jurisdiction.refundCheck == 1" @click="checkOpen(val.id)">审核</el-button>
					<el-button type="text" size="small" v-if="val.status == 1 && jurisdiction.refundpic == 1 " @click="returnOpen(val.id)">确认退款</el-button>
					<el-button type="text" size="small" v-if="val.status == 9" :disabled="true">完成</el-button>
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

		<el-dialog :close-on-click-modal="false" title="确认退款" v-model="returnStatus" size="tiny" @close="returnClose">

	    	<div class="imgBox">
		    	<el-upload class="avatar-uploader" action="/base/uploadImg" :show-file-list="false" :on-success="testData" :multiple=false list-type="picture" :on-error="fileErro" name="pic">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
			
			
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
			this.$store.dispatch('searchRefundList', this.searchData)
		},
		watch: {
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchRefundList', this.searchData)
				} else {
					this.searchData = {
						sale_id: '',
						status: '',
						p: 1,
						username: this.searchUsername
					},
					this.$store.dispatch('searchRefundList', this.searchData)
				}
			}
		},
		data() {
			return {
				check: false,
				id: '',

				returnStatus: false,
				pic: '',
				accept: '.jpg, .jpeg, .png',
				imageUrl: '',

			}
		},
		computed: {
			all_sales() {
				if(Cookie.get('data').position_id == 6) {
					return Cookie.get('data').allSales
				}
				return Cookie.get('data').childSales
			},
			allLists() {
				return this.$store.getters.refundLists
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.finance
			},
			searchData() {
				return this.$store.getters.all_state.refundSearchData
			},
			currentPage() {
				return this.$store.getters.all_state.refundSearchData.p || 1
			}
		},
		components: {
			search
		},
		methods: {
			getList(currentPage) {
				this.$store.dispatch('searchRefundList', {p: currentPage})
			},
			searchAlllist() {
				this.$store.dispatch('searchRefundList', this.searchData)
			},


			checkOpen(id, submit_status) {
				this.check = true
				this.id = id
			},
			checkClose() {
				this.check = false
				this.id = ''
			},
			checkTrue() {
				this.$http.post('/finance/refundCheck', {id: this.id, submit_status: 1}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('通过成功')
						this.checkClose()
						this.$store.dispatch('searchRefundList', this.searchData)
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			checkFalse() {
				this.$http.post('/finance/refundCheck', {id: this.id, submit_status: 2}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('不通过成功')
						this.checkClose()
						this.$store.dispatch('searchRefundList', this.searchData)
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},

			returnOpen(id) {
				this.returnStatus = true
				this.id = id
				this.pic = ''
				this.imageUrl = ''
			},
			returnClose() {
				this.id = ''
				this.pic = ''
				this.imageUrl = ''
				this.returnStatus = false
			},
			returnTrue() {
				if(!this.pic) {
					this.openDefeat('请先上传图片')
					return;
				}
				this.$http.post('/finance/refundPic', {id: this.id, pic: this.pic}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('确认成功')
						this.$store.dispatch('searchRefundList', this.searchData)
						this.returnClose()
					} else {
						this.openDefeat(d.body.ret)
					}
				})
			},

			testData(response,file,fileList) {
	    		if(response.ret == 1) {
	    			this.openSuccess('上传成功')
	    			this.imageUrl = response.data
	    			this.pic = response.data
	    		} else {
	    			this.openDefeat('上传失败')
	    		}
	    	},
	    	fileErro() {//上传失败的钩子
				this.openDefeat('上传失败')
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
		},
	}
</script>

<style scoped>
	.imgBox {
		width: 178px;
		height: 178px;
		border: 1px dashed #CCC;
		position: relative;
		margin: 0 auto;
	}
	.imgBox i{
		font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	.imgBox img {
		/*width: 300px;*/
		width: 178px;
		height: 178px;
	}
</style>
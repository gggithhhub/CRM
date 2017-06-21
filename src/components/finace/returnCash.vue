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
				    <el-option label="待徐总审核" value="1"></el-option>
				    <el-option label="待确认返现" value="2"></el-option>
				    <el-option label="已返" value="3"></el-option>
				    <el-option label="审核未通过" value="4"></el-option>
				</el-select>

				<el-select placeholder="返现原因"  v-model="searchData.type">
					<!-- <el-option :label="all" :value="allVal"></el-option> -->
				    
				    <el-option label="充值返现" value="1"></el-option>
				    <el-option label="消耗百分比返" value="2"></el-option>
				    <el-option label="差价返" value="3"></el-option>
				</el-select>

				
				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<router-link to="/finace/returnCash/addCash" tag="div" v-if="jurisdiction.addcashback == 1">
					<el-button type="primary" size="small" icon="plus">返现申请</el-button>
				</router-link>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="3"><div class="grid-content">创建日期</div></el-col>
				<el-col :span="3"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="3"><div class="grid-content">需求单名称</div></el-col>
				<el-col :span="2"><div class="grid-content">状态</div></el-col>
				<el-col :span="2"><div class="grid-content">返现原因</div></el-col>
				<el-col :span="2"><div class="grid-content">支付方式</div></el-col>
				<el-col :span="2"><div class="grid-content">返现金额</div></el-col>
				<el-col :span="2"><div class="grid-content">截图</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="3"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allLists.list">
				<el-col :span="3"><div class="grid-content">{{val.create_time}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.user_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content">
					<router-link :to="{name: 'detailCash', params: {id: val.id}}" tag="a" v-if="jurisdiction.cashbackdetail == 1" target="_blank">
						<el-button type="text" size="small">{{val.demand_name}}</el-button>&nbsp;
					</router-link>
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.status | cashStatus}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.type | cash_type}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.pay_type | payType1}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.money}}</div></el-col>
				<el-col :span="2" v-if="val.pic.length > 0 && jurisdiction.cashbackdetail == 1"><div class="grid-content">
					<!-- <router-link :to="{name: 'detailCash', params: {id: val.id}}" tag="span"> -->
					<el-button type="text" size="small"  @click="isShow(val.pic)">预览</el-button>
					<!-- </router-link> -->
				</div></el-col>
				<el-col :span="2" v-if="val.pic == false"><div class="grid-content">暂无截图</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content">
					<el-button type="text" size="small" v-if="val.status == 0 && jurisdiction.examinecashback == 1" @click="checkOpen(val.id)">审核</el-button>
					<el-button type="text" size="small" v-if="val.status == 1 && jurisdiction.examinecashback == 1" @click="checkOpen(val.id)">审核</el-button>
					<el-button type="text" size="small" v-if="val.status == 2 && jurisdiction.confirmcashback == 1" @click="returnOpen(val.id)">确认返现</el-button>
					<el-button type="text" size="small" v-if="val.status == 3" :disabled="true">已返</el-button>
					<el-button type="text" size="small" v-if="val.status == 4" :disabled="true">未通过</el-button>
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

		<el-dialog :close-on-click-modal="false" title="确认返现" v-model="returnStatus" size="tiny" @close="returnClose">

			<div style="margin-bottom: 30px;" class="signed">
				<!-- <el-upload class="upload-demo" action="/base/uploadImg" :on-preview="handlePreview" :show-file-list="false" :multiple=false :accept="accept" :on-success="fileSuccess" name="pic">
				    <span>上传图片：</span><el-button size="small" type="primary">点击上传</el-button>
				        <img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload> -->


				<span>上传图片：</span>
				<div class="imgBox" style="line-height: 178px;display: inline-block;vertical-align: top;">
			    	<el-upload class="avatar-uploader" action="/base/uploadImg" :show-file-list="false" :on-success="fileSuccess" :accept="accept" :multiple=false name="pic">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
			</div>
			
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="returnClose">取消</el-button>
				<el-button type="primary" @click="returnTrue">确定</el-button>
			</span>
			
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="imgShow" size="large" top="1%">
			<div style="height: 100%;width:100%">
				<img :src="imgSrc" alt=""  style="height: 100%;width:100%">
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import search from './search.vue'
	import Cookie from '../../vuex/cookie.js'
	export default {
		created() {
			this.$store.dispatch('searchCashList', this.searchData)
		},
		watch: {
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchCashList', this.searchData)
				} else {
					this.searchData = {
						sale_id: '',
						status: '',
						type: '',
						p: 1,
						username: this.searchUsername
					},
					this.$store.dispatch('searchCashList', this.searchData)
				}
			}
		},
		data() {
			return {
				check: false,
				cashback_id: '',

				accept: '.jpg, .jpeg, .png',
				fileData: {},
				imageUrl: '',
				returnStatus: false,
				imgSrc: '',
				imgShow: false
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
				return this.$store.getters.cashLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.finance
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			searchData() {
				return this.$store.getters.all_state.cashSearchData
			},
			currentPage() {
				return this.$store.getters.all_state.cashSearchData.p || 1
			}
		},
		components: {
			search
		},
		methods: {
			getList(currentPage) {
				this.$store.dispatch('searchCashList', {p: currentPage})
			},
			searchAlllist() {
				this.$store.dispatch('searchCashList', this.searchData)
			},
			checkOpen(id) {
				this.check = true
				this.cashback_id = id
			},
			checkClose() {
				this.check = false
				this.cashback_id = ''
			},
			checkTrue() {
				this.$http.post('/finance/examineCashBack', {cashback_id: this.cashback_id, status: 1}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('通过成功')
						this.checkClose()
						this.$store.dispatch('searchCashList', this.searchData)
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			checkFalse() {
				this.$http.post('/finance/examineCashBack', {cashback_id: this.cashback_id, status: 2}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('不通过成功')
						this.checkClose()
						this.$store.dispatch('searchCashList', this.searchData)
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			//上传图片
			fileSuccess(response, file, fileList) {
				if(response.ret == 1) {
			    	this.openSuccess('文件上传成功')
			    	this.fileData.enclosure_url = [{name: file.name, url: response.data}]
			    	this.imageUrl = response.data;
				} else {
					this.openDefeat('上传失败')
					this.fileData.enclosure_url = []
	    			this.imageUrl = ""
				}
			},
			handleRemove(file, fileList) {
				for(let i = 0; i < this.fileData.enclosure_url.length; i++) {
					if(file.name == this.fileData.enclosure_url[i].name) {
						this.fileData.enclosure_url.splice(i, 1)
					}
				}
			},
			returnOpen(id) {
				this.returnStatus = true
				this.fileData.cashback_id = id
				this.fileData.enclosure_url = []
			},
			returnClose() {
				this.fileList2 = []
				this.fileData = {}
				this.returnStatus = false
			},
			returnTrue() {
				if(this.fileData.enclosure_url.length == 0) {
					this.openDefeat('请先上传图片')
					return;
				}
				this.$http.post('/finance/confirmCashBack', this.fileData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('确认成功')
						this.$store.dispatch('searchCashList', this.searchData)
						this.returnClose()
					} else {
						this.openDefeat(d.body.ret)
					}
				})
			},

			isShow(src) {
				this.imgSrc = src
				this.imgShow = true
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
<style scoped>
	.dialog-footer {
		overflow: hidden; 
     	width: 100%; 
 	    padding-top: 10px;
 	    display: block;
	}
	.bigImg {
		position: absolute;
		width: 200px;
		height: 200px;
		top: -41px;
		left: 80px;
		z-index: 11;
	}
	.signed img {
		/*width: 300px;*/
		width: 178px;
		height: 178px;
	}
	.imgBox {
		width: 178px;
		height: 178px;
		border: 1px dashed #CCC;
		position: relative;
	}
	.imgBox i{
		font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
</style>
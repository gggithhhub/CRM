<template>
<div>	
	<div class="allcus">
		<div class="query">
			<search></search>
    		<div class="rightBtn">
	    		<el-upload class="upload-demo" action="/customer/batchImport" :file-list="fileList" :multiple=false :show-file-list=false :accept="excal" :on-success="fileSuccess" :on-error="fileError" :name="inputToExcel"  v-if="jurisdiction.batchimport == 1">
					<el-button type="primary" icon="upload" size="small">导入文件</el-button>
				</el-upload>
    			<el-button type="primary" icon="plus" size="small" @click="isAddShow" v-if="jurisdiction.adduser == 1">添加客户</el-button>
    			<el-button type="primary" icon="check" size="small" @click="getAllocation" v-if="jurisdiction.keydistribu == 1">一键分配</el-button>
    		</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">创建时间</div></el-col>
				<el-col :span="3"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="2"><div class="grid-content">最近联系时间</div></el-col>
				<el-col :span="2"><div class="grid-content">行业</div></el-col>
				<el-col :span="2"><div class="grid-content">客户状态</div></el-col>
				<el-col :span="4"><div class="grid-content">最新进展</div></el-col>
				<el-col :span="3"><div class="grid-content">下次回访时间</div></el-col>
				<el-col :span="1"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="3"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-if="allcusLists.list.length > 0" v-for="(val, index) in allcusLists.list" :class="{ allcusBgc: val.is_have_progress == 0}">
				<el-col :span="2"><div class="grid-content">{{val.create_time | time}}</div></el-col>
				<el-col :span="3"><div class="grid-content" @click="goto(val.id)">
					<!-- <router-link :to="{name:'allcusDetails',params: {id:val.id}}" tag="span">{{val.username}}</router-link> -->
					{{val.username}}
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.contact_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.industry_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.level | level}}</div></el-col>

				<el-col :span="4"  style="height: 43px;"><div class="grid-content"><span class="textOmit" @mouseenter="suspendShow(index)" @mouseleave="suspendHide(index)"><nobr>{{val.follow_record_progress}}</nobr></span></div><p class="suspend" v-show="val.over"><i></i>{{val.follow_record_progress}}</p></el-col>

				<el-col :span="3"><div class="grid-content">{{val.return_time | time}}</div></el-col>
				<el-col :span="1"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.alter_sale_name}}</div></el-col>
				<el-col :span="3">
				<div class="grid-content">
				
					<div>
						<el-button type="text" size="mini" class="textBtn" style="margin-left: 0" v-if="val.btn_update_progress == 1 && jurisdiction.updateprogress == 1">
							<router-link :to="{name:'Compile',params: {id:val.id, level: val.level}}" tag="span">更新进展</router-link>
						</el-button>
						<el-button type="text" size="mini" class="textBtn" style="margin-left: 5px" v-if="val.btn_edit == 1 && jurisdiction.edituser == 1">
							<router-link :to="{name:'Bianji',params: {id:val.id}}" tag="span">编辑</router-link>
						</el-button>

						<!-- <el-button type="text" size="mini" class="textBtn" @click="schemed(val.id)" v-if="val.btn_make_plan==1">制定方案</el-button> -->
						<!-- <span v-if="val.level > 2">
							<el-button type="text" size="mini" class="textBtn" v-if="val.btn_contract==1" @click="openSigned(val.username, val.id)">签约客户</el-button>
							<el-button type="text" size="mini" class="textBtn" v-else-if="val.btn_contract==2" disabled=true>待审核</el-button>
							<el-button type="text" size="mini" class="textBtn" v-else-if="val.btn_contract==3" @click="openSigned(val.username, val.id)">未通过</el-button>
						</span> -->
						<!-- <el-button type="text" size="mini" class="textBtn" v-if="val.btn_distribu == 1" @click="share(val.id)">分配</el-button> -->

						<el-dropdown>
							<span class="el-dropdown-link">
								更多<i class="el-icon-caret-bottom el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item>
									<el-button type="text" size="mini" class="textBtn" @click="schemed(val.id)" v-if="val.btn_make_plan == 1 && jurisdiction.makeplan == 1">制定方案</el-button>
								</el-dropdown-item>
								<el-dropdown-item>
									<span v-if="val.level > 2">
										<el-button type="text" size="mini" class="textBtn" v-if="val.btn_contract == 1 && jurisdiction.contractcust == 1" @click="openSigned(val.username, val.id)">签约客户</el-button>
										<el-button type="text" size="mini" class="textBtn" v-else-if="val.btn_contract == 2" disabled=true>待审核</el-button>
										<el-button type="text" size="mini" class="textBtn" v-else-if="val.btn_contract==3" @click="openSigned(val.username, val.id)">未通过</el-button>
									</span>
								</el-dropdown-item>
								<el-dropdown-item>
									<el-button type="text" size="mini" class="textBtn" v-if="val.btn_distribu == 1 && jurisdiction.distribu == 1" @click="share(val.id)">分配</el-button>
								</el-dropdown-item>
								<el-dropdown-item>
									<router-link :to="{name: 'AddDemand', params: {id: val.id, name: val.username}}" tag="span"  v-if="val.btn_demand_confirm == 1">
										<el-button type="text" size="mini" class="textBtn">需求确认</el-button>
									</router-link>
								</el-dropdown-item>
								<el-dropdown-item>
									<el-button type="text" size="mini" class="textBtn" @click="shiftTo(val.id)" v-if="val.btn_common_user == 1 && jurisdiction.intocommonuser == 1">转入公共客户池</el-button>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>

					</div>
					<!-- <div>
						<el-button type="text" size="mini" class="textBtn">分配</el-button>
					</div> -->
					
				</div></el-col>
			</el-row>
		</div>
		<div class="footer">
		<!-- @current-change="getList"  -->
			<el-pagination small layout="prev, pager, next" :total="allcusLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>
	</div>

	
	<signed></signed>

	<div class="aKey">
		<el-dialog :close-on-click-modal="false" title="一键分配" v-model="dialogVisible" size="tiny">
			<p>共有{{allocation}}位客户</p>
			<p>是否确定一键分配</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="aKey">确 定</el-button>
			</span>
		</el-dialog>
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

	<el-dialog :close-on-click-modal="false" title="提示" v-model="uploadOk" size="tiny">
		<p>{{uploadMsg}}</p>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="uploadOk = false">确 定</el-button>
		</span>
	</el-dialog>

	<el-dialog :close-on-click-modal="false" title="转入公共客户池" v-model="shiftStatus" size="tiny">
		<p>是否转入公共客户池</p>
		<p>转入公共客户池后，该客户将不属于你！</p>
		<span slot="footer" class="dialog-footer">
			<el-button @click="shiftStatus = false">取 消</el-button>
			<el-button type="primary" @click="shiftSure">确 定</el-button>
		</span>
	</el-dialog>

</div>

</template>
<script>
	import Search from './Search.vue'
	import Signed from './Signed.vue'
	import Cookie from '../../vuex/cookie.js'

	export default {
		data() {
			return {
				excal: '.xls, .xlsx',//上传文件的格式
				fileList: [],
				inputToExcel: 'inputToExcel',
				dialogVisible: false, //一键分配显示隐藏
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				schemeIsOpen: false,
				scheme: {//制定方案
					estimated_time: '',
					describe: '',
					user_id: '',
				}, 

				dialogShare: false, //分配窗口显示隐藏
				shareData: {
					user_id: '',
					sale_id: '',
				},

				allocation: '',
				uploadOk: false,
				uploadMsg: '',

				shiftStatus: false,
				shiftId: '',
			}
		},
		created() {
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchAllcusList')
			} ,200)
		},
		computed: {
			allcusLists() {
				return this.$store.getters.allcusLists
			},
			isSigned() {
				return this.$store.getters.signed
			},
			//控制一键分配权限
			btn_key_distribu() {
				return Cookie.get('data').btn_key_distribu
			},
			allSales() {
				return Cookie.get('data').allSales
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.customer
			},
			currentPage() {
				return this.$store.getters.all_state.allcusSearchData.p || 1
			}
		},
		components: {
			'search': Search,
			'signed': Signed
		},
		methods: {

			goto(id) {
				if(this.jurisdiction.getdetails == 1) {
					this.$router.push({name:'allcusDetails', params: {id: id}})
				}
			},
			//上传文件
			open2(msg) {
		        this.$message({
			        message: msg,
			        type: 'success'
		        });
		    },
	    	open4(msg) {
		        this.$message.error(msg);
		    },
			fileSuccess(response, file, fileList) {  
				if(response.ret == 1) {
					if(response.data.fail_num == 0) {
						this.open2('全部上传成功')
					}
					if(response.data.success_num == 0) {
						this.open4('全部上传失败')
					}
					if(response.data.success_num > 0 && response.data.fail_num > 0) {
						// this.uploadMsg = response.data.msg
						// this.uploadOk = true
						this.open4('失败' + fail_num + '条')
					}
					this.$store.dispatch('searchAllcusList',{p:1})
				} else {
					this.open4('文件上传失败')
				}
			},
			fileError() {
				this.open4('文件上传失败')
			},
			//上传结束
			//悬浮窗显示隐藏
			suspendShow(index) {
				this.allcusLists.list[index].over = true;
			},
			suspendHide(index) {
				this.allcusLists.list[index].over = false;
			},
			//添加客户
			isAddShow() {
				this.$router.push('/customer/allcus/add')
			},
			//翻页刷新列表
			getList(currentPage) {
				this.$store.dispatch('searchAllcusList',{p:currentPage})
			},
			//打开或关闭签约客户弹窗
			openSigned(name, user_id) {
				this.$store.commit('openOrCloseSigned', {name: name, user_id:user_id})
			},
			//一件分配
			aKey() {
				this.dialogVisible = false
				var that = this
				this.$http.post('/customer/keyDistribu/').then(function(d){
					if(d.data.ret == 1) {
						that.$notify({
				    		title: '成功',
				    		message: '分配成功',
				    		type: 'success'
				    	})
						that.$store.dispatch('searchAllcusList', {p: 1})
					} else {
						that.$notify.error({
				    		title: '失败',
				    		message: '分配失败',
				    	})
					}
				})
			},
			//获取一件分配的个数
			getAllocation() {
				this.dialogVisible = true
				this.$http.post('/base/unallocatedUser').then(d => {
					this.allocation = d.body.data.count
				})
		        // this.allocation = Cookie.get('data').count
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

			//分配窗口
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
				let that = this
				this.$http.post('/customer/distribu', this.shareData).then(d => {
					if(d.body.ret == 1) {
						that.$notify({
				    		title: '成功',
				    		message: '分配成功',
				    		type: 'success'
				    	})
				    	that.$store.dispatch('searchAllcusList')
					} else {
						that.$notify.error({
				    		title: '失败',
				    		message: d.body.msg,
				    	})
					}
					that.shareClose()
				})
			},

			//转入公共客户池
			shiftTo(id) {
				this.shiftStatus = true
				this.shiftId = id
			},
			shiftSure() {
				this.$http.post('/customer/intoCommonUser', {user_id: this.shiftId}).then(d => {
					if(d.body.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '转入成功',
				    		type: 'success'
				    	})
				    	this.shiftStatus = false
				    	this.$router.push('/customer/common')
					} else {
						this.$notify.error({
				    		title: '失败',
				    		message: d.body.msg,
				    	})
					}

				})
			}
		}
	}
</script>
<style scoped>
	.textOmit {
		display: inline-block;
		text-overflow: ellipsis;
		width: 180px;
		overflow:hidden;
		cursor: pointer;
		text-align: center;
		position: relative;
	}
	.suspend {
		width: 258px;
		padding: 8px;
		font-size: 12px;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.8) ;
		color: #FFF;
    	position: relative;
    	z-index: 1;
    	transition: all 2s;
	}
	.suspend i {
		width: 0;
	    height: 0;
	    border-left: 8px solid transparent;
	    border-right: 8px solid transparent;
	    border-bottom: 8px solid #000;
	    opacity: 0.8;
	    position: absolute;
	    top: -8px;
	    left: 104px;
	}
	.shareSelect {
		width: 100%;
	}
</style>
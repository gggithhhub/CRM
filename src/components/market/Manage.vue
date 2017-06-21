<template>
	<div>
		<div class="query">

			<div class="searchName">
				<el-input placeholder="姓名" icon="search" v-model="username"  @change="changUsername" :on-icon-click="handleIconClick">
				</el-input>
			</div>

			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="职位"  v-model="manage.position_id">
					<el-option :label="all" :value="allVal">
				    </el-option>
				    <el-option v-for="item in getPosition" :label="item.name" :value="item.id">
				    </el-option>
				</el-select>

				<el-button type="primary" size="small" @click="searchAllMan">查询</el-button>
			</div>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="4"><div class="grid-content">姓名</div></el-col>
				<el-col :span="4"><div class="grid-content">账户名</div></el-col>
				<el-col :span="4"><div class="grid-content">联系方式</div></el-col>
				<el-col :span="4"><div class="grid-content">上级领导</div></el-col>
				<el-col :span="4"><div class="grid-content">职位</div></el-col>
				<el-col :span="4"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in manageLists.list">
				<el-col :span="4"><div class="grid-content">{{val.realname}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.mobile}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.parent}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.position}}</div></el-col>
				<el-col :span="4" v-if="val.status == 0 && jurisdiction.openfrozen == 1"><div class="grid-content"><el-button type="text" @click="openDredge(val.id, 1)">开通</el-button></div></el-col>

				<el-col :span="4" v-if="val.status == 1">
					<div class="grid-content">
						<el-button type="text" @click="openManDilog(val.id, val.realname, val.username, val.mobile, val.position_id, val.pid)" v-if="jurisdiction.edituser == 1">
							编辑
						</el-button>

						<el-button type="text" @click="openDredge(val.id, 2)" v-if="jurisdiction.openfrozen == 1">
							冻结
						</el-button>
					</div>
				</el-col>

				<el-col :span="4"  v-if="val.status == 2"><div class="grid-content"><el-button type="text"  :disabled="true">已冻结</el-button></div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="manageLists.count * 10" @current-change="getList"></el-pagination>
		</div>


		<el-dialog :close-on-click-modal="false" v-model="dialogTableVisible" size="tiny" @close="closeDilog">
			<div class="manageDilog">
				<div class="leftDilog">
					<p style="margin-top:0;">姓名：</p>
					<p>账户名：</p>
					<p>联系方式：</p>
					<p>职位：</p>
					<p>上级领导：</p>
				</div>
				<div class="rightDilog">
					<p style="margin-top:0;">{{manDilog.realname}}</p>
					<p>{{manDilog.username}}</p>

					<p>
						<el-input v-model="manDilog.mobile" placeholder="请输入内容" size="mini"></el-input>
					</p>
					<p>
						<el-select v-model="manDilog.position_id" placeholder="职位" size="mini" @change="getParents">
							<el-option v-for="item in getPosition" :label="item.name" :value="item.id"> </el-option>
						</el-select>
					</p>
					<p>
						<el-select v-model="manDilog.pid" placeholder="上级领导" size="mini">
							<el-option v-for="item in getParent" :label="item.realname" :value="item.id"> </el-option>
						</el-select>
					</p>
					
					
				</div>
				<div class="footDilog">
					<el-button @click="dialogTableVisible = fasle">取消</el-button>
					<el-button type="primary" @click="subManDilog">保存</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	export default {
		watch: {
			$route() {
				this.username = ''
				this.$store.commit('changeUsername', { username: this.username })
			}
		},
		created() {
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchManageList',{p:1})
			} ,200)
			this.$http.post('/base/getPosition').then(d => {
				that.getPosition = d.body.data
			})
		},
		data() {
			return {
				//搜索数据
				manage: {
					position_id: '',
					p: 1
				},
				dialogTableVisible: false,
				manDilog: {
					id: '',
					mobile: '',
					pid: '',
					position_id: '',
					realname: '',
					username: '',
					mobile: ''
				},
				getPosition: [],
				getParent: [],
				all: '全部',
				allVal: '',

				username: '',//用户名搜索
			}
		},
		computed: {
			manageLists() {
				return this.$store.getters.manageLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.sale
			},
		},
		methods: {
			//分页
			getList(currentPage) {
				this.$store.dispatch('searchManageList',{p:currentPage})
			},
			//开通 冻结
			openDredge(id, type) {
				if(type == 1) {
					this.$confirm('是否开通?', '开通', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this
						this.$http.post('sale/openFrozen', {id: id, status: type}).then(d => {
							if(d.body.ret == 1) {
								that.$notify({
						    		title: '成功',
						    		message: '开通成功',
						    		type: 'success'
						    	})
							    that.$store.dispatch('searchManageList')
							} else {
								that.$notify.error({
						    		title: '失败',
						    		message: '开通失败'
						    	})
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消开通'
						});       
					})
				} else {
					this.$confirm('是否冻结，冻结后不可再次开通?', '冻结', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this
						this.$http.post('sale/openFrozen', {id: id, status: type}).then(d => {
							if(d.body.ret == 1) {
								that.$notify({
						    		title: '冻结',
						    		message: '冻结成功',
						    		type: 'success'
						    	})
							    that.$store.dispatch('searchManageList')
							} else {
								that.$notify.error({
						    		title: '冻结',
						    		message: '冻结失败'
						    	})
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消冻结'
						});       
					})
				}
			},
			//编辑
			openManDilog(id, realname, username, mobile, position_id, pid) {
				this.dialogTableVisible = true
				this.manDilog.id = id
				this.manDilog.realname = realname
				this.manDilog.username = username
				this.manDilog.mobile = mobile
				this.manDilog.position_id = position_id
				if(this.manDilog.pid != 0) {
					this.manDilog.pid = pid
				}
			},
			getParents() {
				let that = this
				this.manDilog.pid = ''
				this.$http.post('/base/getParent', {id :this.manDilog.position_id}).then(d => {
					that.getParent = d.body.data
				})
			},
			subManDilog() {
				let that = this
				this.$http.post('sale/editUser', {id: this.manDilog.id, mobile: this.manDilog.mobile, pid: this.manDilog.pid, position_id: this.manDilog.position_id}).then(d => {
					let data = d.body
					if(data.ret == 1) {
						that.$notify({
				    		title: '成功',
				    		message: '保存成功',
				    		type: 'success'
				    	})
				    	that.$store.dispatch('searchManageList')
				    	that.closeDilog()
					} else {
						that.$notify.error({
							title: '失败',
							message: data.msg
						})
					}
				})
			},
			closeDilog() {
				this.getParent = ''
				for(var k in this.manDilog) {
					this.manDilog[k] = ''
				}
				this.dialogTableVisible = false
			},
			//查询
			searchAllMan(){
				this.$store.dispatch('searchManageList',this.manage)
			},

			//用户名搜索
			changUsername() {
				this.$store.commit('changeUsername', { username: this.username })
			},

			handleIconClick() {
				if(this.username == '') {
					return
				} else {
					for(var key in this.manage) {
						this.manage[key] = ''
					}
					this.manage.p = 1
					this.$store.dispatch('searchManageList',this.manage)
				}
			}
		}
	}
</script>
<style>
	
	.manageDilog .leftDilog {
		width: 70px;
	    height: 200px;
	    margin-left: 25px;
	    float: left;
	}
	.manageDilog .rightDilog{
	    width: 267px;
	    height: 200px;
	    margin-right: 18px;
	    float: right;
	}
	.manageDilog .footDilog {
		height: 40px;
	    width: 100%;
	    text-align: center;
	    float: left;
	    margin-top: 15px;
	    margin-bottom: 15px;
	}
	.manageDilog {
		font-size: 12px;
	}
	.manageDilog p {
		margin-top: 20px;
		font-weight: 700;
	    height: 22px;
	}
</style>
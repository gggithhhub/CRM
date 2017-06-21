<template>
	<div class="scheme" id="aaa">
		<div class="query">
			<schsearch></schsearch>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">上传时间</div></el-col>
				<el-col :span="2"><div class="grid-content">方案名称</div></el-col>
				<el-col :span="2"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="2"><div class="grid-content">方案状态</div></el-col>
				<el-col :span="3"><div class="grid-content">预计完成时间</div></el-col>
				<el-col :span="2"><div class="grid-content">需求描述</div></el-col>
				<el-col :span="2"><div class="grid-content">方案</div></el-col>
				<el-col :span="3"><div class="grid-content">方案备注</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="2"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in schemeLists.list">
				<el-col :span="2"><div class="grid-content">{{val.upload_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content faName">{{val.title}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.username}}</div></el-col>

				<el-col :span="2"  v-if="val.status == 0"><div class="grid-content">待制定</div></el-col>
				<el-col :span="2"  v-else-if="val.status == 1"><div class="grid-content">制定中</div></el-col>
				<el-col :span="2"  v-else-if="val.status == 2"><div class="grid-content faType">已完成</div></el-col>

				<el-col :span="3"><div class="grid-content">{{val.estimated_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content" :class="{specailLine: true}">
					<el-tooltip class="item" effect="dark" placement="bottom-start" offset="">
						 <p slot="content" class="newContent">{{val.describe}}</p>
						<span class="noWrap">{{val.describe}}</span>
					</el-tooltip>
				</div></el-col>

				<el-col :span="2"  v-if="val.status != 2"><div class="grid-content">&nbsp</div></el-col>
				<el-col :span="2"  v-else><div class="grid-content"><a :href="val.plan" target="_blank"><el-button type="text">下载</el-button></a></div></el-col>

				<el-col :span="3"><div class="grid-content noWrap" style="width: 175px;">{{val.details}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.after_sale_name}}</div></el-col>

				<el-col :span="2"  v-if="val.status == 0 && val.btn_receivePlan == 1 && jurisdiction.receiveplan == 1"><div class="grid-content"><el-button type="text" @click="receivePlan(val.id)">接收</el-button></div></el-col>

				<el-col :span="2"  v-else-if="val.status == 1 && val.btn_savePlan == 1 && jurisdiction.saveplan == 1"><div class="grid-content"><el-button type="text" @click="upload(val.id, 0)">上传</el-button></div></el-col>

				<el-col :span="2"  v-else-if="val.status == 2"><div class="grid-content">
					<el-button type="text" @click="upload(val.id, 1)" v-if="val.btn_savePlan == 1 && jurisdiction.getprogramme == 1">编辑</el-button>
					<router-link :to="{name:'redact',params: {id:val.id}}" tag="span" v-if='val.btn_getProgramme == 1'>
						<el-button type="text">查看</el-button>
					</router-link>
				</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="schemeLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>

		<!-- 弹窗 -->

		<el-dialog :close-on-click-modal="false" v-model="dialogFormVisible" size="tiny" @close="uploadOff">
			<el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="方案名称：" prop="title">
					<el-input v-model="uploadForm.title" size="small"></el-input>
				</el-form-item>
			
				<el-form-item label="方案上传：">
					<el-upload class="upload-demo" action="/Base/uploadfile"  :file-list="fileList" :on-success="fileSuccess" :on-error="fileError" :multiple=false :show-file-list=false :accept="accept">
						<el-button type="text" v-if="!uploadForm.filename">点击上传</el-button>
						<div slot="tip" class="el-upload__tip" v-if="!uploadForm.filename">只能上传docx、pptx文件</div>
						<span v-if="uploadForm.filename" style="font-size: 12px; color: #8391a5;">{{uploadForm.filename}}</span>
						<el-button type="text" v-if="uploadForm.filename">重新上传</el-button>
					</el-upload>
				</el-form-item>

				<el-form-item label="方案备注：">
					<el-input type="textarea" v-model="uploadForm.details"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="uploadOff">取 消</el-button>
				<el-button type="primary" @click="submitForm('uploadForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import schSearch from './schSearch.vue'
	import Cookie from '../../vuex/cookie.js'
	export default {
		created() {
			//如果是内勤 跳转员工管理
			if(Cookie.get('data').position_id == 5) {
				this.$router.replace('/market/manage')
			}

			
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchSchemeList',{p:1})
			} ,200)
		},
		computed: {
			schemeLists() {
				return this.$store.getters.schemeLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.sale
			},
			currentPage() {
				return this.$store.getters.all_state.schemeSearchData.p || 1
			}
		},
		data() {
			return {
				//上传弹窗
				dialogFormVisible: false,
				uploadForm: {
					id: '',
					title: '',
					plan: '',
					details: '',
					filename: '',
					type: '',
				},
				accept: '.pptx, .doc',

				rules: {
					title: [
						{ required: true, message: '请输入方案名称', trigger: 'blur' },
					],
				}
			}
		},
		components: {
			'schsearch': schSearch,
		},
		methods: {
			getList(currentPage) {
				this.$store.dispatch("searchSchemeList", { p: currentPage })
			},
			//接收
			receivePlan(id) {
				var that = this
				this.$http.post('/sale/receivePlan', { status: 1, id: id }).then(function(d) {
					if(d.data.ret == 1) {
						that.$notify({
				    		title: '成功',
				    		message: '接收成功',
				    		type: 'success'
				    	})
				    	that.$store.dispatch('searchSchemeList')
					} else {
						that.$notify.error({
				    		title: '失败',
				    		message: '接收失败',
				    	})
					}
				})
			},
			//上传窗口打开
			upload(id, type) {
				if(type == 1) {
					let that = this
					this.$http.post('/sale/getProgramme', {id: id}).then(d => {
						let data = d.body.data
						that.uploadForm.title = data.title
						that.uploadForm.plan = data.plan
						that.uploadForm.filename = data.filename
						that.uploadForm.details = data.details
					})
				}
				this.uploadForm.type = type
				this.uploadForm.id = id
				this.dialogFormVisible = true
			}, 
			uploadOff() {
				for(var key in this.uploadForm) {
					this.uploadForm[key] = ''
				}
				this.dialogFormVisible = false
			},

			fileSuccess(response, file, fileList) {
				if(response.ret == 1) {
					this.uploadForm.filename = file.name

					this.uploadForm.plan = response.data
					this.$notify({
			    		title: '成功',
			    		message: '文件上传成功',
			    		type: 'success'
			    	})
				} else {
					this.$notify.error({
			    		title: '失败',
			    		message: '文件上传失败',
			    	})
				}
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					var that = this
					if (valid) {
						if(this.uploadForm.plan) {
							this.$http.post('/sale/savePlan', this.uploadForm).then(function(d){
								if(d.body.ret == 1) {
									that.$notify({
							    		title: '成功',
							    		message: '上传成功',
							    		type: 'success'
							    	})
							    	that.$store.dispatch("searchSchemeList")
							    	that.uploadOff()
								}
							})

						} else {
							this.$notify({
					    		title: '警告',
					    		message: '请上传文件',
					    		type: 'warning'
				    		})
						}
						
					} else {
						return false;
					}
				});
			}
		}
	}
</script>
<style scoped>
	.el-upload__tip {
		display: inline;
		margin-left: 5px;
	}

	
</style>
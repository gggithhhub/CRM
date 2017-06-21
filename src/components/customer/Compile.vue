<template>
	<div class="compile">
		<div class="compile-top">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="115px" class="demo-ruleForm">
				
				<div class="leftContent">
					<el-form-item label="主题:" prop="title">
						<el-input v-model="ruleForm.title" size="small"></el-input>
					</el-form-item>
					<el-form-item label="下次回访时间:">
						<el-date-picker v-model="ruleForm.return_time" type="datetime" placeholder="选择日期时间" size="small" :editable=false @change="getDate"></el-date-picker>
					</el-form-item>
					<el-form-item label="客户状态" prop="level">
						<el-cascader expand-trigger="hover" :show-all-levels="false" :options="options" v-model="ruleForm.level" size="small">
						</el-cascader>
					</el-form-item>
					<el-form-item label="最新进展" prop="progress">
						<el-input type="textarea" v-model="ruleForm.progress"></el-input>
					</el-form-item>
				</div>

				<div class="bottomContent">
					<el-form-item>
					    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					    <el-button @click="goback">返回</el-button>
					</el-form-item>
				</div>

			</el-form>
		</div>
		<div class="compile-bottom">
			<div class="headTitle">
				<div style="font-size: 12px; font-weight: 700; float:left">进展记录</div>
				<div style="float: right;">
					<el-pagination small layout="prev, pager, next" :total="recordLists.count * 10" @current-change="getList"></el-pagination>
				</div>
			</div>
			<div class="recordTable">
				<el-row>
					<el-col :span="4"><div class="grid-content recordHeader">更新时间</div></el-col>
					<el-col :span="4"><div class="grid-content recordHeader">主题</div></el-col>
					<el-col :span="4"><div class="grid-content recordHeader">下次回访时间</div></el-col>
					<el-col :span="6"><div class="grid-content recordHeader">客户状态</div></el-col>
					<el-col :span="6"><div class="grid-content recordHeader">更新记录</div></el-col>
				</el-row>
				<el-row v-for="(val, index) in recordLists.list">
					<el-col :span="4"><div class="grid-content">{{val.create_time | time}}</div></el-col>
					<el-col :span="4"><div class="grid-content">{{val.title}}</div></el-col>
					<el-col :span="4"><div class="grid-content">{{val.return_time | time}}</div></el-col>
					<el-col :span="6"><div class="grid-content">{{val.level | level}}</div></el-col>
					<el-col :span="6"><div class="grid-content">
						<el-tooltip class="item" effect="dark" placement="bottom-start">
							<p slot="content" class="newContent">{{val.record}}<br>最新进展：{{val.progress}}</p>
							<span class="noWrap">{{val.record}}{{val.progress}}</span>
						</el-tooltip>
					</div></el-col>
				</el-row>
			</div>
		</div>

		<el-dialog :close-on-click-modal="false" title="警告" v-model="subSure" size="tiny">
		<span>提交后信息不得编辑删除，是否确定提交?</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="subSure = false">取 消</el-button>
			<el-button type="primary" @click="subTrue">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>
<script>

	export default {
		created() {
			// alert(this.$route.params.id)
			if(!this.$route.params.id) {
				this.$router.go(-1)
				return
			}
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchRecordList',{user_id: that.$route.params.id, limit: 3, p: 1})
			} ,200)
			
			//客户状态决定时候可以点击阶段
			this.levelReset(this.$route.params.level)
		},
		beforeMount() {
			if(this.$route.params.level == 0) {
				this.rules.return_time[0].required = false
			}
		},
		data() {
			return {
				ruleForm: {
					user_id: this.$route.params.id,
					title: '',
					level: [],
					return_time: '',
					progress: '',
				},
				options: [{
					value: 'first',
					label: '第一阶段',
					children: [{
						value: '2',
						label: '联系失败'
					}, {
						value: '3',
						label: '联系成功'
					}]
				}, {
					value: 'second',
					label: '第二阶段',
					children: [{
						value: '4',
						label: '触达KP'
					}]
				}, {
					value: 'third',
					label: '第三阶段',
					children: [{
						value: '5',
						label: '发送资料/案例'
					}, {
						value: '6',
						label: '方案/报价议价'
					}, {
						value: '7',
						label: '签约(未打款)'
					}]
				}, {
					value: 'last',
					label: '洽谈失败',
					children: [{
						value: '0',
						label: '洽谈失败'
					}]
				}],
				rules: {
					title: [
						{ required: true, message: '请输入主题', trigger: 'blur' },
					],
					level: [
						{  type: 'array', required: true, message: '请选择客户状态', trigger: 'blur' }
					],
					progress: [
						{ required: true, message: '请输入最新进展', trigger: 'blur' }
					]
				},
				subSure: false,
			}
		},
		methods: {
			goback() {
				this.$router.go(-1)
			},
			getDate(d) {
				this.ruleForm.return_time = d
			},
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
					if (valid) {
						this.subSure = true
					} else {
						return false;
					}
		        });
	    	},
	    	subTrue() {
	    		//联动选择器需要从数组转化成字符串

	    		this.ruleForm.level = this.ruleForm.level[1]
	    		this.$http.post('/customer/updateProgress', this.ruleForm).then(function(data){
					if(data.data.ret == 0) {
						this.$notify.error({
				    		title: '错误',
				    		message: data.data.msg
				    	})
				    	this.subSure = false
				    	this.ruleForm.level = []
						return false
					} else {
						this.$notify({
				    		title: '成功',
				    		message: data.data.msg,
				    		type: 'success'
				    	})
				    	this.clearForm()
					}
				})
	    	},
	    	clearForm() {
	    		this.levelReset(this.ruleForm.level)
	    		for(var key in this.ruleForm) {
	    			this.ruleForm[key] = ''
	    		}
	    		this.ruleForm.level = []
	    		this.ruleForm.user_id = this.$route.params.id
	    		// this.goback()
	    		this.subSure = false
	    		this.$store.dispatch('searchRecordList',{user_id: this.$route.params.id, limit: 3, p: 1})
	    	},
	    	//翻页
	    	getList(currentPage) {
	    		this.$store.dispatch('searchRecordList',{user_id: this.$route.params.id, limit: 3, p: currentPage})
	    	},
	    	//下拉框为E级 时间不是必填
	    	// levelChange() {
	    	// 	if(this.ruleForm.level == 5) {
	    	// 		this.rules.return_time[0].required = false
	    	// 	} else {
	    	// 		this.rules.return_time[0].required = true
	    	// 	}
	    	// },

	    	levelReset(level) {
	    		this.options[1].disabled = false
				this.options[2].disabled = false
				this.options[3].disabled = false
	    		if(level == 1) {
					this.options[1].disabled = true
					this.options[2].disabled = true
					this.options[3].disabled = true
				}
				if(level == 2 || level == 3) {
					this.options[2].disabled = true
				}
				if(level == 4) {
					this.options[0].disabled = true
				}
				if(level == 7 || level == 5 || level == 6) {
					this.options[0].disabled = true
					this.options[1].disabled = true
				}
	    	},
		},
		computed: {
			recordLists() {
				return this.$store.getters.recordLists
			},
		},
	}
</script>
<style scoped>
	    
    .recordHeader {
    	height: 22px;
    	line-height: 22px;
    }
    .recordTable .noWrap  {
		width: 200px;
	}
	.el-input {
		width: 315px;
	}
	.el-date-editor.el-input {
		width: 315px;
	}
	.el-textarea {
		width: 500px;
	}
	.el-cascader {
		width: 315px;
	}
</style>
<template>
	<div class="signed">
	<el-dialog :close-on-click-modal="false" title="成为签约客户" v-model="isSigned.isSigned" size="small" @close="clearSigned" @open="openHtpp" top="2%">
		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
		    <el-form-item label="客户名称:" :label-width="formLabelWidth">
		    	<el-input size="small" v-model="isSigned.name" auto-complete="off" readonly='true'></el-input size="small">
		    </el-form-item>
		    <el-form-item label="支付方式:" :label-width="formLabelWidth"  prop="pay_type">
				<el-select v-model="form.pay_type" placeholder="请选择支付方式">
					<el-option label="支付宝" value="1"></el-option>
					<el-option label="银行" value="2"></el-option>
					<el-option label="其他" value="3"></el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="开户行:" :label-width="formLabelWidth" prop="bank_name" v-if="form.pay_type == 2">
		    	<el-input size="small" v-model="form.bank_name" auto-complete="off"></el-input size="small">
		    </el-form-item>
		    <el-form-item label="账户:" :label-width="formLabelWidth" prop="account" v-if="form.pay_type == 2">
		    	<el-input size="small" v-model="form.account" auto-complete="off"></el-input size="small">
		    </el-form-item>
		    <el-form-item label="账户名:" :label-width="formLabelWidth" prop="account_name">
		    	<el-input size="small" v-model="form.account_name" auto-complete="off"></el-input size="small">
		    </el-form-item>
		    <el-form-item label="打款金额:" :label-width="formLabelWidth" prop="money">
		    	<el-input size="small" v-model="form.money" auto-complete="off"></el-input size="small">
		    </el-form-item>

		    <el-form-item label="打款时间:" :label-width="formLabelWidth" prop="pay_time">
		    	<el-date-picker
					type="date"
					placeholder="打款时间"
					@change="getDate"
					v-model="form.pay_time"
					:picker-options="pickerOptions0"
					:editable=false>
			    </el-date-picker>
		    </el-form-item>

		    
		    <el-form-item label="上传:" :label-width="formLabelWidth">
		    	<div class="imgBox">
			    	<el-upload class="avatar-uploader" action="/base/uploadImg" :show-file-list="false" :on-success="testData" :accept="img" :multiple=false :name="pic" :on-error="fileErro">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>
		    </el-form-item>
		    <el-form-item label="详情:">
				<el-input size="small" type="textarea" v-model="form.pay_details"></el-input size="small">
				</el-form-item>
			</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="openSigned">取 消</el-button>
			<el-button type="primary" @click="submitForm('form')">确 定</el-button>
		</div>
	</el-dialog>

	</div>
</template>
<script>
	var number = (rule, value, callback) => {
		var e = /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
        if (!e.test(value) && value) {
          	callback(new Error('请输入正确的金额'));
        } else {
          	callback();
        }
    };
	export default {
    	data() {
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 1111118.64e7;
					}
				},
				img: '.jpg, .jpeg, .png',//只允许上传的格式
				pic: 'pic', //图片上传的字段名
				dialogFormVisible: false,
				form: {
					user_id: '',
					pay_type: '',
					bank_name: '',
					account: '',
					account_name: '',
					money: '',
					pay_time: '',
					pic: '',
					pay_details: '',
				},	
				imageUrl: '',
				rules: {
		          	pay_type: [
		            	{ required: true, message: '请选择支付方式', trigger: 'change' }
		          	],
		            account_name: [
		            	{ required: true, message: '请输入账户名', trigger: 'blur' }
		            ],
		            bank_name: [
		            	{ required: true, message: '请输入开户行', trigger:'change' }
		            ],
		            account: [
		            	{ required: true, message: '请输入账户', trigger:'change' }
		            ],
		            money: [
		            	{ required: true, message: '请输入打款金额', trigger: 'change' },
		            	{ validator: number, trigger: 'change' } 
		            ],
		            pay_time: [
		            	{ required: true, message: '请选择打款时间', trigger: 'change' }
		            ],
		        },
				formLabelWidth: '100px'
			};
		},
		computed: {
			//弹窗的开关数据
			isSigned() {
				return this.$store.getters.signed
			},
			api() {
				if(this.$route.path.indexOf('deal') > 0) {
					return 'recharge'
				} else {
					return 'contractCust'
				}
			}
		},
		methods: {
			//提交
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
	            		this.form.user_id = this.isSigned.user_id
	            		var that = this
	            		this.$http.post('/customer/' + this.api,this.form).then(function(data) {

	            			if(data.data.ret == 1) {
	            				that.open1()
	            				//关闭弹窗
	            				that.openSigned()
	            				//应该跳转财务页面
	            				
	            				this.$router.push({path:'/finace/audit'})
	            				//重新获取列表数据
	            				// that.$store.dispatch('searchAllcusList')
	            			} else {
	            				that.$notify.error({
						    		title: '错误',
						    		message: data.data.msg
						    	})
						    	//关闭弹窗
						    	that.openSigned()
	            			}
				        }, function() {
				        	that.open2()
				        });
		          	} else {
		          		// alert(1)
		            	return false;
		          	}
		        });
			},
			
			//图片
			handleAvatarScucess(url) {
				this.imageUrl = url;
			},

			openSigned() { //点击取消关闭
				//清空数据
				
				this.$store.commit('openOrCloseSigned', {name: "", user_id: ''})
			},
			clearSigned() {
				for(var key in this.form) {
					this.form[key] = ''
				}
				this.imageUrl = ""
			},

			fileErro() {//上传失败的钩子
				this.open3()
			},
			open1() {
		    	this.$notify({
		    		title: '成功',
		    		message: '上传成功',
		    		type: 'success'
		    	})
	    	},
			open2() {
		    	this.$notify.error({
		    		title: '错误',
		    		message: '上传失败'
		    	})
	    	},
			open3() {
		    	this.$notify.error({
		    		title: '错误',
		    		message: '图片上传失败'
		    	})
	    	},
	    	open4() {
		    	this.$notify({
		    		title: '成功',
		    		message: '图片上传成功',
		    		type: 'success'
		    	})
	    	},
	    	testData(response,file,fileList) {
	    		if(response.ret == 1) {
	    			this.open4()
	    			this.handleAvatarScucess(response.data)
	    			this.form.pic = response.data
	    		} else {
	    			this.open3()
	    			this.form.pic = ""
	    			this.imageUrl = ""
	    		}
	    	},
	    	//打款时间
	    	getDate(d) {
	    		this.form.pay_time = d
	    	},
	    	//打开调用接口 为了未通过默认数据
	    	openHtpp() {
	    		if(this.$route.path.indexOf('deal') == -1) {
	    			this.$http.post('/base/getFinanceAudit', {user_id: this.isSigned.user_id}).then(d => {
						var newDate = new Date();
						if(d.body.data) {
							var d = d.body.data
							this.form.pay_type = d.pay_type
							this.form.bank_name = d.bank_name
							this.form.money = d.money
							this.form.account_name = d.account_name
							this.form.account = d.account

							if(d.pay_time != 0 || d.pay_time || d.pay_time != null) {
								newDate.setTime(d.pay_time * 1000);
					        	this.form.pay_time =  newDate.format('yyyy-MM-dd')
							}
					        

							this.form.pic = d.pic
							this.form.pay_details = d.pay_details
							this.imageUrl = d.pic
						}
					})
	    		}
	    	}
		}
	};
</script>
<style scoped>
	.signed img {
		/*width: 300px;*/
		width: 178px;
		height: 178px;
	}
	.signed .el-form-item__content {
		width: 71%;
	}
	.signed .el-select {
		width: 100%;
	}
	.signed .el-date-editor {
		width: 100%;
	}
	.signed .el-form-item{
	    width: 91%;
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
	.dialog-footer {
		float: right;
		margin-bottom: 10px;
		margin-right: 10px;
	}
</style>
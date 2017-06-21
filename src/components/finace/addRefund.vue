<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" :rules="rules" ref="data" label-width="135px" class="demo-ruleForm">
		        <span class="addTtile">退款申请</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
					  		<el-form-item label="客户名称：" prop="user_id" style="display:block">
								<p><em>{{username}}</em><a href="javascript:;" @click="choose" v-if="!isDetail" style="margin-left: 10px">选择</a></p>
					  		</el-form-item>

					  		<el-form-item label="负责销售：">
								<p><em>{{salename}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责售后：">
								<p><em>{{aftersalename}}</em></p>
					  		</el-form-item>

		                </div>
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">打款信息</span>
				
		                <div class="addDelContent">

		                	<el-form-item label="打款方式：" prop="pay_type">
						    	<el-select placeholder="付款方式" size="small"  v-model="data.pay_type">
								    <el-option label="支付宝" value="1"></el-option>
								    <el-option label="银行转账" value="2"></el-option>
								    <el-option label="其他" value="3"></el-option>
								</el-select>
						  	</el-form-item>

						  	<el-form-item label="开户行：" prop="bank_name" v-if="data.pay_type == 2">
						    	<el-input size="small" v-model="data.bank_name"></el-input>
						  	</el-form-item>
						  	<el-form-item label="收款人姓名：" prop="payee_name">
						    	<el-input size="small" v-model="data.payee_name"></el-input>
						  	</el-form-item>
						  	<el-form-item label="账户：" prop="account"  v-if="data.pay_type == 2">
						    	<el-input size="small" v-model="data.account"></el-input>
						  	</el-form-item>
						  	<el-form-item label="联系方式：" prop="payee_contact">
						    	<el-input size="small" v-model="data.payee_contact"></el-input>
						  	</el-form-item>
						  	<el-form-item label="账户名：" prop="account_name">
						    	<el-input size="small" v-model="data.account_name"></el-input>
						  	</el-form-item>
						  	
		                </div>
					
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">退款信息</span>

		                <div class="addDelContent">
						  	<el-form-item label="可退金额："  style="display: block">
						    	<span style="margin-right: 10px;">{{ketuikuanjine}}</span> 
						    	<el-button type="text" size="small" @click="isShow = !isShow">查看详情</el-button>

						  	</el-form-item>

						  	<div class="child" style="margin-bottom: 10px;width: 90%;margin-left: 50px;" v-show="isShow">
								<el-table :data="rechargeDetail" stripe style="width: 100%">

						    		<el-table-column prop="total_money" label="总充值金额" show-overflow-tooltip></el-table-column>
						    		<el-table-column prop="consume_money" label="总消耗"></el-table-column>

    								<el-table-column prop="cashback_money" label="参与返现"></el-table-column>
    								<el-table-column prop="frozen_money" label="冻结"></el-table-column>

    								<el-table-column prop="refund_money" label="可退金额"></el-table-column>

								</el-table>
							</div>

							<el-form-item label="退款金额："  style="display: block" prop="money">
						    	<el-input size="small" v-model="data.money"></el-input>

						  	</el-form-item>

						  	<el-form-item label="备注："  style="display: block">
						    	<el-input size="small" v-model="data.remark" type="textarea"></el-input>

						  	</el-form-item>

							<el-form-item label="上传附件："  style="display: block" prop="nearby">

								<el-upload class="upload-demo" action="/base/uploadAttachment" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :on-success="fileSuccess">
								    <el-button size="small" type="primary">点击上传</el-button>
								</el-upload>

							</el-form-item>
								
						  	
						  	
		                </div>
		            </div>
		        </div>
		        <div class="addFoot">
					<span class="save" @click="submitForm('data')">提交</span>
					<span class="cancel" @click="isAddShow">取消</span>
				</div>
			</el-form>
	    </div>

	    <el-dialog :close-on-click-modal="false" v-model="dialogVisible" size="tiny" @close="cancle">
	        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

			<el-tree class="filter-tree" :data="data2" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2" @node-click="clickName"></el-tree>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogVisible = false">取 消</el-button>
	            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        	</span>
		</el-dialog>


	</div>
</template>
<script>

	var isArray = (rule, value, callback) => {
	    if (value.length == 0 && value) {
	        callback(new Error('请上传附件'));
	    } else {
	        callback();
	    }
	};
	export default {
		watch: {
	        filterText(val) {
	        	this.$refs.tree2.filter(val);
	        }
	    },
	    created() {
	    	if(this.$route.params.id && this.$route.path.indexOf('editRefund') > -1) { //编辑
	    		this.$http.post('/finance/Details', {id: this.$route.params.id}).then(d => {
	    			this.data.id = ''
	    			for(let k in this.data) {
	    				for(let key in d.body.data[0]) {
	    					if(k == key) {
	    						this.data[k] = d.body.data[0][key]
	    					}
	    				}
	    			}


	    			this.salename = d.body.data[0].sale
	    			this.aftersalename = d.body.data[0].after_sale
	    			this.username = d.body.data[0].username

	    			this.rechargeDetail.push(d.body.data.detailsMoney)
	    			this.ketuikuanjine = d.body.data.detailsMoney.refund_money
	    			this.data.money = d.body.data.detailsMoney.refund_money

	    			for(let i = 0; i < d.body.data[0].nearby.length; i++) {
	    				this.fileList2.push({name: d.body.data[0].nearby[i].name, url: d.body.data[0].nearby[i].nearbyAdds})
	    			}

	    			this.isDetail = true
	    		})

	    	} else if(!this.$route.params.id && this.$route.path.indexOf('editRefund') > -1) {
	    		this.isAddShow()
	    	} else { //添加

	    		if(this.$route.params.id) {
	    			this.isDetail = true

	    			this.username = this.$route.params.name
		    		this.data.user_id = this.$route.params.id
		    		this.salename = this.$route.params.sale_name
		    		this.aftersalename = this.$route.params.alter_sale_name

	    			this.$http.post('/finance/totalDetails', { user_id: this.$route.params.id }).then(d => {
		    			this.rechargeDetail = []
		    			this.rechargeDetail.push(d.body.data)
		    			this.ketuikuanjine = d.body.data.refund_money
		    		})
	    		} else {
	    			this.$http.post('/base/getAllUsersIndustry').then(d => {
						var d = d.body.data
						this.data2 = []
						for(let i in d) {
							this.data2[this.data2.length] = {}
							this.data2[this.data2.length - 1].label = d[i].industryName
							this.data2[this.data2.length - 1].children = d[i].list
						}
					})
	    		}
	    		
	    	}
	    	
	    },
		data() {
			return {
				username: '请选择',
				dialogVisible: false,
		        filterText: '',
		        data2: [],
		        defaultProps: {
		            children: 'children',
		            label: 'label'
		        },

		        salename: '',
		        aftersalename: '',
		        data: {
		        	user_id: '',
		        	pay_type: '',     	//支付方式
		        	bank_name: '',		//开户行
		        	payee_name: '',		//联系人
		        	payee_contact: '',	//联系人联系方式
		        	account: '',		//账户
		        	account_name: '',	//账户名
		        	money: '',
		        	remark: '',
		        	nearby: [],
		        },
		        rules: {
		          	user_id: [
		            	{ required: true, message: '请选择客户名称', trigger: 'change' }
		          	],
		            pay_type: [
		            	{ required: true, message: '请选择打款方式', trigger:'change' }
		            ],
		            account: [
		            	{ required: true, message: '请输入账户', trigger:'change' }
		            ],
		            bank_name: [
		            	{ required: true, message: '请输入开户行', trigger: 'change' },
		            ],
		            account_name: [
		            	{ required: true, message: '请输入账户名', trigger: 'change' }
		            ],
		            payee_name: [
		            	{ required: true, message: '请输入收款人姓名', trigger: 'change' }
		            ],
		            payee_contact: [
		            	{ required: true, message: '请输入收款人联系方式', trigger: 'change' }
		            ],
		            money: [
		            	{ required: true, message: '请输入退款金额', trigger: 'blur' }
		            ],

		        },

		        rechargeDetail: [],
		        ketuikuanjine: '',

				fileList2: [],//上传图片列表
				isShow: false,

				isDetail: false,
			}
		},
		methods: {
			//客户名称
			choose() {
				this.dialogVisible = true
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName(a, b, c) {
		    	if(a.id) {
		    		this.username = a.label
		    		this.data.user_id = a.id
		    		this.dialogVisible = false
		    		this.salename = a.saleRealname
		    		this.aftersalename = a.afterRealname
		    		this.$http.post('/finance/totalDetails', { user_id: a.id }).then(d => {
		    			this.rechargeDetail = []
		    			this.rechargeDetail.push(d.body.data)
		    			this.ketuikuanjine = d.body.data.refund_money
		    			this.data.money = d.body.data.refund_money
		    		})
		    	}
		    },

		    
		    isAddShow() {
		    	this.$router.go(-1)
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	if(this.$route.params.id) {
		            		this.$http.post('/finance/refundEdit', this.data).then(d => {
			            		if(d.body.ret == 1) {
			            			this.$notify({
							    		title: '成功',
							    		message: '提交成功',
							    		type: 'success'
							    	})
			            			this.$router.push('/finace/refund')
			            		} else {
			            			this.openDefeat(d.body.msg)
			            		}
			            	})

			            	return
		            	} 
		            	
		            	this.$http.post('/finance/refundAdd', this.data).then(d => {
		            		if(d.body.ret == 1) {
		            			this.$notify({
						    		title: '成功',
						    		message: '添加成功',
						    		type: 'success'
						    	})
		            			this.$router.push('/finace/refund')
		            		} else {
		            			this.openDefeat(d.body.msg)
		            		}
		            	})
			        } else {
			        	return false;
			        }
	       		});

		    },
		    //上传图片
			fileSuccess(response, file, fileList) {
				if(response.ret == 1) {
			    	this.openSuccess('文件上传成功')
			    	this.data.nearby.push({name: file.name, nearbyAdds: response.data})
				} else {
					this.openDefeat('上传失败')
				}
			},
			handleRemove(file, fileList) {
				for(let i = 0; i < this.data.nearby.length; i++) {
					if(file.name == this.data.nearby[i].name) {
						this.data.nearby.splice(i, 1)
					}
				}
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

<template>
	<div>
		<el-form :model="data" :rules="rules" ref="data" label-width="120px" class="demo-data">
	  		<div class="addBox">
		        <span class="addTtile">填写需求单</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
		                	<el-form-item label="需求单名称：" prop="demand_name">
					    		<el-input size="small" v-model="data.demand_name" :disabled="isDis"></el-input>
					  		</el-form-item>
							<el-form-item label="客户名称：" prop="user_id">
					    		<span>{{userName}}</span>
					    		<el-button type="text" size="mini" @click="choose" style="margin-left: 10px;" v-if="!redOrChange">选择</el-button>
					  		</el-form-item>
		                </div>
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">合同信息</span>
				
		                <div class="addDelContent">

			                <el-form-item label="合同单价：" prop="contract_price">
					    		<el-input size="small" v-model="data.contract_price"></el-input>
					  		</el-form-item>

					  		<el-form-item label="需求描述：" prop="demand_describe">
					    		<el-input type="textarea" v-model="data.demand_describe"></el-input>
					  		</el-form-item>

					  		<el-form-item label="返量/返现：" prop="type">
					    		<el-radio-group v-model="data.type">
								    <el-radio label="2">返现（正价）</el-radio>
								    <el-radio label="3">返现（跌价）</el-radio>
								    <el-radio label="4">返量</el-radio>
								    <el-radio label="1">都不参加</el-radio>
								</el-radio-group>
					  		</el-form-item>

							<el-form-item label="备注：">
						    	<el-input type="textarea" v-model="data.remark"></el-input>
						  	</el-form-item>

		                </div>

		            </div>

		            <div class="addDetail" v-if="data.type == 2 || data.type == 3">
		                <span class="addDelTitle">返现信息</span>
				
		                <div class="addDelContent">
							<el-form-item label="返现方式：" prop="return_cash_type">
				                <el-select v-model="data.return_cash_type" placeholder="请选择">
								    <el-option label="充值返现" value="1"></el-option>
								    <el-option label="消耗百分比返现" value="2"></el-option>
								    <el-option label="差价返现" value="3"></el-option>
								</el-select>
							</el-form-item>	

					  		<el-form-item label="返点：" prop="return_cash_num" class="little"  v-if="data.return_cash_type != 3">
					    		<el-input size="small" v-model="data.return_cash_num"></el-input>%
					  		</el-form-item>
					  		<el-form-item label="实际单价：" class="little"  v-if="data.return_cash_type == 3">
					    		<el-input size="small" v-model="data.actual_price"></el-input>
					  		</el-form-item>

							<el-form-item label="收款人姓名：">
					    		<el-input size="small" v-model="data.payee_name"></el-input>
					  		</el-form-item>

					  		<el-form-item label="联系方式：">
					    		<el-input size="small" v-model="data.payee_contact"></el-input>
					  		</el-form-item>

					  		<el-form-item label="打款方式：">
					    		<el-select v-model="data.pay_type" placeholder="请选择">
								    <el-option label="支付宝" value="1"></el-option>
								    <el-option label="银行转账" value="2"></el-option>
								    <el-option label="其它" value="3"></el-option>
								</el-select>
					  		</el-form-item>

					  		<el-form-item label="开户行：">
					    		<el-input size="small" v-model="data.bank_name"></el-input>
					  		</el-form-item>

					  		<el-form-item label="账户：">
					    		<el-input size="small" v-model="data.account"></el-input>
					  		</el-form-item>

					  		<el-form-item label="账户名：">
					    		<el-input size="small" v-model="data.account_name"></el-input>
					  		</el-form-item>
		                </div>

		            </div>

					<div class="addDetail" v-if="data.type == 4">
		                <span class="addDelTitle">返量信息</span>
				
		                <div class="addDelContent">
							<el-form-item label="返量方式：" prop="return_flow">
				                <el-select v-model="data.return_flow" placeholder="请选择">
								    <el-option label="充值返量" value="1"></el-option>
								    <el-option label="活动返量" value="2"></el-option>
								    <el-option label="测试返量" value="3"></el-option>
								</el-select>
							</el-form-item>	

					  		<el-form-item label="返量：" prop="return_flow_num" class="little">
					    		<el-input size="small" v-model="data.return_flow_num"></el-input>cpm
					  		</el-form-item>

		                </div>

		            </div>
		        </div>
		        <div class="addFoot">
					<span class="save" @click="submitForm('data')">保存</span>
					<span class="cancel" @click="isAddShow">取消</span>
				</div>
		    </div>
		</el-form>

		<el-dialog :close-on-click-modal="false" v-model="dialogVisible" size="tiny">
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
	export default {
		watch: {
	        filterText(val) {
	        	this.$refs.tree2.filter(val);
	        }
	    },
		created() {
			if(!this.$route.params.id && this.$route.path.indexOf('addDemand') == -1) {
				this.$router.go(-1)
				return
			} else {
				this.data.id = ''
				this.$http.post('/base/getDemandInfo', { id: this.$route.params.id, details: 1 }).then(d => {
					for(let k in d.body.data[0]) {
						for(let key in this.data) {
							if(k == key) {
								this.data[key] = d.body.data[0][k]
							}							
						}
					}
					this.userName = d.body.data[0].username
				})
			}

			if(this.$route.params.id) {
				this.data.user_id = this.$route.params.id
				this.userName = this.$route.params.name
			}
			this.$http.post('/base/getAllUsersIndustry').then(d => {
				var d = d.body.data
				this.data2 = []
				for(let i in d) {
					this.data2[this.data2.length] = {}
					this.data2[this.data2.length - 1].label = d[i].industryName
					this.data2[this.data2.length - 1].children = d[i].list
				}
			})
		},
		data() {
			return {
				data: {
					user_id: '',
					demand_name: '',
					contract_price: '',
					demand_describe: '',
					type: '',
					status: '',
					remark: '',
					return_cash_type: '',
					return_cash_num: '',
					actual_price: '',
					payee_name: '',
					payee_contact: '',
					pay_type: '',
					account_name: '',
					bank_name: '',
					account: '',
					account_name: '',
					return_flow: '',
					return_flow_num: '',
				},
				userName: '请选择',
				rules: {
		            'demand_name': [
		              { required: true, message: '请输入需求单名称', trigger: 'blur' }
		            ],
		            'user_id': [
		              { required: true, message: '请选择客户名称', trigger: 'blur' }
		            ],
		            'contract_price': [
		              { required: true, message: '请输入合同单价', trigger: 'blur' }
		            ],
		            'demand_describe': [
		            	{ required: true, message: '请输入需求描述', trigger: 'blur'}
		            ],
		            'type': [
		            	{ required: true, message: '请选择返量/返现', trigger: 'change'}
		            ],
		            'return_cash_type': [
		            	{ required: true, message: '请选择返现方式', trigger: 'blur'}
		            ],
		            'return_cash_num': [
		            	{ required: true, message: '情输入返点', trigger: 'blur'}
		            ],
		            'return_flow': [
		            	{ required: true, message: '请选择返量方式', trigger: 'blur'}
		            ],
		            'return_flow_num': [
		            	{ required: true, message: '情输入返量', trigger: 'blur'}
		            ],
		        },
		        dialogVisible: false,
		        filterText: '',
		        data2: [],
		        defaultProps: {
		            children: 'children',
		            label: 'label'
		        },
		        //是否从客户池过来
		        isDis: false,
			}
		},
		computed: {
			redOrChange() {
				if(this.$route.path.indexOf('addDemand') == -1) {
					this.isDis = true
					return true
				}

				if(this.$route.path.indexOf('addDemand') > -1 && this.$route.params.id) {
					this.isDis = false
					return true
				}
				return false
			}
		},
		methods: {
			isAddShow() {
		    	this.data = {
					user_id: '',
					demand_name: '',
					contract_price: '',
					demand_describe: '',
					type: '',
					status: '',
					remark: '',
					return_cash_type: '',
					return_cash_num: '',
					actual_price: '',
					payee_name: '',
					payee_contact: '',
					pay_type: '',
					account_name: '',
					bank_name: '',
					account: '',
					account_name: '',
					return_flow: '',
					return_flow_num: '',
				}
		    	this.$router.push('/business/demand')
			},
			choose() {
				this.dialogVisible = true
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName(a, b, c) {
		    	if(a.id) {
		    		this.userName = a.label
		    		this.data.user_id = a.id
		    		this.dialogVisible = false
		    	}
		    },
		    submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	if(this.$route.path.indexOf('addDemand') > -1) {
			            	this.subAPI('/business/demandAdd', '添加')
		            	}
		            	if(this.$route.path.indexOf('redDemand') > -1) {
			            	this.subAPI('/business/demandEdit', '编辑')
		            	}
		            	if(this.$route.path.indexOf('changeDemand') > -1) {
			            	this.subAPI('/business/demandUpdate', '变更')
		            	}
			        } else {
			            return false;
			        }
		        });

		    },
		    clearOther() {
		  //   	this.data.return_cash_type = ''
				// this.data.return_cash_num = ''
				// this.data.actual_price = ''
				// this.data.payee_name = ''
				// this.data.payee_contact = ''
				// this.data.pay_type = ''
				// this.data.account_name = ''
				// this.data.bank_name = ''
				// this.data.account = ''
				// this.data.account_name = ''
				// this.data.return_flow = ''
				// this.data.return_flow_num = ''
		    },
		    subAPI(path, str) {
		    	this.$http.post(path, this.data).then(d => {
	            	if(d.data.ret == 0) {
	            		this.$notify.error({
				    		title: '错误',
				    		message: d.data.msg
				    	})
	            		return false
	            	}
	            	this.$notify({
			    		title: '成功',
			    		message: str + '成功',
			    		type: 'success'
			    	})
	            	this.isAddShow()
	            })
		    }
		}
	}
</script>
<style scoped>
	.addBox .el-form-item {
		width: 635px;
		display: block;
	}
	.el-form-item .el-form-item__label {
		text-align: left;
	}
	.el-select {
		width: 515px;
	}
	.little .el-input{
		width: 100px;
		margin-right: 5px;
	}
	.el-radio-group .el-radio {
		margin-right: 25px;
	}
</style>
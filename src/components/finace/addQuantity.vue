<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" :rules="rules" ref="data" label-width="135px" class="demo-ruleForm">
				<span class="addTtile">返量申请</span>
				<div class="addContent">
					<div class="addDetail">
						<span class="addDelTitle">基本信息</span>

						 <div class="addDelContent">
					  		<el-form-item label="客户名称：" prop="user_id">
								<p><em>{{username}}</em><a href="javascript:;" @click="choose" v-if="!isSure" style="margin-left: 10px">选择</a></p>
					  		</el-form-item>
					  		<el-form-item label="需求单名称：" prop="demand_id">
								<p><em>{{demand_name}}</em><a href="javascript:;" @click="choose2" v-if="!isSure" style="margin-left: 10px">选择</a></p>
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
						<span class="addDelTitle">返量信息</span>

						<div class="addDelContent">
							<el-form-item label="返量原因：" prop="type" v-if="!data.is_special">
								<span v-if="data.type">{{data.type | return_flow}}</span>

								<!-- <el-select placeholder="付款方式" size="small" v-model="data.type" v-if="data.type == 0">
								    <el-option label="充值返量" value="0"></el-option>
								    <el-option label="测试返量" value="1"></el-option>
								    <el-option label="活动返量" value="2"></el-option>
								</el-select> -->

					  		</el-form-item>

					  		<el-form-item label="返量原因：" prop="type" v-if="data.is_special">

								<el-select placeholder="返量原因" size="small" v-model="data.type">
								    <el-option label="充值返量" value="1"></el-option>
								    <el-option label="测试返量" value="3"></el-option>
								    <el-option label="活动返量" value="2"></el-option>
								</el-select>

					  		</el-form-item>

					  		<el-form-item label="子订单："  style="display: block; width: 100%;" prop="actual">
						    	<div class="child">
						    		<el-table :data="childData" stripe style="width: 100%" v-if="childData.length > 0"  @selection-change="handleSelectionChange" >

										<el-table-column type="selection" width="40"></el-table-column>
							    		<el-table-column prop="put_city" label="投放地区" show-overflow-tooltip></el-table-column>
							    		<el-table-column prop="put_type" label="投放类型"></el-table-column>
	    								<el-table-column prop="actual_price" label="实际单价（元）"></el-table-column>
	    								<el-table-column prop="benchmark_price" label="基准单价（元）"></el-table-column>

  									</el-table>
						    	</div>
						  	</el-form-item>
							

							<el-form-item label="赠送流量：" prop="gift_cpm">
								<el-input size="small" v-model="data.gift_cpm" @change="changeLastTabel"  v-if="childCpm.length == 0"></el-input>

								<el-select placeholder="赠送流量" size="small" @change="change_gift_cpm" v-model="childCpmIndex" v-if="childCpm.length > 0">
								    <el-option v-for="(val, index) in childCpm" :label="val.return_flow_num" :value="index"></el-option>
								</el-select>
					  		</el-form-item>
							

							<el-form-item label="实际流量："  style="display: block; width: 100%;"  v-if="childData2.length > 0 && data.gift_cpm != ''">
						    	<div class="child">
						    		<el-table :data="childData2" stripe style="width: 100%">

							    		<el-table-column prop="put_city" label="投放地区" show-overflow-tooltip></el-table-column>
							    		<el-table-column prop="put_type" label="投放类型"></el-table-column>

	    								<el-table-column prop="actual_price" label="实际单价（元）"></el-table-column>

	    								<el-table-column prop="gift_cpm" label="赠送量（crm）"></el-table-column>
	    								<el-table-column prop="money" label="消耗金额"></el-table-column>

  									</el-table>
						    	</div>
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

		<el-dialog :close-on-click-modal="false" v-model="dialogVisible2" size="tiny">
	        <el-input placeholder="输入关键字进行过滤" v-model="filterText2"></el-input>

			<el-tree class="filter-tree" :data="data3" :props="defaultProps2" :accordion="true" :filter-node-method="filterNode" ref="tree3" @node-click="clickName2"></el-tree>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogVisible2 = false">取 消</el-button>
	            <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
        	</span>
		</el-dialog>
	</div>
</template>
<script>

	var isArray = (rule, value, callback) => {
	    if (value.length == 0 && value) {
	        callback(new Error('请选择子订单'));
	    } else {
	        callback();
	    }
	};

	export default {
		watch: {
	        filterText(val) {
	        	this.$refs.tree2.filter(val);
	        },
	        filterText2(val) {
	        	this.$refs.tree3.filter(val);
	        }
	    },
	    created() {
	    	this.$http.post('/base/getAllUsersIndustry').then(d => {
				var d = d.body.data
				this.data2 = []
				for(let i in d) {
					this.data2[this.data2.length] = {}
					this.data2[this.data2.length - 1].label = d[i].industryName
					this.data2[this.data2.length - 1].children = d[i].list
				}
			})

			if(this.$route.params.demand_id) {
				this.isSure = true

				this.demand_name = this.$route.params.demand_name
	    		this.data.demand_id = this.$route.params.demand_id
	    		this.data.type = this.$route.params.type

	    		this.username = this.$route.params.username
	    		this.data.user_id = this.$route.params.user_id

	    		//时段
	    		this.$http.post('/base/getChildOrder', {user_id: this.data.user_id, demand_id: this.data.demand_id}).then(d => {
	    			this.data.sale_id = d.body.data.sale_id
	    			this.data.after_sale_id = d.body.data.afterid
	    			this.salename = d.body.data.salename
	    			this.aftersalename = d.body.data.aftername
	    			this.childData = d.body.data.list

	    			this.childCpm = d.body.data.demands
	    		})
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

		        demand_name: '请选择',
				dialogVisible2: false,
		        filterText2: '',
		        data3: [],
		        defaultProps2: {
		            children: 'children',
		            label: 'label'
		        },

		        isSure: false,

		        salename: '',
		        aftersalename: '',

				data: {
					user_id: '',
					demand_id: '',
					sale_id: '',
					after_sale_id: '',
					type: '',
					gift_cpm: '',
					child_id: '',
					remark: '',
					is_special: '',
					actual: [],
				},
				//如果demands为空数组，就加is_special

				 rules: {
		          	user_id: [
		            	{ required: true, message: '请选择客户名称', trigger: 'change' }
		          	],
		            demand_id: [
		            	{ required: true, message: '请选择需求单', trigger: 'change' }
		            ],
		            type: [
		            	{ required: true, message: '请选择返量原因' }
		            ],
		            gift_cpm: [
		            	{ required: true, message: '请输入赠送流量', trigger:'change' }
		            ],
		            actual: [
		            	{ validator: isArray, trigger: 'change' }
		            ]
		        },

				childData: [],
				childData2: [],

				childCpm: [],
				childCpmIndex: '',
			}
		},
		methods: {
			delData(type = 0) {
				//清空已选数据
		        for(let k in this.data) {
		        	if(k == 'user_id' && type == 1) {
		        		
		        	} else {
		        		this.data[k] = ''
		        	}
		        }
		        this.salename = ''
		        this.aftersalename = ''
		        this.demand_name = '请选择'

		        this.childData = []
				this.childData2 = []

				this.childCpm = []
				this.childCpmIndex = ''
			},
			//客户名称
			choose() {
				this.dialogVisible = true
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName(a, b, c) {
		    	this.delData()
		    	if(a.id) {
		    		this.username = a.label
		    		this.data.user_id = a.id
		    		this.dialogVisible = false
		    		this.$http.post('/base/demandList', { user_id: a.id, type: 2 }).then(d => {
		    			this.data3 = []
		    			if(d.body.data) {
		    				for(let i = 0; i < d.body.data.length; i++) {
			    				this.data3[this.data3.length] = {}
			    				this.data3[this.data3.length - 1].label = d.body.data[i].demand_name
			    				this.data3[this.data3.length - 1].id = d.body.data[i].id

			    				this.data3[this.data3.length - 1].return_cash_type = d.body.data[i].return_cash_type
			    				this.data3[this.data3.length - 1].return_flow = d.body.data[i].return_flow
			    				this.data3[this.data3.length - 1].return_flow_num = d.body.data[i].return_flow_num
			    			}
		    			}
		    		})
		    	}
		    },
		    //需求单名称
		    choose2() {
				this.dialogVisible2 = true
			},
			filterNode2(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName2(a, b, c) {
		    	if(a.id) {
		    		this.demand_name = a.label
		    		this.dialogVisible2 = false
		    		this.data.demand_id = a.id
		    		this.data.type = a.return_flow


		    		//时段
		    		this.$http.post('/base/getChildOrder', {user_id: this.data.user_id, demand_id: this.data.demand_id}).then(d => {
		    			this.data.sale_id = d.body.data.sale_id
		    			this.data.after_sale_id = d.body.data.afterid
		    			this.salename = d.body.data.salename
		    			this.aftersalename = d.body.data.aftername
		    			this.childData = d.body.data.list

		    			if(d.body.data.demands.length > 0) {
		    				this.childCpm = d.body.data.demands
		    			} else {
		    				this.data.is_special = 1
		    				this.data.type = ''
		    			}
		    		})
		    	}
		    },
		    //子订单
		    handleSelectionChange(val) {
		    	if(val.length == 0) {
		    		this.childData2 = []
		    		return
		    	}
		    	this.childData2 = val
		    	this.changeLastTabel()
		    },

		    change_gift_cpm() {
		    	this.data.gift_cpm = this.childCpm[this.childCpmIndex].return_flow_num
		    	this.data.child_id = this.childCpm[this.childCpmIndex].id
		    	if(this.data.gift_cpm != '') {
		    		this.changeLastTabel()
		    	}
		    },

		    changeLastTabel() {
		    	this.data.actual = []
		    	for(let i = 0; i < this.childData2.length; i++) {
		    		let d = this.childData2[i]
		    		this.childData2[i].gift_cpm = (this.data.gift_cpm / this.childData2.length).toFixed(2)
		    		this.childData2[i].money = (this.childData2[i].gift_cpm * this.childData2[i].actual_price).toFixed(2)

		    		this.data.actual.push({order_id: d.id, gift_cpm: d.gift_cpm, money: d.money,demand_id: this.data.demand_id})
		    	}
		    	this.childData2.push({})
		    	this.childData2.pop()
		    },

		    isAddShow() {
		    	this.$router.go(-1)
		    },

		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	this.data.order_id = []
		            	for(let i = 0; i < this.data.actual.length; i++) {
		            		this.data.order_id.push(this.data.actual[i].order_id) 
		            	}
		            	this.data.order_id = this.data.order_id.join(',')
		            	this.$http.post('/Finance/returnAmountAdd', this.data).then(d => {
		            		if(d.body.ret == 1) {
		            			this.$notify({
						    		title: '成功',
						    		message: '添加成功',
						    		type: 'success'
						    	})
		            			this.$router.push('/finace/returnQuantity')
		            		} else {
		            			this.$notify({
						    		title: '失败',
						    		message: d.body.msg,
						    		type: 'error'
						    	})
		            		}
		            	})
			        } else {
			            return false;
			        }
	       		});

		    },

		}
	}
</script>
<style></style>
<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" :rules="rules" ref="data" label-width="135px" class="demo-ruleForm">
		        <span class="addTtile">返现申请</span>
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
					  		<el-form-item label="返现起始日期：" style="display: block">
						    	<!-- <el-date-picker type="date" placeholder="打款时间" @change="getDate" v-model="start_date" :picker-options="pickerOptions0" :editable=false></el-date-picker> -->

						    	<el-select placeholder="打款时间" size="small"  v-model="start_date" @change="resetGet">
								    <el-option v-for="(val, index) in time_frame" :label="val.timeSlot" :value="val.id"></el-option>
								</el-select>

						  	</el-form-item>
		                </div>
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">打款信息</span>
				
		                <div class="addDelContent">

		                	<el-form-item label="打款方式：" prop="pay_type">
						    	<el-select placeholder="付款方式" size="small" v-model="data.pay_type">
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

		            <div class="addDetail" v-if="data.demand_id">
		                <span class="addDelTitle">返现信息</span>

		                <div class="addDelContent">
		                
		                	
						  	<el-form-item label="返现原因："  style="display: block" v-if="is_special == 0">
						    	<span>{{return_cash_name}}</span>
						  	</el-form-item>

						    		
					    	<el-form-item label="返现原因：" prop="return_cash_type"  style="display: block" v-else>
						    	<el-select placeholder="返现原因" size="small"  v-model="data.return_cash_type" @change="getTable">
								    <el-option label="充值返现" value="1"></el-option>
								    <el-option label="消耗百分比返現" value="2"></el-option>
								    <el-option label="差价返现" value="3"></el-option>
								</el-select>
						  	</el-form-item>


						  	<el-form-item label="返点："  style="display: block" v-if="data.return_cash_type != 3 && is_special == 0">
						    	<span v-if="data.return_cash_num">{{data.return_cash_num}}%</span>
						  	</el-form-item>


						  	<el-form-item label="返点："  style="display: block" v-if="data.return_cash_type != 3 && is_special == 1" prop="return_cash_num">
						    	<el-input size="small" @change="countMoney" v-model="data.return_cash_num"></el-input> %
						  	</el-form-item>

						  	<el-form-item label="子订单："  style="display: block; width: 100%;" v-if="data.return_cash_type != 1">
						    	<div class="child" v-if="tableData.length != 0">
						    		<el-table :data="tableData" stripe style="width: 100%">
							    		<el-table-column prop="area" label="投放地区" show-overflow-tooltip></el-table-column>
							    		<el-table-column prop="put_type_name" label="投放类型"></el-table-column>
	    								<el-table-column prop="allPv" label="展现量（pv）"></el-table-column>
	    								<el-table-column prop="contract_price" label="合同价（元）"></el-table-column>

	    								<el-table-column prop="consume_money" label="消耗金额（元）" v-if="data.return_cash_type == 2"></el-table-column>

	    								<el-table-column prop="actual_price" label="实际价（元）" v-if="data.return_cash_type == 3"></el-table-column>
	    								<el-table-column prop="return_money" label="可返现金额（元）" v-if="data.return_cash_type == 3"></el-table-column>
  									</el-table>
						    	</div>
						  	</el-form-item>

						  	<el-form-item label="可返现消耗："  style="display: block" prop="involved_money"  v-if="data.return_cash_type == 2"> 
						    	<el-input size="small" v-model="data.involved_money" @change="countMoney"></el-input> 元
						  	</el-form-item>

						  	<el-form-item label="参与返现金额："  style="display: block; width: 100%" prop="involved_money"  v-if="data.return_cash_type == 1"> 
						    	<el-input size="small" v-model="data.involved_money" @change="countMoney" v-if= "max_involved_money"></el-input> 元 
						    	<el-button type="text" size="mini" class="textBtn" @click="opentable" style="margin-left:10px;">选择充值记录</el-button>
						  	</el-form-item>

						  	<div class="payDate" v-if="max_involved_money">
						  		{{max_involved_money}}元（{{tableDate}}）
						  	</div>
							<!-- 差价返时只读 -->
						  	<el-form-item label="返现金额：" style="display: block" prop="money" v-if="data.return_cash_type != 3">
						    	<el-input size="small" v-model="data.money" readonly="readonly"></el-input> 元
						  	</el-form-item>

						  	<el-form-item label="返现金额：" style="display: block" prop="money" v-if="data.return_cash_type == 3">
						    	<!-- <el-input size="small" v-model="data.money"></el-input> 元 -->
						    	{{data.money}} 元
						  	</el-form-item>

						  	<span style="margin-left:54px;">通过可返现金额与预计返现金额不一致，存在疑惑请查看
								<el-button type="text" size="mini" class="textBtn" @click="accounting">核算记录</el-button>
						  	</span>

					    	<!-- <el-input size="small" v-model="data.money"></el-input> 元 -->
					    	<div class="fanxian" style="margin-top: 18px;" v-if="hesuanStatus">
								<div class="fanxian_title">
									<span class="title1">核算记录</span>
									<span class="title2">{{hesuanDate}}</span>
								</div>
								<table  cellspacing="0" cellpadding="0" class="table1">
									<tr>
										<th v-if="data.return_cash_type != 3">本需求单总消耗金额</th>
										<th v-if="data.return_cash_type != 3">历史参与返现总金额</th>

										<th v-if="data.return_cash_type == 3">本需求单总投放量（pv）</th>
										<th v-if="data.return_cash_type == 3">差价消耗额</th>

										<th>已返现金额</th>
										<th>已返现次数</th>
									</tr>
									<tr>
										<td v-if="data.return_cash_type != 3">{{hesuan.all_consume}}</td>
										<td v-if="data.return_cash_type != 3">{{hesuan.cashback_involved_money}}</td>

										<td v-if="data.return_cash_type == 3">{{hesuan.all_pv}}</td>
										<td v-if="data.return_cash_type == 3">{{hesuan.cha_money}}</td>

										<td>{{hesuan.cashback_money}}</td>
										<td>{{hesuan.cashBackTimes}}</td>
									</tr>
								</table>
								<div class="table2">
									<table border="0" cellspacing="0" cellpadding="0" class="table2_1">
										<tr>
											<th>结算日期</th>
											<th>已返现（元）</td>
										</tr>
									</table>
									<div>
										<table border="0" cellspacing="0" cellpadding="0" class="table2_2" v-for="(val, index) in hesuan.cash_Back_list">
											<tr class="none_border">
												<td>{{val.create_time}}</td>
												<td>{{val.money}}</td>
											</tr>
										</table>
									</div>
								</div>
								<p>请选择用于改需求单的充值金额，如结果是返现金额大于消耗将提醒相关人员进行异常核验</p>
							</div>						  	
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

		<el-dialog :close-on-click-modal="false" v-model="dialogVisible3" size="tiny">
			<div class="rechargeRecord">
				<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				    <el-tab-pane label="近7天" name="-7">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				    <el-tab-pane label="近30天" name="-30">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				    <el-tab-pane label="近2个月" name="-60">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				    <el-tab-pane label="近6个月" name="-180">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				    <el-tab-pane label="近1年" name="-365">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				    <el-tab-pane label="全部" name="0">
				    	<el-table ref="multipleTable"  highlight-current-row @current-change="handleCurrentChange" :data="searchData" border tooltip-effect="dark" style="width: 100%">
					      	<el-table-column prop="pay_date" label="充值时间"></el-table-column>
					      	<el-table-column prop="money" label="充值金额"></el-table-column>
					      	<el-table-column prop="cash" label="返现情况"></el-table-column>
					    </el-table>
				    </el-tab-pane>
				</el-tabs>
			</div>

	        <span slot="footer" class="dialog-footer">
	            <el-button @click="cancle">取 消</el-button>
	            <el-button type="primary" @click="makeSure">确 定</el-button>
        	</span>
		</el-dialog>

	</div>
</template>
<script>
	function GetDateStr(AddDayCount) {   
    	var dd = new Date();  
    	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
    	var y = dd.getFullYear();   
    	var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
    	var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
    	return y+"-"+m+"-"+d;   
	}  
	var max_involved_money;
	var max = (rule, value, callback) => {
		console.log(value)
	    if (Number(max_involved_money) < Number(value) && value) {
	        callback(new Error('不能超过最大返现金额'));
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
				this.demand_name = this.$route.params.demand_name
	    		this.data.demand_id = this.$route.params.demand_id
	    		this.data.user_id = this.$route.params.user_id
	    		this.username = this.$route.params.username
	    		this.isSure = true
	    		// if(a.return_cash_type == 3) {
	    		// 	this.isChajia = false
	    		// } else {
	    		// 	this.isChajia = true
	    		// }
	    		this.$http.post('/base/demandInfo', {demand_id: this.$route.params.demand_id}).then(d => {
	    			this.salename = d.body.data.sale_name
	    			this.aftersalename = d.body.data.after_sale_name
	    			this.return_cash_name = d.body.data.return_cash_name
	    			this.is_special = d.body.data.is_special

	    			this.data.sale_id = d.body.data.sale_id
	    			this.data.pay_type = d.body.data.pay_type == 0 ? '': d.body.data.pay_type + ''
	    			this.data.account = d.body.data.account
	    			this.data.account_name = d.body.data.account_name
	    			this.data.bank_name = d.body.data.bank_name
	    			this.data.payee_name = d.body.data.payee_name
	    			this.data.payee_contact = d.body.data.payee_contact
					this.data.return_cash_num = d.body.data.return_cash_num == 0 ? '': d.body.data.return_cash_num
		    		this.data.return_cash_type = d.body.data.return_cash_type == 0 ? '': d.body.data.return_cash_type

		    		//百分比返的可返现消耗默认 并且不能查过最大默认值
	    			//充值返没有可返现消耗，返现金额默认认值不能修改
	    			if(this.data.return_cash_type == 2) {
	    				max_involved_money = d.body.data.available_amount
	    				this.data.involved_money = d.body.data.available_amount + ''
	    				this.countMoney()
	    				
	    			} else if(this.data.return_cash_type == 3) {
	    				this.data.money = d.body.data.available_amount + ''
	    			} else {
	    				// max_involved_money = 10000000000000000
	    			}

	    		})
	    		//时段
	    		this.$http.post('/base/demandTimeSlot', {demand_id: this.$route.params.demand_id}).then(d => {
	    			this.time_frame = d.body.data
	    			this.start_date = d.body.data[0].id
	    			this.getChild()

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

		        is_special: '', //是否特殊，特殊为1 返现原因和返点可填

		        isSure: false,

		        salename: '',
		        aftersalename: '',
		        return_cash_name: '',   //返现原因
		        return_cash_num: '',	//返点
		        return_cash_type: '',
		        start_date: '',		//返现旗帜日期
		        data: {
		        	user_id: '',
		        	demand_id: '',
		        	sale_id: '',
		        	pay_type: '',     	//支付方式
		        	bank_name: '',		//开户行
		        	payee_name: '',		//联系人
		        	payee_contact: '',	//联系人联系方式
		        	account: '',		//账户
		        	account_name: '',	//账户名
		        	return_cash_num: '',
		        	return_cash_type: '',
		        	involved_money: '',
		        	money: '',
		        	recharge_id: '',	//充值id
		        },
		        max_involved_money: '', //最大可参与返现金额
		        rules: {
		          	user_id: [
		            	{ required: true, message: '请选择客户名称', trigger: 'change' }
		          	],
		            demand_id: [
		            	{ required: true, message: '请选择需求单', trigger: 'change' }
		            ],
		            pay_type: [
		            	{ required: true, message: '请选择打款方式', trigger:'blur' }
		            ],
		            account: [
		            	{ required: true, message: '请输入账户', trigger:'blur' }
		            ],
		            bank_name: [
		            	{ required: true, message: '请输入开户行', trigger: 'blur' },
		            ],
		            account_name: [
		            	{ required: true, message: '请输入账户名', trigger: 'blur' }
		            ],
		            payee_name: [
		            	{ required: true, message: '请输入收款人姓名', trigger: 'change' }
		            ],
		            payee_contact: [
		            	{ required: true, message: '请输入收款人联系方式', trigger: 'change' }
		            ],
		            start_date: [
		            	{ required: true, message: '请输入返现起始日期', trigger: 'change' }
		            ],
		            involved_money: [
		            	{ required: true, message: '请输入可返现消耗', trigger: 'change' },
		            	{ validator: max, trigger: 'change' }
		            ],
		            return_cash_num: [
		            	{ required: true, message: '请输入返点', trigger: 'change' },
		            ],
		            return_cash_type: [
		            	{ required: true, message: '请选择返现原因', trigger: 'change' },
		            ],
		            money: [
		            	{ required: true, message: '请输入返现金额' }
		            ],

		        },
				isRecord: false,
				tableData: [],


				dialogVisible3: false,
				searchData: [],//选项卡

				chooseData: {}, //选择的数据
				tableDate: '', //充值记录日期
				activeName: '-7', //第一张

				time_frame: [], //时段

				hesuan: '', //核算记录
				hesuanStatus: false,
				hesuanDate: '',//核算记录时段
			}
		},
		methods: {
			//清空部分数据
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
		        this.return_cash_name = ''  //返现原因
		        this.start_date = ''		//返现旗帜日期
		        this.demand_name = '请选择'
		        this.max_involved_money = ''
		        max_involved_money = ''
		        this.hesuanStatus = false
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
		    		this.$http.post('/base/demandList', { user_id: a.id, type: 1 }).then(d => {
		    			this.data3 = []
		    			if(d.body.data) {
		    				for(let i = 0; i < d.body.data.length; i++) {
			    				this.data3[this.data3.length] = {}
			    				this.data3[this.data3.length - 1].label = d.body.data[i].demand_name
			    				this.data3[this.data3.length - 1].id = d.body.data[i].id
			    				this.data3[this.data3.length - 1].return_cash_type = d.body.data[i].return_cash_type
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
		    	this.delData(1)

		    	if(a.id) {
		    		this.demand_name = a.label
		    		this.dialogVisible2 = false
		    		this.data.demand_id = a.id
		    		// if(a.return_cash_type == 3) {
		    		// 	this.isChajia = false
		    		// } else {
		    		// 	this.isChajia = true
		    		// }
		    		this.$http.post('/base/demandInfo', {demand_id: a.id}).then(d => {
		    			this.salename = d.body.data.sale_name
		    			this.aftersalename = d.body.data.after_sale_name
		    			this.return_cash_name = d.body.data.return_cash_name
		    			this.is_special = d.body.data.is_special

		    			this.data.sale_id = d.body.data.sale_id
		    			this.data.pay_type = d.body.data.pay_type == 0 ? '': d.body.data.pay_type + ''
		    			this.data.account = d.body.data.account
		    			this.data.account_name = d.body.data.account_name
		    			this.data.bank_name = d.body.data.bank_name
		    			this.data.payee_name = d.body.data.payee_name
		    			this.data.payee_contact = d.body.data.payee_contact
		    			this.data.return_cash_num = d.body.data.return_cash_num == 0 ? ' ': d.body.data.return_cash_num
		    			this.data.return_cash_type = d.body.data.return_cash_type == 0 ? ' ': d.body.data.return_cash_type

		    			//百分比返的可返现消耗默认 并且不能查过最大默认值
		    			//充值返没有可返现消耗，返现金额默认认值不能修改
		    			if(this.data.return_cash_type == 2) {
		    				max_involved_money = d.body.data.available_amount
		    				this.data.involved_money = d.body.data.available_amount + ''
		    				this.countMoney()
		    				
		    			} else if(this.data.return_cash_type == 3) {
		    				this.data.money = d.body.data.available_amount + ''
		    			} else {
		    				// max_involved_money = 10000000000000000
		    			}

		    		})


		    		//时段
		    		this.$http.post('/base/demandTimeSlot', {demand_id: a.id}).then(d => {
		    			this.time_frame = d.body.data
		    			this.start_date = d.body.data[0].id
		    			
		    			this.getChild()
		    		})

		    		
		    		
		    	}
		    },
	    	showRecord() {
	    		this.isRecord = !this.isRecord
	    	},
	    	getTable(v) {

	    		this.max_involved_money = ''
	    		max_involved_money = ''
	    		this.data.involved_money = ''
	    		this.data.return_cash_num = ''
	    		this.data.money = ''

	    		this.$http.post('/base/orderInfoData', {demand_id: this.data.demand_id, return_cash_type: this.data.return_cash_type}).then(d => {
	    				if(d.data.data) {
	    					this.tableData = d.body.data
	    				} else {
	    					this.tableData = []
	    				}
			    	})
	    		if(v > 1) {
	    			this.$http.post('/base/specialReturn', {demand_id: this.data.demand_id, return_cash_type: this.data.return_cash_type}).then( d => {
	    				if(v == 2) {
	    					max_involved_money = d.body.data.available_amount
		    				this.data.involved_money = d.body.data.available_amount
	    				}
		    			if(v == 3) {
		    				this.data.money = d.body.data.available_amount
		    			}
	    			})
	    		}
	    	},
	    	getChild() {
	    		// console.log(this.data.demand_id + " - " + this.start_date + ' - ' + this.return_cash_num)
	    		if(this.data.demand_id && this.start_date && this.data.return_cash_num != 1 && this.is_special == 0) {
	    			this.$http.post('/base/orderInfoData', {demand_id: this.data.demand_id}).then(d => {
	    				if(d.data.data) {
	    					this.tableData = d.body.data
	    				} else {
	    					this.tableData = []
	    				}
	    				
			    	})
	    		} else {
	    			this.tableData = []
	    		}
	    		
	    	},
	    	handleClick(tab, event) {
	    		if(tab.name == 0) {
	    			this.chooseDate('')
	    		} else {
        			this.chooseDate(GetDateStr(Number(tab.name)))
	    		}
    		},
    		//打开首加载
    		opentable() {
    			this.dialogVisible3 = true
    			this.activeName = '-7'
    			this.chooseDate(GetDateStr(Number(-7)))
    		},
	    	chooseDate(date) {
	    		this.$http.post('/base/rechargeRecord', {user_id: this.data.user_id, start_date: date}).then(d => {
	    			this.searchData = d.body.data
	    			this.searchData.forEach((val, index) => {
	    				if(val.cash_back_type == 0) {
	    					val.cash = '未返现'
	    				}
	    				if(val.cash_back_type == 1) {
	    					val.cash = '待返现'
	    				}
	    				if(val.cash_back_type == 2) {
	    					val.cash = '已返现'
	    				}
	    			})

	    		})	
	    	},

	    	handleCurrentChange(val) {
	    		// console.log(val)
	    		if(val && val.cash_back_type == 0) {
	    			this.chooseData.involved_money = val.money
			        this.chooseData.pay_date = val.pay_date
			        this.chooseData.recharge_id = val.id
	    		} else {
	    			this.chooseData.involved_money = ''
			        this.chooseData.pay_date = ''
			        this.chooseData.recharge_id = ''
	    		}
		        
		    },
		    cancle() {
		    	this.dialogVisible3 = false
		    	this.chooseData = {}
		    	this.searchData = []
		    },
		    //确定后 可返现消耗添加 算出返现金额
		    makeSure() {
		    	this.data.involved_money = Number(this.chooseData.involved_money)
		    	this.data.money = this.data.involved_money * this.data.return_cash_num / 100
		    	this.data.recharge_id = this.chooseData.recharge_id

		    	this.tableDate = this.chooseData.pay_date
		    	this.max_involved_money = this.chooseData.involved_money
	    		max_involved_money = this.chooseData.involved_money

		    	this.cancle()
		    },
		    //核算记录
		    accounting() {
		    	if(this.data.demand_id) {
		    		this.$http.post('/base/accountRecords', {demand_id: this.data.demand_id}).then(d => {
		    			// console.log(this.data.money)
		    			this.hesuanStatus = !this.hesuanStatus
		    			this.hesuan = d.body.data
		    		})
		    	}
		    },
		    isAddShow() {
		    	this.$router.go(-1)
		    },
		    submitForm(formName) {
		    	this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	if(Number(this.data.involved_money) > Number(max_involved_money)) {
		            		this.$notify({
					    		title: '失败',
					    		message: `参与返现金额不能大于${max_involved_money}`,
					    		type: 'error'
					    	})
					    	return
		            	}
		            	this.$http.post('/finance/addCashBack', this.data).then(d => {
		            		if(d.body.ret == 1) {
		            			this.$notify({
						    		title: '成功',
						    		message: '添加成功',
						    		type: 'success'
						    	})
		            			this.$router.push('/finace/returnCash')
		            		} else {
		            			this.$notify({
						    		title: '失败',
						    		message: d.data.msg,
						    		type: 'error'
						    	})
		            		}
		            	})
			        } else {
			            console.log(this.data)
			            return false;
			        }
	       		});

		    },
		    countMoney(value) {
		    	if(this.data.return_cash_type != 3)
		    		this.data.money = (this.data.involved_money * this.data.return_cash_num / 100).toFixed(2)
		    },
		    resetGet() {
		    	this.$http.post('/base/demandInfo', {demand_id: this.start_date}).then(d => {
	    			this.salename = d.body.data.sale_name
	    			this.aftersalename = d.body.data.after_sale_name
	    			this.return_cash_name = d.body.data.return_cash_name
	    			this.is_special = d.body.data.is_special


	    			this.data.sale_id = d.body.data.sale_id
	    			this.data.pay_type = d.body.data.pay_type ==  0 ? '': d.body.data.pay_type + ''
	    			this.data.account = d.body.data.account
	    			this.data.account_name = d.body.data.account_name
	    			this.data.bank_name = d.body.data.bank_name
	    			this.data.payee_name = d.body.data.payee_name
	    			this.data.payee_contact = d.body.data.payee_contact
					this.data.return_cash_num = d.body.data.return_cash_num == 0 ? ' ': d.body.data.return_cash_num
		    		this.data.return_cash_type = d.body.data.return_cash_type == 0 ? ' ': d.body.data.return_cash_type

	    			//核算时段
	    			this.time_frame.forEach((val, index) => {
	    				if(val.id == this.start_date) {
	    					this.hesuanDate = val.timeSlot
	    				}
	    			})

	    		})
		    }
		}
	}
</script>

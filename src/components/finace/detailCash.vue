<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" ref="data" label-width="135px" class="demo-ruleForm">
		        <span class="addTtile">返现申请</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
					  		<el-form-item label="客户名称：" prop="user_id">
								<p><em>{{data.username}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="需求单名称：" prop="demand_id">
								<p><em>{{data.demand_name}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责销售：">
								<p><em>{{data.sale_name}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责售后：">
								<p><em>{{data.aftersale_name}}</em></p>
					  		</el-form-item>
		                </div>
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">打款信息</span>
				
		                <div class="addDelContent">

		                	<el-form-item label="打款方式：" prop="pay_type">
						    	<!-- <el-select placeholder="付款方式" size="small"  v-model="data.pay_type">
								    <el-option label="支付宝" value="1"></el-option>
								    <el-option label="银行转账" value="2"></el-option>
								    <el-option label="其他" value="3"></el-option>
								</el-select> -->
								<span>{{data.pay_name}}</span>
						  	</el-form-item>

						  	<el-form-item label="开户行：" prop="bank_name" v-if="data.pay_name != '支付宝'">
						    	<!-- <el-input size="small" v-model="data.bank_name"></el-input> -->
						    	<span>{{data.bank_name}}</span>
						  	</el-form-item>
						  	<el-form-item label="收款人姓名：" prop="payee_name">
						    	<!-- <el-input size="small" v-model="data.payee_name"></el-input> -->
						    	<span>{{data.payee_name}}</span>
						  	</el-form-item>
						  	<el-form-item label="账户：" prop="account" v-if="data.pay_name != '支付宝'">
						    	<!-- <el-input size="small" v-model="data.account"></el-input> -->
						    	<span>{{data.account}}</span>
						  	</el-form-item>
						  	<el-form-item label="联系方式：" prop="payee_contact">
						    	<!-- <el-input size="small" v-model="data.payee_contact"></el-input> -->
						    	<span>{{data.payee_contact}}</span>
						  	</el-form-item>
						  	<el-form-item label="账户名：" prop="account_name">
						    	<!-- <el-input size="small" v-model="data.account_name"></el-input> -->
						    	<span>{{data.account_name}}</span>
						  	</el-form-item>
						  	
		                </div>
					
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">返现信息</span>

		                <div class="addDelContent">
		                
		                	
						  	<el-form-item label="返现原因："  style="display: block">
						    	<span>{{data.return_cash_name}}</span>
						  	</el-form-item>
						  	<el-form-item label="返点："  style="display: block" v-if="data.return_cash_type != 3">
						    	<span v-if="data.return_cash_num">{{data.return_cash_num}}%</span>
						  	</el-form-item>

						  	<el-form-item label="参与返现金额："  style="display: block; width: 100%" prop="involved_money" v-if="data.return_cash_type != 3"> 
						    	<!-- <el-input size="small" v-model="data.involved_money"></el-input> 元  -->
						    	<!-- <el-button type="text" size="mini" class="textBtn" @click="dialogVisible3=true" style="margin-left:10px;">选择重置记录</el-button> -->
						    	<span>{{data.involved_money}}</span>
						  	</el-form-item>
						  	<div class="payDate" v-if="data.involved_money && data.return_cash_type == 1">
						  		{{data.finance_info}}
						  	</div>

						  	<el-form-item label="返现金额："  style="display: block" prop="money">
						    	<!-- <el-input size="small" v-model="data.money"></el-input> 元 -->
						    	<span>{{data.money}}</span>
						  	</el-form-item>

						  	<el-form-item label="图片：" prop="bank_name" style="display: block width:100%">
						    	<span v-for="(val, index) in data.pic">
						    		{{val.name}}
						    		<a :href="val.url" :download="val.name" style="margin-left: 10px; margin-right: 10px">下载</a></span>						    	
						    	</span>
						  	</el-form-item>

						  	<el-form-item label="核算记录："  style="display: block">
						    	<!-- <el-input size="small" v-model="data.money"></el-input> 元 -->
						    	<div class="fanxian">
									<div class="fanxian_title">
										<span class="title1">核算记录</span>
										<span class="title2">{{data.time_slot}}</span>
									</div>
									<table  cellspacing="0" cellpadding="0" class="table1">
										<tr>

											<th v-if="data.accountRecord.cha_money">差价消耗额</th>
											<th v-if="data.accountRecord.cha_money">本需求单总投放量（pv）</th>

											<th v-if="!data.accountRecord.cha_money">本需求单总消耗金额</th>
											<th v-if="!data.accountRecord.cha_money">历史参与返现总金额</th>

											<th>已返现金额</th>
											<th>已返现次数</th>
										</tr>
										<tr>
											<td v-if="data.accountRecord.cha_money">{{data.accountRecord.cha_money}}</td>
											<td v-if="data.accountRecord.cha_money">{{data.accountRecord.all_pv}}</td>

											<td v-if="!data.accountRecord.cha_money">{{data.accountRecord.all_consume}}</td>
											<td v-if="!data.accountRecord.cha_money">{{data.accountRecord.cashback_involved_money}}</td>

											<td>{{data.accountRecord.cashback_money}}</td>
											<td>{{data.accountRecord.cashBackTimes}}</td>
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
											<table border="0" cellspacing="0" cellpadding="0" class="table2_2">
												<tr class="none_border" v-for="(val, index) in data.accountRecord.cash_Back_list">
													<td>{{val.create_time}}</td>
													<td>{{val.money}}</td>
												</tr>
											</table>
										</div>
									</div>
									<p>请选择用于改需求单的充值金额，如结果是返现金额大于消耗将提醒相关人员进行异常核验</p>
								</div>						  	
							</el-form-item>

						  	<!-- <div class="accounting">
						  		
						  	</div> -->
		                </div>
		            </div>
		        </div>
		        <div class="addFoot">
					<span class="cancel" @click="isAddShow">返回</span>
				</div>
			</el-form>
	    </div>


	</div>
</template>
<script>

	export default {
		
	    created() {
	    	if(!this.$route.params.id) {
	    		this.isAddShow()
	    	}
	    	this.$http.post('/finance/cashBackDetail', {cashBack_id: this.$route.params.id}).then(d => {
	    		this.data = d.body.data
	    	})
	    },
		data() {
			return {
		        data: '',
			}
		},
		methods: {
		    isAddShow() {
		    	this.$router.go(-1)
		    },
		}
	}
</script>

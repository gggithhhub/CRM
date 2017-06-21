<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" ref="data" label-width="135px" class="demo-ruleForm">
		        <span class="addTtile">退款申请</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
					  		<el-form-item label="客户名称：" style="display:block">
								<p><em>{{username}}</em></p>
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
								<span>{{data.pay_type | payType1}}</span>
						  	</el-form-item>

						  	<el-form-item label="开户行：" prop="bank_name" v-if="data.pay_type == 2">
						    	<span>{{data.bank_name}}</span>
						  	</el-form-item>
						  	<el-form-item label="收款人姓名：" prop="payee_name">
						    	<span>{{data.payee_name}}</span>
						  	</el-form-item>
						  	<el-form-item label="账户：" prop="account"  v-if="data.pay_type == 2">
						    	<span>{{data.account}}</span>
						  	</el-form-item>
						  	<el-form-item label="联系方式：" prop="payee_contact">
						    	<span>{{data.payee_contact}}</span>
						  	</el-form-item>
						  	<el-form-item label="账户名：" prop="account_name">
						    	<span>{{data.account_name}}</span>
						  	</el-form-item>
						  	
		                </div>
					
		            </div>

		            <div class="addDetail">
		                <span class="addDelTitle">退款信息</span>

		                <div class="addDelContent">
						  	<el-form-item label="可退金额："  style="display: block">
						    	<span style="margin-right: 10px;">{{ketuikuanjine}}</span> 

						  	</el-form-item>

						  	<div class="child" style="margin-bottom: 10px;width: 90%;margin-left: 50px;">
								<el-table :data="rechargeDetail" stripe style="width: 100%">

						    		<el-table-column prop="total_money" label="总充值金额" show-overflow-tooltip></el-table-column>
						    		<el-table-column prop="consume_money" label="总消耗"></el-table-column>

    								<el-table-column prop="cashback_money" label="参与返现"></el-table-column>
    								<el-table-column prop="frozen_money" label="冻结"></el-table-column>

    								<el-table-column prop="refund_money" label="可退金额"></el-table-column>

								</el-table>
							</div>

							<el-form-item label="退款金额："  style="display: block" prop="money">
								<span>{{data.money}}</span>
						  	</el-form-item>

							<el-form-item label="附件：" style="display: block" prop="nearby" style="width: 100%;">

								<span v-for="(val, index) in data.nearby" style="font-size: 14px;">{{val.name}} <a :href="val.nearbyAdds" :download="val.name" style="margin-left: 10px; margin-right: 10px">下载</a></span>

							</el-form-item>
								
						  	
						  	
		                </div>
		            </div>
		        </div>
		        <div class="addFoot">
					<span class="cancel" @click="isAddShow">取消</span>
				</div>
			</el-form>
	    </div>



	</div>
</template>
<script>

	export default {
	    created() {
	    	if(this.$route.params.id) {
	    		this.$http.post('/finance/Details', {id: this.$route.params.id}).then(d => {
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
	    			
	    		})

	    	} else {
	    		this.isAddShow()
	    	}
	    	
	    },
		data() {
			return {
				username: '请选择',

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
		        	nearby: [],
		        },

		        rechargeDetail: [],
		        ketuikuanjine: '',


			}
		},
		methods: {

		    
		    isAddShow() {
		    	this.$router.go(-1)
		    },
		    submitForm(formName) {
		    	

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

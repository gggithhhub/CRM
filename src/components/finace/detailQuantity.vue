<template>
	<div>
		<div class="addBox addcash">
			<el-form :model="data" ref="data" label-width="135px" class="demo-ruleForm">
				<span class="addTtile">返量申请</span>
				<div class="addContent">
					<div class="addDetail">
						<span class="addDelTitle">基本信息</span>

						 <div class="addDelContent">
					  		<el-form-item label="客户名称：">
								<p><em>{{data.username}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="需求单名称：">
								<p><em>{{data.demand_name}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责销售：">
								<p><em>{{data.sale_name}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责售后：">
								<p><em>{{data.after_sale_name}}</em></p>
					  		</el-form-item>

		                </div>
					</div>
					<div class="addDetail">
						<span class="addDelTitle">返量信息</span>

						<div class="addDelContent">
							<el-form-item label="返现原因：">
								<span>{{data.type | return_flow}}</span>

					  		</el-form-item>

					  		<el-form-item label="子订单："  style="display: block; width: 100%;">
						    	<div class="child">
						    		<el-table :data="data.list" stripe style="width: 100%">

							    		<el-table-column prop="put_city" label="投放地区" show-overflow-tooltip></el-table-column>
							    		<el-table-column prop="put_type" label="投放类型"></el-table-column>
	    								<el-table-column prop="actual_price" label="实际单价（元）"></el-table-column>
	    								<el-table-column prop="benchmark_price" label="基准单价（元）"></el-table-column>

  									</el-table>
						    	</div>
						  	</el-form-item>
							

							<el-form-item label="赠送流量：">
								<span>{{data.gift_cpm}}</span>

					  		</el-form-item>
							

							<el-form-item label="实际流量："  style="display: block; width: 100%;">
						    	<div class="child">
						    		<el-table :data="childData" stripe style="width: 100%">

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
					<span class="save" @click="returnStatus=true" v-if="data.status == 3">确认返量</span>
					<span class="cancel" @click="isAddShow">取消</span>
				</div>
			</el-form>
		</div>

		<el-dialog :close-on-click-modal="false" title="确认返量" v-model="returnStatus" size="tiny" @close="returnClose">

			<span>是否确认</span>
			
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="returnStatus=false">取消</el-button>
				<el-button type="primary" @click="returnTrue">确定</el-button>
			</span>
			
		</el-dialog>

	</div>
</template>
<script>


	export default {
	    created() {
	    	if(!this.$route.params.id) {
	    		this.isAddShow()
	    	}
	    	this.$http.post('/Finance/returnAmountDetail', {id: this.$route.params.id}).then(d => {
	    		this.data = d.body.data
	    		this.childData = d.body.data.list
	    		for(let i = 0; i < this.childData.length; i++) {
		    		let d = this.childData[i]
		    		this.childData[i].gift_cpm = (this.data.gift_cpm / this.childData.length).toFixed(2)
		    		this.childData[i].money = (this.childData[i].gift_cpm * this.childData[i].actual_price).toFixed(2)
		    		

		    	}

	    	})
	    	
	    },
		data() {
			return {
				
		        data: '',

				childData: [],

				returnStatus: false,
			}
		},
		methods: {
			
		   
		    isAddShow() {
		    	this.$router.go(-1)
		    },

		   returnTrue() {
				this.$http.post('/Finance/confirmData', {ra_id: this.$route.params.id}).then(d => {
					if(d.body.ret == 1) {
					 	this.openSuccess('已确认')
					 	this.$router.push('/finace/returnQuantity')
					} else {
						this.openDefeat(d.body.msg)
					}
				})
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
<style></style>
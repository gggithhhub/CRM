<template>
	<div>
		<div class="addBox addcash">
			<el-form  :rules="rules" ref="data" label-width="135px" class="demo-ruleForm">
		        <span class="addTtile">添加数据</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
					  		<el-form-item label="客户名称：">
								<p><em>{{username}}</em><a href="javascript:;" @click="choose" v-if="!isSure" style="margin-left: 10px">选择</a></p>
					  		</el-form-item>
					  		<el-form-item label="需求单名称：">
								<p><em>{{demand_name}}</em><a href="javascript:;" @click="choose2" v-if="!isSure" style="margin-left: 10px">选择</a></p>
					  		</el-form-item>
					  		<el-form-item label="负责销售：">
								<p><em>{{salename}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="负责售后：">
								<p><em>{{aftersalename}}</em></p>
					  		</el-form-item>
					  		<el-form-item label="返现起始日期：" style="display: block">
						    	<el-date-picker type="date" placeholder="打款时间" @change="getDate" v-model="data.date" :picker-options="pickerOptions0" :editable=false></el-date-picker>

						  	</el-form-item>
		                </div>
		            </div>

		            <div class="addDetail" v-for="(val, index) in orderList">
		                <span class="addDelTitle">订单</span>
				
		                <div class="addDelContent">


						  	<el-form-item label="展现量：" style="width:300px;" v-model="data.data[index].pv">
						    	<el-input size="small"></el-input>
						  	</el-form-item>
						  	<span class="czTitle">投放地区：{{val.put_province_name}}</span><span></span>
						  	<span class="czTitle">投放类型：{{val.put_type | put_type}}</span><span></span>

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
	import getDate from '../../js/common.js'
	function GetDateStr(AddDayCount) {   
    	var dd = new Date();  
    	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
    	var y = dd.getFullYear();   
    	var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
    	var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
    	return y+"-"+m+"-"+d;   
	}  

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

		        data: {
		        	date: GetDateStr(-1),
		        	data: [],
		        },

		        isSure: false,

		        salename: '',
		        aftersalename: '',
		        orderList: [],
				isRecord: false,

				pickerOptions0:  { //时间
		          	disabledDate(time) {
		           	 	if(new Date().format('yyyy-MM-dd').split('-')[2] == "01") {
         					return time.getTime() >= Date.now() - 8.64e7 || time.getTime() < getDate.getPreviousMonth()[0].getTime();
         				}
            			return time.getTime() >= Date.now() - 8.64e7|| time.getTime() < getDate.getCurrentMonth()[0].getTime();
		          	}
		        },

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
		    		this.$http.post('/base/demandList', { user_id: a.id, type: 10 }).then(d => {
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
		    	if(a.id) {
		    		this.demand_name = a.label
		    		this.dialogVisible2 = false
		    		this.$http.post('/base/orderDataByDemand', {demand_id: a.id, date: this.data.date}).then(d => {
		    			this.orderList = d.body.data.list
		    			this.salename = d.body.data.sale_name
		    			this.aftersalename = d.body.data.after_sale_name
		    			for(let i = 0; i < this.orderList.length; i++) {
		    				this.data.data[i] = {},
		    				this.data.data[i].pv = ''
		    				this.data.data[i].order_id = this.orderList[i].orderList
		    			}
		    		})
		    		
		    	}
		    },

		    getDate(d) {
				if(!d) {
					d = ''
				}
				this.data.date = d
			},

		    cancle() {
		    	this.dialogVisible3 = false
		    	this.chooseData = {}
		    },

		    isAddShow() {
		    	this.$router.go(-1)
		    },
		    submitForm(formName) {
		    	for(let i = 0; i < this.data.data; i++) {
		    		if(this.demand_name == '' || this.data.data[i].pv == '') {
		    			this.openDefeat('请填写pv')
		    			return
		    		}
		    	}
		    	this.$http.post('/business/editOrderDataList', this.data).then(d => {
		    		if(d.body.ret == 1) {
		    			this.$router.push('/business/indent')
		    			this.openSuccess('提交成功')
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
<style scoped>
	.addcash .el-input--small {
		width: 100px;
	}
</style>
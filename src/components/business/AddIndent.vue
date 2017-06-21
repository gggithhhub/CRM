<template>
	<div class="tianxieBox">
		<h3>填写订单</h3>
		<div class="tianxieCont tianxieBox1">
			<el-form :model="data" :rules="rules" ref="data" label-width="100px" class="demo-data">

				<div class="tianxieCont1">
					<span>基本信息</span>
					<p><i>*</i><span>客户名称：</span><em>{{username}}</em><a href="javascript:;" @click="choose" v-if="!isSure">选择</a></p>
					<p><i>*</i><span>需求单名称：</span><em>{{demand_name}}</em><a href="javascript:;" @click="choose2" v-if="!isSure">选择</a></p>
				</div>
				<div class="dingdan">
					<div class="dingdan1 active" v-for="(val, index) in oldIndent">
						<div id="btn">
							<!-- <a href="javascript:;" class="bianji">编辑</a> -->
							<a href="javascript:;" class="del" @click="delIndent(val.id, index)">删除</a>
						</div>
						<span>订单</span>
						<label>投放地区：<span>{{val.put_province}} - {{val.put_city}}</span></label>
						<label>投放类型：<span>{{val.put_type | put_type}}</span></label>
						<label>限量：<span style="padding-left: 20px;">{{val.day_limit}}M/天</span></label><br />
						<label>投放周期：<span>{{val.put_start_date}}-{{val.put_end_date}}</span></label>
						<label>投放时间：<span>{{val.put_start_time}}-{{val.put_end_time}}</span></label>
						<label>落地页：<span>{{val.land_page}}</span></label><br />
						<label>合同单价：<span>{{val.contract_price}}</span></label>
						<label>实际单价：<span>{{val.actual_price}}</span></label>
						<label>基准单价：<span>{{val.benchmark_price}}</span></label><br />
						<label style="display: block; width: 100%;">附件：<span v-for="(v, index) in val.enclosure_url">{{v.name}}</span></label>
						<label style="display: block; width: 100%;">备注：<span>{{val.remark}}</span></label>
					</div>

					<a href="javascript:;" @click="addNewInd">添加子订单</a>
					<a href="javascript:;" @click="copy" v-if="!isAdd && oldIndent.length != 0" style="margin-left: 105px">复制子订单</a>
					<div class="add_dingdan" v-if="isAdd">
						<span>订单</span>
							<el-form-item label="地区" prop="put_province">
					    		<el-select v-model="data.put_province" placeholder="省" size="small" @change="getCity">
								    <el-option  v-for="item in allprovince"  :label="item.name" :value="item.id"></el-option>
								</el-select>

								<el-select v-model="data.put_city" multiple placeholder="市" size="small">
								    <el-option  v-for="item in allcity" :label="item.name" :value="item.id"></el-option>
								</el-select>
					  		</el-form-item>

					  		<el-form-item label="投放类型" prop="put_type">
					    		<el-select v-model="data.put_type" placeholder="投放类型" size="small">
								    <el-option label="PC" value="0"></el-option>
								    <el-option label="无线" value="1"></el-option>
								</el-select>
					  		</el-form-item>

					  		<el-form-item label="限量" prop="day_limit">
					    		<el-input size="small" v-model="data.day_limit"></el-input> /天
					  		</el-form-item>

					  		<el-form-item label="落地页" prop="land_page">
					    		<el-input size="small" v-model="data.land_page"></el-input>
					  		</el-form-item>

					  		<el-form-item label="合同单价" prop="contract_price">
					    		<el-input size="small" v-model="data.contract_price" @change="hetong"></el-input> /元
					  		</el-form-item>

					  		<el-form-item label="基准单价" prop="benchmark_price">
					    		<el-input size="small" v-model="data.benchmark_price"></el-input> /元
					  		</el-form-item>

					  		<el-form-item label="实际单价" prop="actual_price">
					    		<el-input size="small" v-model="data.actual_price" @change="shiji"></el-input> /元
					  		</el-form-item>

					  		<el-form-item label="投放周期" prop="put_start_date">

						    	<el-date-picker v-model="data.put_start_date" type="date" placeholder="选择日期" :picker-options="pickerOptions0"  @change="getFirstDate" :editable=false :clearable=true size="small"></el-date-picker>

						    	<el-date-picker v-model="data.put_end_date" type="date" placeholder="选择日期" :picker-options="pickerOptions1"  @change="getLastDate" :editable=false :clearable=true size="small"></el-date-picker>

					  		</el-form-item>

					  		<el-form-item label="投放时间" prop="put_start_time">

						    	<el-time-select placeholder="起始时间" v-model="data.put_start_time" :picker-options="{ start: '00:00', step: '01:00', end: '24:00' }" :editable=false size="small"></el-time-select>
	  							<el-time-select placeholder="结束时间" v-model="data.put_end_time" :picker-options="{ start: '00:00', step: '01:00', end: '24:00', minTime: data.put_start_time }" :editable=false size="small"></el-time-select>

					  		</el-form-item>

					  		<el-form-item label="附件">
								<el-upload class="upload-demo" action="/base/uploadAttachment" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :on-success="fileSuccess">
								    <el-button size="small" type="primary">点击上传</el-button>
								</el-upload>
					  		</el-form-item>
							
							<el-form-item label="备注" style="display:block">
						    	<el-input type="textarea" v-model="data.remark" size="small"></el-input>
						  	</el-form-item>
							
							<div id="btn11">
								<a href="javascript:;" class="act" @click="submitForm('data')">保存</a>
								<a href="javascript:;" @click="isAdd = false">取消</a>
							</div>
					</div>
				</div>
				<div id="btn1">
					<a href="javascript:;" @click="isAddShow">返回</a>
				</div>
			</el-form>

		</div>

		<el-dialog :close-on-click-modal="false" v-model="dialogVisible" size="tiny">
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
	var max_money;
	var max = (rule, value, callback) => {
		// console.log(max_involved_money)
	    if (Number(max_money) < Number(value) && value) {
	        callback(new Error('实际单价不能大于合同单价'));
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
			this.$store.dispatch('indentDemandList', { p: 1 })
 			this.$http.post('/base/getProvince').then(d => {
 				this.allprovince = d.body.data
 			})

 			if(this.$route.params.id) {
 				this.data.demand_id = this.$route.params.id
 				this.username = this.$route.params.username
 				this.demand_name = this.$route.params.demand_name
 				this.isSure = true
 				this.jisuan(this.$route.params)
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
				isAdd: false,
				isSure: false,
				oldIndent: [],
				allprovince: [],
				allcity: [],
				indentId: [],

				pickerOptions0: {
			        disabledDate(time) {
			            return time.getTime() <= Date.now() - 8.64e7;
			        }
		        },
		        pickerOptions1: {
			        disabledDate(time) {
			            return time.getTime() <= Date.now() - 8.64e7;
			        }
		        },
		        fileList2: [],
				rules: {
					'put_province': [
						{ required: true, message: '请选择省', trigger: 'change' }
					],
					'put_type': [
						{ required: true, message: '请选择投放类型', trigger: 'change' }
					],
					'day_limit': [
						{ required: true, message: '请输入日限量', trigger: 'blur' }
					],
					'put_start_date': [
						{ required: true, message: '请选择投放周期', trigger: 'change' }
					],
					'put_start_time': [
						{ required: true, message: '请选择投放时间', trigger: 'change' }
					],
					'land_page': [
						{ required: true, message: '请输入落地页', trigger: 'blur' }
					],
					'contract_price': [
						{ required: true, message: '请输入合同单价', trigger: 'blur' }
					],
					'actual_price': [
						{ required: true, message: '请输入实际单价', trigger: 'blur' },
						{ validator: max, trigger: 'blur' }
					],
					'benchmark_price': [
						{ required: true, message: '请输入基准单价', trigger: 'blur' }
					],
				},
				data: {
					demand_id: '',
					put_province: '',
					put_city: [],
					put_type: '',
					day_limit: '',
					put_start_date: '',
					put_end_date: '',
					put_start_time: '00:00',
					put_end_time: '24:00',
					land_page: '',
					contract_price: '',
					actual_price: '',
					benchmark_price: '',
					enclosure_url: [],
					remark: '',
				},
				copyData: {},
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

		        //返现放量缓存值
		        returnNumber: 0, //返点
			}
		},
		computed: {
		},
		methods: {
			isAddShow() {
				this.$router.push('/business/indent')
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
		    	if(a.id) {
		    		this.username = a.label
		    		this.dialogVisible = false
		    		this.$http.post('/base/demandList', { user_id: a.id }).then(d => {
		    			this.data3 = []
		    			if(d.body.data) {
		    				for(let i = 0; i < d.body.data.length; i++) {
			    				this.data3[this.data3.length] = {}
			    				this.data3[this.data3.length - 1].label = d.body.data[i].demand_name
			    				this.data3[this.data3.length - 1].id = d.body.data[i].id
			    				this.data3[this.data3.length - 1].return_cash_type = d.body.data[i].return_cash_type
			    				this.data3[this.data3.length - 1].return_flow = d.body.data[i].return_flow
			    				this.data3[this.data3.length - 1].type = d.body.data[i].type
			    				this.data3[this.data3.length - 1].return_cash_num = d.body.data[i].return_cash_num
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
		    		/*
		    		1.充值返现 消耗百分比返现 实际单价=合同单价*（100%-返点）
				    2.差价返现 实际单价手填
				    3.返量和不参与 实际单价=合同单价
					returnNumber: 如果有值 就走1,2 没有走3
					*/
		    		this.jisuan(a)
		    	}
		    },
			addNewInd() {
				this.cancleAdd()
				this.isAdd = true
			},

			copy() {
				for(let key in this.copyData) {
					this.data[key] = this.copyData[key]
				}
				this.fileList2 = []
				
				this.data.enclosure_url.forEach((val, index) => {
					this.fileList2.push({ name: val.name, url: val.url })
				})
				this.data.put_province = ''
				this.data.put_city = []
				this.data.put_type = ''
				this.isAdd = true
			},

			getCity(i) {
				this.data.put_city = []
				this.$http.post('/base/getCity', {province_id: i}).then(d => {
					this.allcity = d.body.data
				}) 
			},
			//合同单价修改 世纪变化
			jisuan(a) {
				if(a.type == 1) {
	    			this.returnNumber = 0
	    		} else if (a.type == 2 || a.type == 3) {
	    			if(a.return_cash_type == 1 || a.return_cash_type == 2) {
	    				this.returnNumber = a.return_cash_num - 0
	    			} else if (a.return_cash_type == 3) {
	    				this.returnNumber = -1
	    			}
	    		} else if (a.type == 4) {
	    			this.returnNumber = 0
	    		}
			},
			hetong() {
				/*
		    		1.充值返现 消耗百分比返现 实际单价=合同单价*（100%-返点）
				    2.差价返现 实际单价手填
				    3.返量和不参与 实际单价=合同单价
					returnNumber: 如果有值 就走1,3 没有走2
				*/
				if(this.returnNumber >= 0) {
					this.data.actual_price = (this.data.contract_price * (1 - this.returnNumber / 100)).toFixed(2)
					max_money = this.data.contract_price
				}
			},
			shiji() {
				if(this.returnNumber >= 0) {
					this.data.contract_price = (this.data.actual_price / (1 - this.returnNumber / 100)).toFixed(2)
					max_money = this.data.contract_price
				}
			},


			getFirstDate(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.data.put_start_date = d
				this.pickerOptions1.disabledDate = function(time) {
					return time.getTime() < Date.parse(new Date(this.data.put_start_date)) - 8.64e7 ;
				}.bind(this)
			},
			getLastDate(d) {
				if(!d) {
					d = ''
				}
				// this.quickly = ''
				this.data.put_end_date = d
				this.pickerOptions0.disabledDate = function(time) {
					return time.getTime() > Date.parse(new Date(this.data.put_end_date));
				}.bind(this)
			},
			//上传图片
			fileSuccess(response, file, fileList) {
				if(response.ret == 1) {

					this.$notify({
			    		title: '成功',
			    		message: '文件上传成功',
			    		type: 'success'
			    	})
			    	this.data.enclosure_url.push({name: file.name, url: response.data})
				} else {
					this.$notify.error({
			    		title: '失败',
			    		message: '文件上传失败',
			    	})
				}
			},
			handleRemove(file, fileList) {
				for(let i = 0; i < this.data.enclosure_url.length; i++) {
					if(file.name == this.data.enclosure_url[i].name) {
						this.data.enclosure_url.splice(i, 1)
					}
				}
			},
			cancleAdd() {
				// this.isAdd = false
				if(this.data.day_limit) {
					for(let key in this.data) {
						this.copyData[key] = this.data[key]
					}
					this.fileList2 = []
					this.data = {
						demand_id: this.data.demand_id,
						put_province: '',
						put_city: [],
						put_type: '',
						day_limit: '',
						put_start_date: '',
						put_end_date: '',
						put_start_time: '00:00',
						put_end_time: '24:00',
						land_page: '',
						contract_price: '',
						actual_price: '',
						benchmark_price: '',
						enclosure_url: [],
					}
				}
			},
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	if(!this.data.demand_id) {
		            		this.$notify({
					    		title: '失败',
					    		message: '请选择需求单名称',
					    		type: 'error'
					    	})
					    	return
		            	}
		            	if(!this.data.put_end_date) {
		            		this.$notify({
					    		title: '失败',
					    		message: '请选择结束日期',
					    		type: 'error'
					    	})
					    	return
		            	}

		            	if(!this.data.put_end_time) {
		            		this.$notify({
					    		title: '失败',
					    		message: '请选择结束时间',
					    		type: 'error'
					    	})
					    	return
		            	}

		            	if(this.data.enclosure_url.length == 0) {
		            		this.$notify({
					    		title: '失败',
					    		message: '请上传文件',
					    		type: 'error'
					    	})
					    	return
		            	}
		            	this.$http.post('/business/orderAdd', this.data).then(d => {
		            		if(d.body.ret == 1) {
		            			this.$notify({
						    		title: '成功',
						    		message: '保存成功',
						    		type: 'success'
						    	})
						    	// this.cancleAdd()
						    	this.isAdd = false
								this.isSure = true
								this.indentId.push(d.body.data)
								this.$http.post('/base/orderListByIds', {order_id: this.indentId}).then(d => {
									this.oldIndent = d.body.data.list
								})
		            		} else {
		            			this.$notify({
						    		title: '失败 ',
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

		    delIndent(id, index) {
		    	this.$http.post('/business/delOrder', {order_id: id}).then(d => {
		    		if(d.body.ret == 1) {
		    			this.indentId.splice(index, 1)
		    			this.oldIndent.splice(index, 1)
		    			this.$notify({
				    		title: '成功',
				    		message: '删除成功',
				    		type: 'success'
				    	})
		    		} else {
		    			this.$notify({
				    		title: '失败',
				    		message: d.body.msg,
				    		type: 'error'
				    	})
		    		}
		    	})
		    },
		},
	}
</script>

<style scoped>
	.tianxieCont .el-input {
		width: 220px;
	}
	.tianxieCont .el-textarea {
		width: 222px;
	}
	.tianxieCont .el-select {
		width: 96px;
	}
	.tianxieCont .el-form-item {
		width: 440px;
		display: inline-block;
		vertical-align: top;
	}
	.tianxieCont .el-date-editor.el-input {
		width: 108px;
	}
</style>
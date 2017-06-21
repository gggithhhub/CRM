<template>
	<div id="aaa">

		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
				 	<el-option label="负责销售" :value="allVal"></el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>

				<el-select placeholder="支付方式"  v-model="searchData.pay_type">
				    
				    <el-option label="支付方式" :value="allVal"></el-option>
				    <el-option label="支付宝" value="1"></el-option>
				    <el-option label="银行转账" value="2"></el-option>
				    <el-option label="其他" value="3"></el-option>
				</el-select>

				<el-date-picker v-model="searchData.start_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions1" @change="getStartMonth" style="width:125px"></el-date-picker>

				<el-date-picker v-model="searchData.end_date" type="month" placeholder="选择月" :editable=false :picker-options="pickerOptions2" @change="getEndMonth" style="width:125px"></el-date-picker>

				
				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<el-button type="primary" size="small" icon="plus" @click="rechargeOpen('')" v-if="jurisdiction.rechargeadd == 1">充值申请</el-button>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">创建时间</div></el-col>
				<el-col :span="1"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="2"><div class="grid-content">支付方式</div></el-col>
				<el-col :span="2"><div class="grid-content">开户行</div></el-col>
				<el-col :span="3"><div class="grid-content">账户</div></el-col>
				<el-col :span="2"><div class="grid-content">账户名</div></el-col>
				<el-col :span="2"><div class="grid-content">截图</div></el-col>
				<el-col :span="2"><div class="grid-content">打款日期</div></el-col>
				<el-col :span="2"><div class="grid-content">打款金额</div></el-col>
				<el-col :span="2"><div class="grid-content">详情</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in auditLists.list">
				<el-col :span="2"><div class="grid-content">{{val.create_time | time}}</div></el-col>
				<el-col :span="1"><div class="grid-content">
					<el-tooltip class="item" effect="dark" placement="bottom-start" offset="">
						<p slot="content" class="newContent">{{val.username}}</p>
						<span  style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; display: inline-block;width: 100%; height: 28px;">{{val.username}}</span>
					</el-tooltip>
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.pay_type | payType}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.bank_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.account}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.account_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">
					<img :src="val.pic" @click="isShow(val.pic)" width="39" height="39" style="margin: 0 auto;vertical-align: middle">
				</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.pay_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.money}}</div></el-col>

				<el-col :span="2" ><div class="grid-content specailLine">

					<el-tooltip class="item" effect="dark" placement="bottom">
						 <p slot="content" class="newContent">{{val.pay_details}}</p>
						<span class="bjText">{{val.pay_details}}</span>
					</el-tooltip>
					
				</div></el-col>

				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2" v-if="val.status == 0">
					<div class="grid-content" v-if="jurisdiction.checkstatus == 1 && val.status == 0">
						<el-button type="text" @click="checkStatus(val.id)" size="small">确认打款</el-button>
					</div>
					<div class="grid-content" v-if="jurisdiction.checkstatus != 1 && val.status == 0">
						<el-button type="text" :disabled="true" size="small">待审核</el-button>
					</div>
				</el-col>

				<el-col :span="2" v-if="val.status == 1">
					<div class="grid-content" v-if="jurisdiction.checkstatus == 1">
						<el-button type="text" @click="updata(val.id)" size="small">上传截图</el-button>
					</div>
				</el-col>

				<el-col :span="2" v-if="val.status == 2 && jurisdiction.rechargeupdate == 1">
					<div class="grid-content">
						<el-button type="text" @click="rechargeOpen(val.id, val.username)" size="small">重新提交</el-button>
					</div>
				</el-col>

			</el-row>
		</div>
		<div class="footer">
		<!-- @current-change="getList"  -->
			<el-pagination small layout="prev, pager, next" :total="auditLists.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span><em>￥{{auditLists.total}}</em></span>
		</div>

		<el-dialog :close-on-click-modal="false" title="提示" v-model="dialogVisible" size="tiny" @close="closeSh">
			<span>确认审核通过成为已成交客户！</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shFalse">不通过</el-button>
				<el-button type="primary" @click="shTrue">通过</el-button>
			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="imgShow" size="large" top="1%">
			<div style="height: 100%;width:100%">
				<img :src="imgSrc" alt=""  style="height: 100%;width:100%">
			</div>
		</el-dialog>
		
		<el-dialog :close-on-click-modal="false" title="充值" v-model="rechargeStatuse" size="small" @close="clearRecharge" @open="openHtpp" top="2%" class="pop signed">
			<el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
			    	<!-- <el-input size="small" v-model="isSigned.name" auto-complete="off" readonly='true'></el-input size="small"> -->
		    	<el-form-item label="客户名称：" prop="user_id">
		    		<span>{{username}}</span>
		    		<el-button type="text" size="mini" @click="choose" style="margin-left: 10px;" v-if="!form.id">选择</el-button>
		  		</el-form-item>
			    <el-form-item label="支付方式:" :label-width="formLabelWidth"  prop="pay_type">
					<el-select v-model="form.pay_type" placeholder="请选择支付方式" @change="ifBank">
						<el-option label="支付宝" value="1"></el-option>
						<el-option label="银行" value="2"></el-option>
						<el-option label="其他" value="3"></el-option>
					</el-select>
			    </el-form-item>
			    <el-form-item label="开户行:" :label-width="formLabelWidth" prop="bank_name" v-if="form.pay_type == 2">
			    	<el-input size="small" v-model="form.bank_name" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="账户:" :label-width="formLabelWidth" prop="account" v-if="form.pay_type == 2">
			    	<el-input size="small" v-model="form.account" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="账户名:" :label-width="formLabelWidth" prop="account_name">
			    	<el-input size="small" v-model="form.account_name" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="打款金额:" :label-width="formLabelWidth" prop="money">
			    	<el-input size="small" v-model="form.money" auto-complete="off"></el-input>
			    </el-form-item>

			    <el-form-item label="打款时间:" :label-width="formLabelWidth" prop="pay_time">
			    	<el-date-picker type="date" placeholder="打款时间" @change="getDate" v-model="form.pay_time" :picker-options="pickerOptions0" :editable=false></el-date-picker>
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
				<el-button @click="clearRecharge">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="searchUser" size="tiny">
	        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

			<el-tree class="filter-tree" :data="data2" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2" @node-click="clickName"></el-tree>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="searchUser = false">取 消</el-button>
	            <el-button type="primary" @click="searchUser = false">确 定</el-button>
        	</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="picUp" size="tiny" @close="closeSh" class="pop signed">
			<span>上传图片：</span>
	    	<div class="imgBox" style="line-height: 178px;display: inline-block;vertical-align: top;">
		    	<el-upload class="avatar-uploader" action="/base/uploadImg" :show-file-list="false" :on-success="shSuccess" :accept="img" :multiple=false :name="pic" :on-error="fileErro">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="closeSh">取 消</el-button>
	            <el-button type="primary" @click="upPic">确 定</el-button>
        	</span>
		</el-dialog>
		

	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import search from './search.vue'
	import getDate from '../../js/common.js'
	var number = (rule, value, callback) => {
		var e = /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
        if (!e.test(value) && value) {
          	callback(new Error('请输入正确的金额'));
        } else {
          	callback();
        }
    };
	export default {
		created() {
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchAuditList',{p:1})
			} ,200)

			this.$http.post('/base/getDealUser').then(d => {
				var d = d.body.data
				this.data2 = []
				for(let i in d) {
					this.data2[this.data2.length] = {}
					this.data2[this.data2.length - 1].label = d[i].username
					this.data2[this.data2.length - 1].id = d[i].id
				}
			})
		},
		watch: {
	        filterText(val) {
	        	this.$refs.tree2.filter(val);
	        },
	        searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchAuditList', this.searchData)
				} else {
					this.searchData = {
						id: '',
						status: '',
						p: 1,
						username: this.searchUsername
					},
					this.$store.dispatch('searchAuditList', this.searchData)
				}
			}
	    },
		data() {
			return {
				dialogVisible: false,
				shData: {
					id: '',
					status: '',
					
				},

				pickerOptions1: {
					disabledDate(time) {
						return false;
					}
				},
				pickerOptions2: {
					disabledDate(time) {
						return time.getTime() < Date.parse(new Date());
					}
				},


				imgShow: false,
				imgSrc: '',

				//申请
				rechargeStatuse: false,
				//搜索

				picUp: false,

				username: '请选择',
				searchUser: false,
				filterText: '',
		        data2: [],
		        defaultProps: {
		            children: 'children',
		            label: 'label'
		        },

				img: '.jpg, .jpeg, .png',//只允许上传的格式
				pic: 'pic', //图片上传的字段名
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
					id: '',
				},	
				imageUrl: '',
				rules: {
					user_id: [
						{ required: true, message: '请选择用户名', trigger: 'change' }
					],
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




		        allVal: '',
			}
		},
		components: {
			search
		},
 		computed: {
			auditLists() {
				return this.$store.getters.auditLists
			},
			all_sales() {
				if(Cookie.get('data').position_id == 6) {
					return Cookie.get('data').allSales
				}
				return Cookie.get('data').childSales
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.finance
			},
			searchData() {
				return this.$store.getters.all_state.auditSearchData
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			}
		},
		methods: {

			//月份
			getStartMonth(d) {
				if(!d) {
					d = ''
					this.searchData.start_date = ''
				} else {
					this.searchData.start_date = d + '-01' + ' 00:00:00'
				}
				// this.quickly = ''
				this.pickerOptions2.disabledDate = function(time) {
					return time.getTime() <= Date.parse(new Date(this.searchData.start_date));
				}.bind(this)
			},
			getEndMonth(d) {
				if(!d) {
					d = ''
					this.searchData.end_date = ''
				} else {
					var day = getDate.getMonthDays(d.split('-')[0], Number(d.split('-')[1]) - 1)
					this.searchData.end_date = d + '-' + day + ' 23:59:59'
				}
				// this.quickly = ''
				
				this.pickerOptions1.disabledDate = function(time) {
					return time.getTime() >= Date.parse(new Date(this.searchData.end_date));
				}.bind(this)
			},

			
			getList(currentPage) {
				this.$store.dispatch('searchAuditList',{p: currentPage})
			},

			checkStatus(id) {
				this.shData.id = id
				this.dialogVisible = true
			},
			//审核
			shTrue() {
				this.shData.status = 1
				
				this.$http.post('finance/checkStatus', this.shData).then(d => {
					let data = d.body
					if(data.ret == 1) {
						this.$notify({
				    		title: '成功',
				    		message: '已通过',
				    		type: 'success'
				    	})
				    	this.$store.dispatch('searchAuditList')
						this.closeSh()

				    } else {
				    	this.$notify({
				    		title: '失败',
				    		message: d.body.msg,
				    		type: 'error'
				    	})
				    }
				}) 
			},
			shFalse() {
				this.shData.status = 2
				let that = this
				this.$http.post('finance/checkStatus', this.shData).then(d => {
					let data = d.body
					if(data.ret == 1) {
						this.$notify({
				    		title: '警告',
				    		message: '未通过',
				    		type: 'warning'
				    	})
				    	this.$store.dispatch('searchAuditList', this.searchData)
						this.closeSh()

					}
				}) 
			},
			closeSh() {
				this.dialogVisible = false
				this.picUp = false
				this.shData = {}
			},




			shSuccess(response,file,fileList) {
				if(response.ret == 1) {
	    			this.openSuccess('图片上传成功')
	    			this.imageUrl = response.data;
	    			this.shData.pic = response.data
	    		} else {
	    			this.openDefeat('图片上传失败')
	    			this.shData.pic = ""
	    			this.imageUrl = ""
	    		}
			},
			updata(id) {
				this.picUp = true
				this.shData.id = id
			},
			upPic() {
				if(!this.shData.pic) {
					this.openDefeat('请上传图片')
				}
				this.$http.post('finance/uploadPic', this.shData).then(d => {
					let data = d.body
					if(data.ret == 1) {
						this.openSuccess("上传成功")
				    	this.$store.dispatch('searchAuditList')
						this.closeSh()

				    } else {
				    	this.openSuccess(data.msg)
				    }
				}) 
			},



			isShow(src) {
				this.imgSrc = src
				this.imgShow = true
			},

			searchAlllist() {
				this.$store.dispatch('searchAuditList', this.searchData)
			},

			//充值
			rechargeOpen(id, username) {
				if(id != '') {
					this.$http.post('Base/getFinanceInfo', {id: id}).then(d => {
						for(let k in d.body.data) {
							for(let key in this.form) {
								if(key == k) {
									this.form[k] = d.body.data[k] 
								}
							}
						}
						this.imageUrl = d.body.data.pic
					})
					this.username = username

				}
				this.rechargeStatuse = true
			},

			//提交
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	// if(this.form.pic) {
		            		
		            	// }
	            		let url = '';
	            		if(!this.form.id) {
	            			url = 'rechargeAdd'
	            		} else {
	            			url = 'rechargeUpdate'
	            		}
	            		this.$http.post('Finance/' + url, this.form).then(data => {

	            			if(data.data.ret == 1) {
	            				this.openSuccess('上传成功')
	            				//关闭弹窗
	            				this.clearRecharge()
	            				
	            				//重新获取列表数据
	            				this.$store.dispatch('searchAuditList', this.searchData)
	            			} else {
	            				this.openDefeat("错误")
						    	//关闭弹窗
						    	this.clearRecharge()
	            			}
				        });
		          	} else {
		          		// alert(1)
		            	return false;
		          	}
		        });
			},
			clearRecharge() {
				this.rechargeStatuse = false
				for(let k in this.form) {
					this.form[k] = ''
				}
				this.imageUrl = ""
				this.username = '请选择'
			},

			choose() {
				this.searchUser = true
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName(a, b, c) {
		    	if(a.id) {
		    		this.username = a.label
		    		this.form.user_id = a.id
		    		this.searchUser = false
		    	}
		    },
		    getDate(d) {
	    		this.form.pay_time = d
	    	},

	    	testData(response,file,fileList) {
	    		if(response.ret == 1) {
	    			this.openSuccess('图片上传成功')
	    			this.imageUrl = response.data;
	    			this.form.pic = response.data
	    		} else {
	    			this.openDefeat('图片上传失败')
	    			this.form.pic = ""
	    			this.imageUrl = ""
	    		}
	    	},
	    	fileErro() {//上传失败的钩子
				this.openDefeat('图片上传失败')
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
			},

		}
	}
</script>
<style scoped>
	.bigImg {
		position: absolute;
		width: 200px;
		height: 200px;
		top: -41px;
		left: 80px;
		z-index: 11;
	}
	.newContent {
	    width: 166px;
	    word-wrap: break-word;
	    word-break: normal;
	}
	.signed img {
		/*width: 300px;*/
		width: 178px;
		height: 178px;
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
	.pop .el-form-item__content {
		width: 71%;
	}
	.pop .el-select {
		width: 100%;
	}
	.pop .el-date-editor {
		width: 100%;
	}
	.pop .el-form-item{
	    width: 91%;
	}
</style>
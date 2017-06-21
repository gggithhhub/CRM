<template>
	<div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	  		<div class="addBox">
		        <span class="addTtile">编辑</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
		                	<el-form-item label="客户名称：" prop="user_info.username">
					    		<span>{{username}}</span>
					  		</el-form-item>
					  		<el-form-item label="客户状态：" prop="user_info.username" v-if="isDeal">
					    		<span>{{type_name}}</span>
					  		</el-form-item>
					  		<el-form-item label="客户余额：" prop="user_info.username" v-if="isDeal">
					    		<span>{{balance}}</span>
					  		</el-form-item>
					  		<el-form-item label="累计消耗：" prop="user_info.username" v-if="isDeal">
					    		<span>{{consume}}</span>
					  		</el-form-item>
					  		<el-form-item label="行业：" prop="user_info.industry_id">
							    <el-select size="small" v-model="ruleForm.user_info.industry_id" placeholder="请选择行业">
								    </el-option>
								    <el-option v-for="item in all_industry" :label="item.name" :value="item.id">
								    </el-option>
							    </el-select>
							</el-form-item>
							</el-form-item>
					  		<el-form-item label="网址：" prop="user_info.url">
						    	<el-input size="small" v-model="ruleForm.user_info.url"></el-input>
						  	</el-form-item>
						  	<el-form-item label="地区：" prop="area">
						    	<el-input size="small" v-model="ruleForm.user_info.area"></el-input>
						  	</el-form-item>
						  	<el-form-item label="类型：" prop="type" style="vertical-align: top;">
							    <el-select size="small" v-model="ruleForm.user_info.type" label="民营企业" placeholder="请选择类型">
							    	<el-option label="暂无" value="0"></el-option>
							    	<el-option label="民营企业" value="1"></el-option>
							    	<el-option label="国有企业" value="2"></el-option>
							    	<el-option label="股份企业" value="3"></el-option>
							    	<el-option label="外资企业" value="4"></el-option>
							    	<el-option label="合资企业" value="5"></el-option>
							    	<el-option label="个人个体" value="6"></el-option>
							    	<el-option label="其他" value="7"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="负责销售：">
								<span>{{sale_name}}</span>
							</el-form-item>
							<el-form-item label="负责售后：" prop="after_sale_id" style='vertical-align: top;'>
							    <span>{{alter_sale_name}}</span>
							</el-form-item>
							<el-form-item label="推荐人：">
								<span>{{referee}}</span>
							</el-form-item>
							<el-form-item label="备注：">
						    	<span  v-if="isDeal">{{remark}}</span>
						    	<el-input type="textarea" v-model="ruleForm.user_info.remark" v-else></el-input>
						  	</el-form-item>
						  	<el-form-item label="详情：" v-if="isDeal">
						    	<el-input type="textarea" v-model="ruleForm.user_info.detail"></el-input>
						  	</el-form-item>
		                </div>
		            </div>

		            <div class="addDetail" v-for="(val, index) in ruleForm.contact_info">
		                <span class="addDelTitle">联系信息</span>
				
		                <div class="addDelContent">
		                	<el-form :model="val" :rules="rules" :ref="val" label-width="100px" class="demo-ruleForm">
			                	<el-form-item label="联系人：" prop="contact" style="display: block">
							    	<el-input size="small" v-model="val.contact"></el-input>
							  	</el-form-item>
							  	<el-form-item label="QQ/微信：">
							    	<el-input size="small" v-model="val.qq"></el-input>
							  	</el-form-item>
							  	<el-form-item label="电话：">
							    	<el-input size="small" v-model="val.mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="其他电话：">
							    	<el-input size="small" v-model="val.other_mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="邮箱：">
							    	<el-input size="small" v-model="val.email"></el-input>
							  	</el-form-item>
							</el-form>
		                </div>
					
		            </div>

		            <div class="addDetail unSave" v-for="(val, index) in unSave">
		                <span class="addDelTitle">联系信息</span>

		                <div class="addDelContent">
		                
		                	<el-form-item label="联系人：" style="display: block">
						    	<el-input size="small" v-model="val.contact"></el-input>
						  	</el-form-item>
						  	<el-form-item label="QQ/微信：">
						    	<el-input size="small" v-model="val.qq"></el-input>
						  	</el-form-item>
						  	<el-form-item label="电话：">
						    	<el-input size="small" v-model="val.mobile"></el-input>
						  	</el-form-item>
						  	<el-form-item label="其他电话：">
						    	<el-input size="small" v-model="val.other_mobile"></el-input>
						  	</el-form-item>
						  	<el-form-item label="邮箱：">
						    	<el-input size="small" v-model="val.email"></el-input>
						  	</el-form-item>
						  	<div class="addFoot">
								<span class="save" @click="savaUnsave">保存</span>
								<span class="cancel" @click="cancelUnsave">取消</span>
							</div>
		                </div>
		            </div>
		            <div class="addDetail" style="border: none">
		            	<div class="addContact" @click="addContact">
		            		添加联系信息
		            	</div>
					
		            </div>
		        </div>
		        <div class="addFoot">
					<span class="save" @click="submitForm('ruleForm', 'ruleForm.contact_info')">保存</span>
					<span class="cancel" @click="isAddShow">取消</span>
				</div>
		    </div>
		</el-form>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	var mobile = (rule, value, callback) => {
		var e = /^1[34578]\d{9}$/
        if (!e.test(value) && value) {
            callback(new Error('请输入正确的电话'));
        } else {
            callback();
        }
    };
    var website = (rule, value, callback) => {
		var e = /^1[34578]\d{9}$/
        if (!IsURL(value) && value) {
          callback(new Error('请输入正确的网址'));
        } else {
          callback();
        }
    };
    function IsURL(str_url){
		 var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
			  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
			  + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
			  + "|" // 允许IP和DOMAIN（域名）
			  + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
			  + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
			  + "[a-z]{2,6})" // first level domain- .com or .museum 
			  + "(:[0-9]{1,4})?" // 端口- :80 
			  + "((/?)|" // a slash isn't required if there is no file name 
			  + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
		var re=new RegExp(strRegex); 
		//re.test()
		if (re.test(str_url)){
			return (true); 
		}else{ 
			return (false); 
		}
	}
	export default {
		created() {
			if(!this.$route.params.id) {
				this.$router.go(-1)
				return
			}
			//	详情 联系人
			if(this.$route.params.type == 'deal') {
				this.$http.post('/customer/getDealDetails', {id: this.$route.params.id}).then(data => {
					let d = data.body.data.list[0]
					for(let k in this.ruleForm.user_info) {
						
						for(let key in d){
							if(key == k) {
								this.ruleForm.user_info[k] = d[key]
								continue
							}
						}
					}
					this.ruleForm.user_info.user_id = this.$route.params.id
					this.industry_name = d.industry_name
					this.sale_name = d.sale_name
					this.type_name = d.type_name
					this.alter_sale_name = d.alter_sale_name
					this.username = d.username
					this.referee = d.referee
					this.balance = d.balance
					this.consume = d.consume
				})
			} else {
				this.$http.post('/customer/getDetails', {id: this.$route.params.id}).then(data => {
					let d = data.body.data.list[0]
					for(let k in this.ruleForm.user_info) {
						
						for(let key in d){
							if(key == k) {
								this.ruleForm.user_info[k] = d[key]
								continue
							}
						}
					}
					this.ruleForm.user_info.user_id = this.$route.params.id
					this.industry_name = d.industry_name
					this.sale_name = d.sale_name
					this.type_name = d.type_name
					this.alter_sale_name = d.alter_sale_name
					this.username = d.username
					this.referee = d.referee
					this.balance = d.balance
					this.consume = d.consume
				})
			}
				
			
			this.$http.post('/base/getContact', {user_id : this.$route.params.id}).then(data => {
				this.ruleForm.contact_info = data.body.data
			})
		},
		data() {
		    return {
		        ruleForm: {
		        	user_info: {
		        		user_id: '',
						url: '',
						area: '', 
						type: '',
						remark: '',
						detail: '',
						industry_id: '',
		        	},
					contact_info:[{
						contact: '',
						qq: '',
						mobile: '',
						email: '',
						other_mobile: ''
					}]
		        },
		        industry_name: '',
				sale_name: '',
				alter_sale_name: '',
				username: '',
				referee: '',
				type_name: '',
				balance: '',
				consume: '',
		        rules: {
		            'user_info.url': [
		              { validator: website, trigger: 'change' }
		            ],
		            'contact': [
		              { required: true, message: '输入联系人', trigger: 'change' }
		            ]
		        },

		        //未保存的新增联系人
		        unSave: [],
		    };
	    },
	    computed: {
	    	isDeal() {
	    		if(this.$route.params.type == 'deal') {
	    			return true
	    		}
	    		return false
	    	},
	    	api() {
	    		if(this.$route.params.type == 'deal') {
	    			return 'editDealUser'
	    		} else {
	    			return 'editUser'
	    		}
	    	},
	    	all_industry() {
	    		return Cookie.get('data').industry
	    	}
	    },
	    methods: {
		    submitForm(formName, formName2) {
		        this.$refs[formName].validate((valid) => {
		            if (valid) {

		            	for(let i = 0; i < this.ruleForm.contact_info.length; i++) {
			          		let d = this.ruleForm.contact_info[i]
			          		if(!d.contact) {
			          			this.open3('请填写联系人')
			          			return false
			          		}
			          		if(!d.mobile && !d.email && !d.qq && !d.other_mobile) {
				            	this.open2()
				            	return false
				            }

			          	}

			            this.$http.post('/customer/' + this.api, this.ruleForm).then(function(data){
			            	if(data.data.ret == 0) {
			            		this.open3(data.data.msg)
			            		return false
			            	}
			            	this.open4()
			            	this.isAddShow()
			            	// this.$store.dispatch('getAlllist',{p:1})
			            })
			        } else {
			            return false;
			        }
		        });

		    },
		    //错误提示信息
		    open2() {
		    	this.$notify.error({
		    		title: '错误',
		    		message: '请填写电话、邮箱、QQ/微信中至少一条'
		    	})
		    }, 
		    open1() {
		    	this.$notify.error({
		    		title: '错误',
		    		message: '请选择负责销售或负责售后至少一条'
		    	})
		    },
		    open3(msg) {
		    	this.$notify.error({
		    		title: '错误',
		    		message: msg
		    	})
		    },
		    open4(msg) {
		    	this.$notify({
		    		title: '成功',
		    		message: '添加成功',
		    		type: 'success'
		    	})
		    },
		    isAddShow() {
		    	this.ruleForm = {
		        	user_info: {
		        		user_id: '',
						url: '',
						area: '', 
						type: '',
						remark: '',
		        	},
					contact_info:[{
						contact: '',
						qq: '',
						mobile: '',
						email: '',
						other_mobile: ''
					}]
		        },
	        	this.unSave = []
		    	this.$router.go(-1)
			},
			// querySearch(queryString, cb) {
		 //        var restaurants = this.restaurants;
		 //        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		 //        // 调用 callback 返回建议列表的数据
		 //        cb(results);
		 //    },
		 //    changeOut() {//转换内部外部
		 //    	this.isOut = !this.isOut
		 //    	this.ruleForm.referee = ''
		 //    },
		 //    createFilter(queryString) {
		 //        return (restaurant) => {
		 //        	return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
		 //        };
		 //    },

		 	//新增联系人
		 	addContact() {
		 		if(this.unSave.length < 1) {
		 			this.unSave.push({
						contact: '',
						qq: '',
						mobile: '',
						email: '',
						other_mobile: ''
					})
		 		}
		 	},
		 	//删除新增联系人
		 	cancelUnsave() {
		 		this.unSave = []
		 	},
		 	//保存新增联系人
		 	savaUnsave() {
		 		this.ruleForm.contact_info.push({
		 			contact: this.unSave[0].contact,
					qq: this.unSave[0].qq,
					mobile: this.unSave[0].mobile,
					email: this.unSave[0].email,
					other_mobile: this.unSave[0].other_mobile
		 		})
		 		this.unSave = []
		 	}
	    }
	}
</script>
<style scoped>
	.el-input {
		width: 199px;
	}
	.el-textarea {
		width: 199px;
	}
	.el-autocomplete {
		width: 200px;
	}
</style>
<template>
	<!-- Form 组件提供了表单验证的功能，只需要通过 rule 属性传入约定的验证规则，并 Form-Item 的 prop 属相设置为需校验的字段名即可。校验规则参见 async-validator -->
	<div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	  		<div class="addBox">
		        <span class="addTtile">添加客户</span>
		        <div class="addContent">
		            <div class="addDetail">
		                <span class="addDelTitle">基本信息</span>
		                <div class="addDelContent">
		                	<el-form-item label="客户名称：" prop="user_info.username">
					    		<el-input size="small" v-model="ruleForm.user_info.username"></el-input>
					  		</el-form-item>
					  		<el-form-item label="行业：" prop="user_info.industry_id">
							    <el-select size="small" v-model="ruleForm.user_info.industry_id" placeholder="请选择行业">
								    </el-option>
								    <el-option v-for="item in all_industry" :label="item.name" :value="item.id">
								    </el-option>
							    </el-select>
							</el-form-item>
					  		<el-form-item label="网址：" prop="user_info.url">
						    	<el-input size="small" v-model="ruleForm.user_info.url"></el-input>
						  	</el-form-item>
						  	<el-form-item label="地区：" prop="area">
						    	<el-input size="small" v-model="ruleForm.user_info.area"></el-input>
						  	</el-form-item>
						  	<el-form-item label="类型：" prop="type">
							    <el-select size="small" v-model="ruleForm.user_info.type" label="民营企业" placeholder="请选择类型">
							    	<el-option label="民营企业" value="1"></el-option>
							    	<el-option label="国有企业" value="2"></el-option>
							    	<el-option label="股份企业" value="3"></el-option>
							    	<el-option label="外资企业" value="4"></el-option>
							    	<el-option label="合资企业" value="5"></el-option>
							    	<el-option label="个人个体" value="6"></el-option>
							    	<el-option label="其他" value="7"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="负责销售：" prop="sale_id">
							    <el-select size="small" v-model="ruleForm.user_info.sale_id" placeholder="请选择销售" :disabled="sales">
								    </el-option>
								    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
								    </el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="负责售后：" prop="after_sale_id">
							    <el-select size="small" v-model="ruleForm.user_info.after_sale_id" placeholder="请选择售后" :disabled="after_sale_id">
								    </el-option>
								    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
								    </el-option>
							    </el-select>
							</el-form-item>
							<el-form-item label="推荐人：">
							    <el-input size="small" v-model="ruleForm.user_info.referee" placeholder="请输入推荐人"></el-input>
							</el-form-item>
							<el-form-item label="备注：">
						    	<el-input type="textarea" v-model="ruleForm.user_info.remark"></el-input>
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
							  	<el-form-item label="QQ/微信：" prop="qq">
							    	<el-input size="small" v-model="val.qq"></el-input>
							  	</el-form-item>
							  	<el-form-item label="电话：" prop="mobile">
							    	<el-input size="small" v-model="val.mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="其他电话：" prop="other_mobile">
							    	<el-input size="small" v-model="val.other_mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="邮箱：" prop="email">
							    	<el-input size="small" v-model="val.email"></el-input>
							  	</el-form-item>
							</el-form>
		                </div>
					
		            </div>

		            <div class="addDetail unSave" v-for="(val, index) in unSave">
		                <span class="addDelTitle">联系信息</span>

		                <div class="addDelContent">
		                	<el-form :model="val" :rules="rules" :ref="val" label-width="100px" class="demo-ruleForm">
			                	<el-form-item label="联系人：" style="display: block">
							    	<el-input size="small" v-model="val.contact"></el-input>
							  	</el-form-item>
							  	<el-form-item label="QQ/微信：" prop="qq">
							    	<el-input size="small" v-model="val.qq"></el-input>
							  	</el-form-item>
							  	<el-form-item label="电话：" prop="mobile">
							    	<el-input size="small" v-model="val.mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="其他电话：" prop="other_mobile">
							    	<el-input size="small" v-model="val.other_mobile"></el-input>
							  	</el-form-item>
							  	<el-form-item label="邮箱：" prop="email">
							    	<el-input size="small" v-model="val.email"></el-input>
							  	</el-form-item>
							  	<div class="addFoot">
									<span class="save" @click="savaUnsave">保存</span>
									<span class="cancel" @click="cancelUnsave">取消</span>
								</div>
							</el-form>
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
		
<!-- <div style="width: 200px; display: inline-block" v-if="!isOut">
	 <el-autocomplete size="small" class="inline-input" v-model="ruleForm.referee" :fetch-suggestions="querySearch" placeholder="请输入内部推荐人" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
</div> -->
<!-- <i class="el-icon-search" @click="changeOut" style="cursor: pointer"></i> -->
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


	const vm = new Vue()
	var mobileRepetition = (rule, value, callback) => {

        vm.$http.post('Base/checkUserData', {mobile: value}).then(d => {
			if(d.body.ret != 1) {
				return callback(new Error('电话重复'));
			} else {
				return callback();
			}
		})

    };
    var qqRepetition = (rule, value, callback) => {
        vm.$http.post('Base/checkUserData', {qq: value}).then(d => {
			if(d.body.ret != 1) {
				return callback(new Error('qq重复'));
			} else {
				return callback();
			}
		})
    };
    var emailRepetition = (rule, value, callback) => {
        vm.$http.post('Base/checkUserData', {email: value}).then(d => {
			if(d.body.ret != 1) {
				return callback(new Error('email重复'));
			} else {
				return callback();
			}
		})
    };
    var otherMobileRepetition = (rule, value, callback) => {
        vm.$http.post('Base/checkUserData', {other_mobile: value}).then(d => {
			if(d.body.ret != 1) {
				return callback(new Error('其他电话重复'));
			} else {
				return callback();
			}
		})
    };
    var usernameRepetition = (rule, value, callback) => {
        vm.$http.post('Base/checkUserData', {username: value}).then(d => {
			if(d.body.ret != 1) {
				return callback(new Error('客户名称重复'));
			} else {
				return callback();
			}
		})
    };
export default {
  	created() {
  		var d = Cookie.get('data')
  		this.all_after_sales = d.childAfterSales
		this.all_industry = d.industry
		this.all_sales = d.childSales
		//销售，售后默认自己
		if(d.position_id == 6) {
			for(let i = 0; i < d.childAfterSales.length; i++) {
				if(d.childAfterSales[i].realname == d.username) {
					this.ruleForm.after_sale_id = d.childAfterSales[i].id
					this.after_sale_id = true
					break;
				}
			}
		}
		if(d.position_id == 4 || d.position_id == 3 || d.position_id == 2) {
			for(let i = 0; i < d.childSales.length; i++) {
				if(d.childSales[i].realname == d.username) {
					this.ruleForm.sale_id = d.childSales[i].id
					// this.sales = true
					break;
				}
			}
		}
  	},
    data() {
      return {
        ruleForm: {
        	user_info: {
        		username: '',
				url: '',
				area: '', 
				type: '',
				industry_id: '',
				sale_id: '',
				after_sale_id: '',
				referee: '',
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
        all_after_sales: [],
		all_industry: [],
		all_sales: [],
        rules: {
            'user_info.username': [
                { required: true, message: '请输入客户名称', trigger: 'blur' }
            ],
            'user_info.url': [
                { validator: website, trigger: 'change' }
            ],
            'contact': [
                { required: true, message: '输入联系人', trigger: 'change' }
            ],
            'user_info.industry_id': [
            	{ required: true, message: '请选择行业', trigger: 'change'}
            ],
            'mobile': [
            	{ validator: mobileRepetition, trigger: 'change' }
            ],
            'qq': [
            	{ validator: qqRepetition, trigger: 'change' }
            ],
            'other_mobile': [
            	{ validator: otherMobileRepetition, trigger: 'change' }
            ],
            'email': [
            	{ validator: emailRepetition, trigger: 'change' }
            ],
        },
        after_sale_id: false,
        sales: false,
        // isOut: true, //外部联系人还是内部推荐人
        // restaurants: [], //模糊搜索内部推荐认

        //未保存的新增联系人
        unSave: [],
      };
    },
    // mounted() {
    // 	this.$http.post('/customer/likeSearch').then(d => {
    // 		let data = d.body.data
    // 		for(let i = 0; i < data.length; i++) {
    // 			data[i].value = data[i].realname
    // 		}
    // 		this.restaurants = data
    // 	})	
    // },
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

		            if(!this.ruleForm.user_info.after_sale_id && !this.ruleForm.user_info.sale_id) {
		            	this.open1()
		            	return false
		            }
		            this.$http.post('/customer/addUser', this.ruleForm).then(function(data){
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
	    		message: '请填写电话、邮箱、QQ/微信、其他电话中至少一条'
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
	        		username: '',
					url: '',
					area: '', 
					type: '',
					industry_id: '',
					sale_id: '',
					after_sale_id: '',
					referee: '',
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
	    	this.$router.push('/customer/allcus')
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
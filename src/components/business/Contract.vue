<template>
	<div>
		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal"></el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<el-select placeholder="合同金额"  v-model="searchData.money">
					<el-option label="合同金额" :value="allVal"></el-option>
				    <el-option label="10000以下" value="0, 10000"></el-option>
				    <el-option label="10000~50000" value="10000, 50000"></el-option>
				    <el-option label="50000~100000" value="50000, 100000"></el-option>
				    <el-option label="100000以上" value="100000"></el-option>
				</el-select>

				<el-date-picker v-model="searchData.year" align="right" type="year" placeholder="选择年" :editable=false @change="getYear"></el-date-picker>
			
				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<el-button type="primary" size="small" icon="plus" @click="addContract" v-if="jurisdiction.contractadd == 1">添加合同</el-button>
			</div>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="2"><div class="grid-content">序号</div></el-col>
				<el-col :span="4"><div class="grid-content">合同编号</div></el-col>
				<el-col :span="3"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="3"><div class="grid-content">公司名称</div></el-col>
				<el-col :span="2"><div class="grid-content">签订日期</div></el-col>
				<el-col :span="2"><div class="grid-content">合同金额</div></el-col>
				<el-col :span="4"><div class="grid-content">附件</div></el-col>
				<el-col :span="4"><div class="grid-content">备份</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allLists.list">
				<el-col :span="2"><div class="grid-content">{{val.l_number}}</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.number}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.company_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sign_date}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.money}}</div></el-col>
				<el-col :span="4"><div class="grid-content">
					<a :href="val.scanning[0].data || ''" :download="val.scanning[0].data || ''" v-if="val.scanning">
						<el-button type="text" size="small">下载</el-button>
					</a>
					<el-button type="text" size="small" v-if="!val.scanning">暂无</el-button>
				</div></el-col>
				<el-col :span="4"><div class="grid-content">{{val.remark}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="allLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>

		<el-dialog :close-on-click-modal="false" title="订单变更" v-model="addContractState" size="tiny" :before-close="handleClose" @close="addContractClear">
			<div class="changeIndent">
				<el-form :model="data" ref="data" label-width="100px" class="demo-data"  :rules="rules">
					<el-form-item label="客户名称：" prop="user_id">
			    		<span style="margin-right: 10px">{{username}}</span><el-button type="text" size="small" @click="choose">选择</el-button>
			  		</el-form-item>
					
					<el-form-item label="公司名称：" prop="company_name">
			    		<el-input size="small" v-model="data.company_name"></el-input>
			  		</el-form-item>

					<el-form-item label="合同编号：" prop="number">
			    		<el-input size="small" v-model="data.number"></el-input>
			  		</el-form-item>

			  		<el-form-item label="合同金额：" prop="money">
			    		<el-input size="small" v-model="data.money"></el-input>
			  		</el-form-item>

			  		<el-form-item label="签订日期：" prop="sign_date">
			  			<el-date-picker v-model="data.sign_date" type="date" placeholder="选择日期" :picker-options="pickerOptions0"  @change="getDate" :editable=false :clearable=true size="small"></el-date-picker>
					</el-form-item>

			  		<el-form-item label="附件：">
						<el-upload class="upload-demo" action="/Base/uploadImg" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :accept="accept" :name="pic" :on-success="fileSuccess">
						    <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
			  		</el-form-item>
					
					<el-form-item label="备注：" style="display:block">
				    	<el-input type="textarea" v-model="data.remark" size="small"></el-input>
				  	</el-form-item>
		  		</el-form>
	  		</div>

	  		<span slot="footer" class="dialog-footer">
    			<el-button @click="addContractClear">取 消</el-button>
    			<el-button type="primary" @click="addContractSure('data')">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" v-model="dialogVisible" size="tiny">
	        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

			<el-tree class="filter-tree" :data="data2" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2" @node-click="clickName"></el-tree>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogVisible = false">取 消</el-button>
	            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        	</span>
		</el-dialog>

	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import search from './Search.vue'

	var number = (rule, value, callback) => {
	    var e = /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
	    if (!e.test(value) && value) {
	        callback(new Error('请输入正确的金额'));
	    } else {
	        callback();
	    }
	};
	export default {
		watch: {
	        filterText(val) {
	        	this.$refs.tree2.filter(val);
	        },
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('searchContractList', this.searchData)
				} else {
					this.searchData = {
						sale_id: '',
						money: '',
						year: '',
						p: 1,
						username: this.searchUsername
					}
					this.$store.dispatch('searchContractList', this.searchData)
				}
			}
	    },
		created() {
			this.$store.dispatch('searchContractList', this.searchData)
		},
		data() {
			return {
				allVal: '',
				
				addContractState: false,
				data: {
					company_name: '',
					sign_date: '',
					sale_id: '',
					user_id: '',
					number: '',
					money: '',
					scanning: [],
					remark: '',
				},
				rules: {
					'sign_date': [
						{ required: true, message: '请选择日期', trigger: 'change' }
					],
					'company_name': [
						{ required: true, message: '请输入公司名称', trigger: 'change' }
					],
					'user_id': [
						{ required: false, message: '请选择客户', trigger: 'change' }
					],
					'number': [
						{ required: true, message: '请输入合同编号', trigger: 'change' }
					],
					'money': [
						{ required: true, message: '请输入合同价格', trigger: 'change' },
						{ validator: number, trigger: 'change' } 
					],
				},
				username: '请选择',
				pickerOptions0: {
					disabledDate(time) {
			            return false;
			        }
				},
				//树形结构
				dialogVisible: false,
		        filterText: '',
		        data2: [],
		        defaultProps: {
		            children: 'children',
		            label: 'label'
		        },
		        //上传
		        accept: '.jpg, .jpeg, .png, .bmp, .tif, .pdf',
		        pic: 'pic', 
		        fileList2: [],
			}
		},
		computed: {
			all_sales() {
				return Cookie.get('data').childSales
			},
			allLists() {
				return this.$store.getters.contractLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.business
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			searchData() {
				return this.$store.getters.all_state.contractSearchData
			},
			currentPage() {
				return this.$store.getters.all_state.contractSearchData.p || 1
			}
		},
		components: {
			search
		},
		methods: {
			searchAlllist() {
				this.$store.dispatch('searchContractList', this.searchData)
			},
			getList(currentPage) {
				this.$store.dispatch('searchContractList', {p: currentPage})
			},
			getYear(d) {
				if(!d) {
					d = ''
				}
				this.searchData.year = d
			},
			addContract() {
				this.addContractState = true
			},
			addContractClear() {
				for(let k in this.data) {
					if(k != 'scanning') {
						this.data[k] = ''
					} else { 
						this.data[k] = []
					}
				}
				this.addContractState = false
				this.username = ''
				this.filterText = ''
				this.fileList2 = []
			},
			addContractSure(formName) {
				this.$refs[formName].validate((valid) => {
		            if (valid) {
		        //     	if(this.data.scanning.length == 0) {
					    	// this.openDefeat('请上传文件')
					    	// return
		        //     	}
		            	this.$http.post('/Business/contractAdd', this.data).then(d => {
		            		if(d.body.ret == 1) {
						    	this.openSuccess('保存成功')
						    	this.$store.dispatch('searchContractList', this.searchData)
						    	this.addContractClear()
		            		} else {
						    	this.openDefeat(d.body.msg)
		            		}
		            	})
			        } else {
			            return false;
			        }
		        });
			},
			getDate(d) {
				if(!d) {
					d = ''
				}
				this.data.sign_date = d
			},
			choose() {
				this.dialogVisible = true
				if(this.data2.length == 0) {
					this.$http.post('/base/getAllUsersIndustry').then(d => {
						var d = d.body.data
						this.data2 = []
						for(let i in d) {
							this.data2[this.data2.length] = {}
							this.data2[this.data2.length - 1].label = d[i].industryName
							this.data2[this.data2.length - 1].children = d[i].list
						}
					})
				}
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		    },
		    clickName(a, b, c) {
		    	if(a.id) {
		    		this.username = a.label
		    		this.data.user_id = a.id
		    		this.data.sale_id = a.sale_id
		    		this.dialogVisible = false
		    		
		    	}
		    },

		    fileSuccess(response, file, fileList) {
				if(response.ret == 1) {

					this.$notify({
			    		title: '成功',
			    		message: '文件上传成功',
			    		type: 'success'
			    	})
			    	this.data.scanning.push({name: file.name, data: response.data})
				} else {
					this.$notify.error({
			    		title: '失败',
			    		message: '文件上传失败',
			    	})
				}
			},
			handleRemove(file, fileList) {
				for(let i = 0; i < this.data.scanning.length; i++) {
					if(file.name == this.data.scanning[i].name) {
						this.data.scanning.splice(i, 1)
					}
				}
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
	.leftBtn .el-date-editor.el-input {
		width: 118px;
	}
</style>
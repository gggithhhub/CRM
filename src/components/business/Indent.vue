<template>
	<div>
		<div class="query">
			<search></search>
			<div class="leftBtn">
				<span>查询：</span>
				<el-select placeholder="订单类型"  v-model="searchData.order_type">
					<el-option label="订单类型" :value="allVal"></el-option>
				    <el-option label="新增单" value="1"></el-option>
				    <el-option label="变更单" value="2"></el-option>
				    <el-option label="终止单" value="3"></el-option>
				</el-select>
				<el-select placeholder="投放地区"  v-model="searchData.province">
					<el-option label="投放地区" :value="allVal"></el-option>
					<el-option  v-for="item in allprovince"  :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select placeholder="投放类型"  v-model="searchData.put_type">
					<el-option label="投放类型" :value="allVal"></el-option>
				    <el-option label="pc" value="0"></el-option>
				    <el-option label="无线" value="1"></el-option>
				</el-select>
				<el-select placeholder="负责销售"  v-model="searchData.sale_id">
					<el-option label="负责销售" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>
				<el-select placeholder="负责售后"  v-model="searchData.after_sale_id">
					<el-option label="负责售后" :value="allVal">
				    </el-option>
				    <el-option v-for="item in all_after_sales" :label="item.realname" :value="item.id">
				    </el-option>
				</el-select>

				<el-button type="primary" size="small" @click="searchAlllist">查询</el-button>
			</div>
			<div class="rightBtn">
				<router-link to="/business/indent/AddReport" tag="span" v-if="jurisdiction.editorderdatalist == 1">
					<el-button type="primary" size="small" icon="plus">
						添加数据
					</el-button>
				</router-link>
				<router-link to="/business/indent/AddIndent" tag="span" v-if="jurisdiction.orderadd == 1">
					<el-button type="primary" size="small" icon="plus">
						添加订单
					</el-button>
				</router-link>
				<el-button type="primary" size="small" @click="addDem" icon="plus" v-if="jurisdiction.orderexport == 1">导出订单</el-button>
			</div>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="3"><div class="grid-content">创建日期</div></el-col>
				<el-col :span="3"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="3"><div class="grid-content">需求单名称</div></el-col>
				<el-col :span="2"><div class="grid-content">订单类型</div></el-col>
				<el-col :span="3"><div class="grid-content">投放地区</div></el-col>
				<el-col :span="2"><div class="grid-content">投放类型</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="4"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in allIndList.list" :class="{allcusBgc: val.is_color == 1}">
				<el-col :span="3"><div class="grid-content">{{val.create_time}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="3"><div class="grid-content detailColor" style="cursor: pointer" @click="showDetail(index, val.id)">{{val.demand_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.order_type}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.put_province}}{{val.put_city}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.put_type | put_type}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.after_sale_name}}</div></el-col>
				<el-col :span="4"><div class="grid-content">

					<el-button type="text" size="small" @click="delIndent(val.id)" v-if="val.btn_del == 1 && jurisdiction.delorder == 1">删除</el-button>
					<el-button type="text" size="small" @click="resubmit(val.id, val.order_type, val.type, val.return_cash_type, val.return_cash_num)" v-if="val.btn_modify == 1 && jurisdiction.ordermodify == 1">编辑</el-button>
					<el-button type="text" size="small" @click="onBill(val.id)" v-if="val.btn_confirm_up == 1 && jurisdiction.confirmuporder == 1">上单确认</el-button>
					<el-button type="text" size="small" @click="stopAginBill(val.id)" v-if="val.btn_confirm_stop == 1 && jurisdiction.confirmstoporder == 1">停单确认</el-button>
					<el-button type="text" size="small" @click="change(val.id)" v-if="val.btn_confirm_edit == 1 && jurisdiction.confirmupdateorder == 1">变更确认</el-button>
					<el-button type="text" size="small" @click="addData(val.id)" v-if="val.btn_addData == 1 && jurisdiction.addorderdata">添加数据</el-button>
					<el-button type="text" size="small" @click="resubmit(val.id, val.order_type, val.type, val.return_cash_type, val.return_cash_num)" v-if="val.btn_re_up == 1 && jurisdiction.orderedit == 1">重新提交</el-button>
					<el-button type="text" size="small" @click="changeIndent(val.id, val.put_province, val.put_city, val.put_type, val.type, val.return_cash_type, val.return_cash_num)" v-if="val.btn_edit == 1 && jurisdiction.updateorder == 1">订单变更</el-button>
					<el-button type="text" size="small" @click="stopBill(val.id)" v-if="val.btn_stop == 1 && jurisdiction.stoporder == 1">停单</el-button>

					<el-button type="text" size="small" @click="restart(val.id)" v-if="val.btn_restart == 1 && jurisdiction.orderrestart == 1">重启</el-button>
		
				</div></el-col>
				<el-col :span="24" v-if="val.is_show == 1">
					<div class="" v-for="(v, index) in detail" :class="{zhankaiBox1: index == 0, zhankaiBox2: index > 0}">
						<div class="zhankaiBoxCont">
							<label class="word"><em>投放周期：</em><span>{{v.put_start_date}}-{{v.put_end_date}}</span></label>
							<label class="word"><em>投放时段：</em><span>{{v.put_start_time}}-{{v.put_end_time}}</span></label>
							<label class="word"><em>限&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：</em><span>{{v.day_limit}}M/天</span></label>
							<label class="word"><em>落&nbsp;&nbsp;地&nbsp;页：</em><a :href="v.land_page" target="_blank">{{v.land_page}}</a></label><br />
							<label class="sucai"><em>附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</em>
								<span>
									<span v-for="(v, index) in v.enclosure_url"><i>{{v.name}}</i><a href="javascript:;" @click="isShow(v.url)">预览</a><a :href="v.url" :download="v.name">下载</a></span>
								</span>
							</label>
							<label style="display: block"><em>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</em><span>{{v.remark}}</span></label><br />

							<label class="fankui"><em>反&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;馈：</em>
								<span v-html="v.feedbackA"></span>
								<a href="javascript:;" v-if="index == 0 && jurisdiction.editfeedback == 1" @click="editFeedback(val.id, v.feedback)">编辑</a>
							</label>

							<label class="word word1" v-if="position_id != 10"><em>合同单价：</em><span class="num">¥{{v.contract_price}}</span></label>
							<label class="word word1" v-if="position_id != 10"><em>基准单价：</em><span class="num">¥{{v.benchmark_price}}</span></label>
							<label class="word word1" v-if="position_id != 10"><em>实际单价：</em><span class="num">¥{{v.actual_price}}</span></label>
						</div>
					</div>
				</el-col>
			</el-row>
			<div class="pageBox">
				<el-pagination small layout="prev, pager, next" :total="allIndList.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
			</div>
		</div>
		<el-dialog :close-on-click-modal="false" v-model="imgShow" size="large" top="1%">
			<div style="height: 100%;width:100%">
				<img :src="imgSrc" alt=""  style="height: 100%;width:100%">
			</div>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="反馈" v-model="feedback" size="tiny" :before-close="handleClose" @close="feedbackClear">
			<span>反馈：</span>
			<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="feedbackData.feedback" style="width: 300px; vertical-align: top;"></el-input>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="feedbackClear">取 消</el-button>
    			<el-button type="primary" @click="feedbackSure">确 定</el-button>
  			</span>
		</el-dialog>
		
		<el-dialog :close-on-click-modal="false" title="删除" v-model="delIndentState" size="tiny" :before-close="handleClose" @close="delClear">
  			<span>是否删除</span>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="delClear">取 消</el-button>
    			<el-button type="primary" @click="delSure">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="上单确认" v-model="onBillState" size="tiny" :before-close="handleClose" @close="onBillClear">
			<div>
				<span>审核：</span>
	  			<el-select v-model="onBillData.confirm" size="small" placeholder="请选择是否确认上单" style="width: 300px;">
	  				<el-option label="是" value="1"></el-option>
	  				<el-option label="否" value="2"></el-option>
	  			</el-select>
			</div>
  			<div style="margin-top: 10px;">
  				<span>反馈：</span>
  				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="onBillData.feedback" style="width: 300px; vertical-align: top;"></el-input>
  			</div>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="onBillClear">取 消</el-button>
    			<el-button type="primary" @click="onBillSure">确 定</el-button>
  			</span>
		</el-dialog>
		
		<el-dialog :close-on-click-modal="false" title="变更确认" v-model="changeSureState" size="tiny" :before-close="handleClose" @close="changeSureClear">
			<div>
				<span>审核：</span>
	  			<el-select v-model="changeSureData.confirm" size="small" placeholder="请选择是否确认上单" style="width: 300px;">
	  				<el-option label="是" value="1"></el-option>
	  				<el-option label="否" value="2"></el-option>
	  			</el-select>
			</div>
  			<div style="margin-top: 10px;">
  				<span>反馈：</span>
  				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="changeSureData.feedback" style="width: 300px; vertical-align: top;"></el-input>
  			</div>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="changeSureClear">取 消</el-button>
    			<el-button type="primary" @click="changeSureSure">确 定</el-button>
  			</span>

		</el-dialog>
		<el-dialog :close-on-click-modal="false" title="停单" v-model="stopBillState" size="tiny" :before-close="handleClose" @close="stopBillClear">
			<p style="text-align: center">停单后，不可进行任何操作</p>
			<p style="text-align: center">是否确认终止该订单</p>

			<span>停单原因：</span>
  			<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="stop_reason" style="width: 300px; vertical-align: top;"></el-input>

  			<span slot="footer" class="dialog-footer">
    			<el-button @click="stopAginClear">取 消</el-button>
    			<el-button type="primary" @click="stopBillSure">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="停单确认" v-model="stopAginState" size="tiny" :before-close="handleClose" @close="stopAginClear">
			<p style="text-align: center">停单后，不可进行任何操作</p>
			<p style="text-align: center">是否确认终止该订单</p>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="stopBillClear">取 消</el-button>
    			<el-button type="primary" @click="stopSure">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="添加数据" v-model="addDataState" size="tiny" :before-close="handleClose" @close="addDataClear">
			<div>
				<span>日期：</span>
			    <el-date-picker v-model="addDataData.date" type="date" placeholder="选择日期" @change="getDate1" :editable=false :picker-options="pickerOptions3" size="small"></el-date-picker>
			</div>
			<div style="margin-top: 10px;">
				<span>日限量：</span>
				<el-input size="small" v-model="addDataData.pv" style="width: 179px"></el-input>
			</div>
  			<span slot="footer" class="dialog-footer">
    			<el-button @click="addDataClear">取 消</el-button>
    			<el-button type="primary" @click="addDataSure">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog :close-on-click-modal="false" title="订单变更" v-model="changeIndentState" size="tiny" :before-close="handleClose" @close="changeIndentClear">
			<div class="changeIndent">
				<el-form :model="data" ref="data" label-width="90px" class="demo-data">
					<el-form-item label="地区">
			    		<span>{{bgArea}}</span>
			  		</el-form-item>

			  		<el-form-item label="投放类型">
			    		<span>{{bgType | put_type}}</span>
			  		</el-form-item>

			  		<el-form-item label="限量" prop="day_limit">
			    		<el-input size="small" v-model="data.day_limit"></el-input>
			  		</el-form-item>

			  		<el-form-item label="落地页" prop="land_page">
			    		<el-input size="small" v-model="data.land_page"></el-input>
			  		</el-form-item>

			  		<el-form-item label="合同单价" prop="contract_price">
			    		<el-input size="small" v-model="data.contract_price" @change="hetong"></el-input>
			  		</el-form-item>

			  		<el-form-item label="基准单价" prop="benchmark_price">
			    		<el-input size="small" v-model="data.benchmark_price"></el-input>
			  		</el-form-item>

			  		<el-form-item label="实际单价" prop="actual_price">
			    		<el-input size="small" v-model="data.actual_price" @change="shiji"></el-input>
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
						<el-upload class="upload-demo" action="/base/uploadAttachment" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture"  :accept="accept" :on-success="fileSuccess">
						    <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
			  		</el-form-item>
					
					<el-form-item label="备注" style="display:block">
				    	<el-input type="textarea" v-model="data.remark" size="small"></el-input>
				  	</el-form-item>
								
		  			
		  		</el-form>
	  		</div>

	  		<span slot="footer" class="dialog-footer">
    			<el-button @click="changeIndentClear">取 消</el-button>
    			<el-button type="primary" @click="changeIndentSure">确 定</el-button>
  			</span>
		</el-dialog\>


		<el-dialog :close-on-click-modal="false" title="编辑/重新提交" v-model="resubmitState" size="tiny" :before-close="handleClose" @close="resubmitClear">
			<div class="changeIndent">
				<el-form :model="data" ref="data" label-width="90px" class="demo-data" :rules="rules">
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
			    		<el-input size="small" v-model="data.day_limit"></el-input>
			  		</el-form-item>

			  		<el-form-item label="落地页" prop="land_page">
			    		<el-input size="small" v-model="data.land_page"></el-input>
			  		</el-form-item>

			  		<el-form-item label="合同单价" prop="contract_price">
			    		<el-input size="small" v-model="data.contract_price" @change="hetong"></el-input>
			  		</el-form-item>

			  		<el-form-item label="基准单价" prop="benchmark_price">
			    		<el-input size="small" v-model="data.benchmark_price"></el-input>
			  		</el-form-item>

			  		<el-form-item label="实际单价" prop="actual_price">
			    		<el-input size="small" v-model="data.actual_price" @change="shiji"></el-input>
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
						<el-upload class="upload-demo" action="/base/uploadAttachment" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :accept="accept" :on-success="fileSuccess">
						    <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
			  		</el-form-item>
					
					<el-form-item label="备注" style="display:block">
				    	<el-input type="textarea" v-model="data.remark" size="small"></el-input>
				  	</el-form-item>
								
		  			
		  		</el-form>
	  		</div>

	  		<span slot="footer" class="dialog-footer">
    			<el-button @click="resubmitClear">取 消</el-button>
    			<el-button type="primary" @click="resubmitSure('data')">确 定</el-button>
  			</span>
		</el-dialog>

	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	import search from './Search.vue'
	import getDate from '../../js/common.js'

	function GetDay() {   
        var today=new Date();      
        var yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24;    
   
        var yesterday = new Date();      
        yesterday.setTime(yesterday_milliseconds);      
            
        var strYear = yesterday.getFullYear(); 
   
        var strDay = yesterday.getDate();   
        var strMonth = yesterday.getMonth() + 1; 
   
        if(strMonth < 10) {   
            strMonth = "0" + strMonth;   
        }   
        var strYesterday = strYear + "-" + strMonth + "-" + strDay;   
        return strYesterday;   
    }
 	export default {
 		created() {
 			this.$store.dispatch('indentDemandList', { p: 1 })
 			this.$http.post('/base/getProvince').then(d => {
 				this.allprovince = d.body.data
 			})

 			
 		},
 		watch: {
			searchUsername() {
				if(this.searchUsername == '') {
					this.searchData.p = 1
					this.searchData.username = ''
					this.$store.dispatch('indentDemandList', this.searchData)
				} else {
					this.searchData = {
						order_type: '',
						province: '',
						put_type: '',
						after_sale_id: '',
						sale_id: '',
						p: 1,
						username: this.searchUsername
					}
					this.$store.dispatch('indentDemandList', this.searchData)
				}
			}
		},
		data() {
			return {
				
				all: '全部',
				allVal: '',
				allprovince: [],
				detail: [],
				//预览
				imgShow: false,
				imgSrc: '',
				//反馈编辑
				feedback: false,
				feedbackData: {
					order_id: '',	
					feedback: '',
				},

				//各种按钮
				//删除&&停单&&停单确认
				stop_reason: '',//停单原因
				popData: {
					order_id: ''
				},
				stopBillState: false,
				stopAginState: false,
				delIndentState: false,
				//上单
				onBillData: {
					confirm: '',
					feedback: '',
					order_id: '',
				},
				onBillState: false,
				//变更
				changeSureState: false,
				changeSureData: {
					confirm: '',
					feedback: '',
					order_id: '',
				}, 
				bgArea: '',
				bgType: '',
				//添加需求
				addDataState: false,
				addDataData: {
					date: GetDay(),
					pv: '',
					order_id: '',
				},
				pickerOptions3: {
         			disabledDate(time) {
         				if(new Date().format('yyyy-MM-dd').split('-')[2] == "01") {
         					return time.getTime() >= Date.now() - 8.64e7 || time.getTime() < getDate.getPreviousMonth()[0].getTime();
         				}
            			return time.getTime() >= Date.now() - 8.64e7|| time.getTime() < getDate.getCurrentMonth()[0].getTime();
            		}
        		},
        		//订单变更
				allcity: [],
				changeIndentState: false,
				//重新提交
				resubmitState: false,

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
		        accept: '.jpg, .jpeg, .png',
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
						{ required: true, message: '请输入实际单价', trigger: 'blur' }
					],
					'benchmark_price': [
						{ required: true, message: '请输入基准单价', trigger: 'blur' }
					],
				},
				data: {
					order_id: '',
					put_province: '',
					put_city: [],
					put_type: '',
					day_limit: '',
					put_start_date: '',
					put_end_date: '',
					put_start_time: '',
					put_end_time: '',
					land_page: '',
					contract_price: '',
					actual_price: '',
					benchmark_price: '',
					enclosure_url: [],
					remark: '',
				},
				//实际单价与合同单价的转化
				returnNumber: 0,
				//变更未通过重新提交时为true
				changeIndentReset: false,
			}
		},
		components: {
			search
		},
		computed: {
			all_after_sales() {
				return Cookie.get('data').allAfterSales
			},
			all_sales() {
				if(Cookie.get('data').position_id == 6 || Cookie.get('data').position_id == 5) {
					return Cookie.get('data').allSales
				}
				return Cookie.get('data').childSales
			},
			allIndList() {

				return this.$store.getters.indentLists
			},
			searchUsername() {
				return this.$store.getters.searchUsername
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.business
			},
			position_id() { //权限
				return Cookie.get('data').position_id
			},
			searchData() {
				return this.$store.getters.all_state.indentSearchData
			},
			currentPage() {
				return this.$store.getters.all_state.indentSearchData.p || 1
			}
		},
		methods: {
			getList(currentPage) {
				this.$store.dispatch('indentDemandList', { p: currentPage })
			},
			searchAlllist() {
				this.$store.dispatch('indentDemandList', this.searchData)
			},
			showDetail(i, id) {
				//feedback
				if(this.jurisdiction.orderdetail != 1) {
					return
				}
				if(this.allIndList.list[i].is_show == 1) {
					this.allIndList.list[i].is_show = 0
					return
				}
				this.$http.post('/business/orderDetail', { order_id: id }).then(d => {
					this.detail = d.body.data.reverse()
					var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

					this.detail.forEach((val, index) => {
						val.feedbackA = val.feedback.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>");
					})
				})
				for(let i = 0; i < this.allIndList.list.length; i++) {
					var d = this.allIndList.list[i]
					d.is_show = 0
				}
				this.allIndList.list[i].is_show = 1
			},
			isShow(src) {
				this.imgSrc = src
				this.imgShow = true
			},
			//反馈编辑
			editFeedback(id, val) {
				this.feedbackData.order_id = id
				this.feedbackData.feedback = val
				this.feedback = true
			},
			feedbackClear() {
				for(let k in this.feedbackData) {
					this.feedbackData[k] = ''
				}
				this.feedback = false
			},
			feedbackSure() {
				if(!this.feedbackData.feedback) {
					this.openDefeat('请输入反馈信息')
					return
				}
				this.$http.post('/business/editFeedback', this.feedbackData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('修改成功')
						this.$http.post('/business/orderDetail', { order_id: this.feedbackData.order_id }).then(d => {
							this.detail = d.body.data.reverse()
							var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;

							this.detail.forEach((val, index) => {
								val.feedbackA = val.feedback.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>");
							})
						})
						this.feedbackClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			//各种弹窗
			//删除
			delIndent(id) {
				this.delIndentState = true
				this.popData.order_id = id
			},
			delSure() {
				this.$http.post('/business/delOrder', this.popData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('删除成功')
					} else {
						this.openDefeat('删除失败')
					}
					this.delClear()
					this.$store.dispatch('indentDemandList', this.searchData)
				}) 
			},
			delClear() {
				this.popData.order_id = ''
				this.delIndentState = false
			},
			//上单
			onBill(id) {
				this.onBillState = true
				this.onBillData.order_id = id
			},
			onBillClear() {
				for(let k in this.onBillData) {
					this.onBillData[k] = ''
				}
				this.onBillState = false
			},
			onBillSure() {
				if(!this.onBillData.confirm) {
					this.openDefeat('请选择状态')
					return
				} 
				if(!this.onBillData.feedback) {
					this.openDefeat('请输入反馈')
					return
				} 
				this.$http.post('/business/confirmUpOrder', this.onBillData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('审核成功')
						this.$store.dispatch('indentDemandList', this.searchData)
						this.onBillClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			//合同实际
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
				}
			},
			shiji() {
				if(this.returnNumber >= 0) {
					this.data.contract_price = (this.data.actual_price / (1 - this.returnNumber / 100)).toFixed(2)
				}
			},
			//变更
			change(id) {
				this.changeSureState = true
				this.changeSureData.order_id = id
			},
			changeSureClear() {
				for(let k in this.changeSureData) {
					this.changeSureData[k] = ''
				}
				this.changeSureState = false
			},
			changeSureSure() {
				if(!this.changeSureData.confirm) {
					this.openDefeat('请选择状态')
					return
				} 
				this.$http.post('/business/confirmUpdateOrder', this.changeSureData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('审核成功')
						this.$store.dispatch('indentDemandList', this.searchData)
						this.changeSureClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			//停单
			stopBill(id) {
				this.popData.order_id = id
				this.stopBillState= true
			},
			
			stopBillSure() {
				this.$http.post('/business/stopOrder', {order_id: this.popData.order_id, stop_reason: this.stop_reason}).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('停单成功。请等待确认')
						this.$store.dispatch('indentDemandList', this.searchData)
						this.stopAginClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			stopAginClear() {
				this.popData.order_id = ''
				this.stop_reason = ''
				this.stopBillState = false
			},
			//停单确认
			stopAginBill(id) {
				this.popData.order_id = id
				this.stopAginState = true
			},
			stopBillClear() {
				this.popData.order_id = ''
				this.stopAginState = false
			},
			stopSure() {
				this.$http.post('/business/confirmStopOrder', this.popData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('停单成功')
						this.$store.dispatch('indentDemandList', this.searchData)
						this.stopBillClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			getDate(d) {
				if(!d) {
					d = ''
				}
				this.addDataData.date = d
			},
			
			//添加数据
			
			getDate1(d) {
				if(!d) {
					d = ''
				}
				this.addDataData.date = d
				this.$http.post('/base/getOrderData', {order_id: this.addDataData.order_id, date: this.addDataData.date}).then(d => {
					this.addDataData.pv = d.body.data
				})
			},
			addData(id) {
				this.addDataState = true
				this.addDataData.order_id = id
				this.$http.post('/base/getOrderData', {order_id: this.addDataData.order_id, date: GetDay()}).then(d => {
					this.addDataData.pv = d.body.data
				})
			},
			addDataClear() {
				for(let k in this.addDataData) {
					this.addDataData[k] = ''
				}
				this.addDataData.date = GetDay()
				this.addDataState = false
			},
			addDataSure() {
				if(!this.addDataData.pv) {
					this.openDefeat('请填写日限量')
					return
				}
				if(isNaN(this.addDataData.pv)) {
					this.openDefeat('请填写正确的日限量')
					return
				}
				this.$http.post('/business/addOrderData', this.addDataData).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('添加成功')
						this.$http.post('/business/orderDetail', { order_id: this.addDataData.order_id }).then(d => {
							this.detail = d.body.data.reverse()
						})
						this.addDataClear()
					} else {
						this.openDefeat(d.body.msg)
					}
				})
			},
			//订单变更
			getCity(i) {
				this.data.put_city = []
				this.$http.post('/base/getCity', {province_id: i}).then(d => {
					this.allcity = d.body.data
				}) 
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
			changeIndent(id, area1, area2, put_type, ...type) {
				this.changeIndentState = true
				this.data.order_id = id
				this.bgArea = area1 + area2
				this.bgType = put_type
				this.jisuan({type: type[0], return_cash_type: type[1], return_cash_num: type[2]})
			},
			changeIndentClear() {
				for(let k in this.data) {
					this.data[k] = ''
				}
				this.data.enclosure_url = []
				this.fileList2 = []
				this.bgArea = ''
				this.bgType = ''
				this.changeIndentState = false
				this.changeIndentReset = false
			},
			changeIndentSure() {
				if(this.changeIndentReset) {
					this.$http.post('/business/orderEdit', this.data).then(d => {
	            		if(d.body.ret == 1) {
					    	this.openSuccess('保存成功')
					    	this.searchAlllist()
					    	this.changeIndentClear()
	            		} else {
					    	this.openDefeat(d.body.msg)
	            		}
	            	})
				} else {
					let empty = true
					for(let k in this.data) {
						if(this.data[k].length > 0 && k != 'order_id') {
							empty = false
							break;
						}
					}

					if(!empty) {
						this.$http.post('/business/updateOrder', this.data).then(d => {
							if(d.body.ret == 1) {
								this.openSuccess('变更成功，请等待确认')
								this.searchAlllist()
								this.changeIndentClear()
							} else {
								this.openDefeat(d.body.msg)
							}
						})
					} else {
						this.openDefeat('至少填写一项')
					}
				}
			},

			//重新提交
			resubmit(id, order_type, ...type) {
				if(order_type == "变更单") {
					this.changeIndentState = true
					
					this.changeIndentReset = true
				} else {
					this.resubmitState = true
				}
				this.data.order_id = id
				this.$http.post('/base/orderListById', {order_id: id}).then(d => {
					for(let k in this.data) {
						for(let key in d.body.data) {
							if(k == key && key != 'put_city') {
								this.data[k] = d.body.data[key]
							} else if (key == 'put_city') {
								//延迟加市，省份改变会清空市
								setTimeout(() => {
									this.data[key] = d.body.data[key].split(',')
								},200)
							}
						}
					}
					this.fileList2 = this.data.enclosure_url
				})
				this.jisuan({type: type[0], return_cash_type: type[1], return_cash_num: type[2]})

			},
			resubmitClear() {
				for(let k in this.data) {
					this.data[k] = ''
				}
				this.data.enclosure_url = []
				this.fileList2 = []
				this.resubmitState = false
			},
			resubmitSure(formName) {
				
				this.$refs[formName].validate((valid) => {
		            if (valid) {
		            	if(!this.data.put_end_date) {
					    	this.openDefeat('请选择结束日期')
					    	return
		            	}

		            	if(!this.data.put_end_time) {
					    	this.openDefeat('请选择结束时间')
					    	return
		            	}

		            	if(this.data.enclosure_url.length == 0) {
					    	this.openDefeat('请上传文件')
					    	return
		            	}
		            	this.$http.post('/business/orderEdit', this.data).then(d => {
		            		if(d.body.ret == 1) {
						    	this.openSuccess('保存成功')
						    	this.searchAlllist()
						    	this.resubmitClear()
		            		} else {
						    	this.openDefeat(d.body.msg)
		            		}
		            	})
			        } else {
			            return false;
			        }
		        });
			},

			restart(id) {
				this.$http.post('/business/orderRestart', { order_id: id }).then(d => {
					if(d.body.ret == 1) {
						this.openSuccess('重启成功')
						this.searchAlllist()
					} else {
						this.openDefeat(d.ret.msg)
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
	.allList {
		position: relative;
		top: 0;
	}
</style>
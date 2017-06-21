<template>
	<div>
		<!-- 客户池 -->
		
		<div class="detailsBox" v-if="pathNum == 0">
	        <h3>客户信息</h3>
	        <div class="detailsBox1">
	            <div class="detailsBox1_jiben">
	                <span>基本信息</span>
	                <div>
	                    <label><span>客户信息：</span><i>{{detail.username}}</i></label>
	                    <label><span>客户状态：</span><i>{{detail.level | level}}</i></label>
	                    <label><span>网址：</span><i>{{detail.url}}</i></label>
	                    <label><span>行业：</span><i>{{detail.industry_name}}</i></label>
	                    <label><span>类型：</span><i>{{detail.type | type}}</i></label>
	                    <label><span>地区：</span><i>{{detail.area}}</i></label>
	                    <label><span>负责售后：</span><i>{{detail.alter_sale_name}}</i></label>
	                    <label><span>负责销售：</span><i>{{detail.sale_name}}</i></label>
	                    <label><span>最近联系时间：</span><i>{{detail.contact_time | time}}</i></label>
	                    <label><span>下次回访时间：</span><i>{{detail.return_time | time}}</i></label>
	                    <label><span>备注：</span><i>{{detail.remark}}</i></label>
	                    <label style="vertical-align: top;"><span>推荐人：</span><i>{{detail.referee}}</i></label>
	                    <label style="width: 100%;"><span>最新进展：</span><i>{{detail.follow_record_progress}}</i></label>
	                </div>
	            </div>
	            <div class="detailsBox1_lianxi" v-for="(val, index) in contect">
	                <span>联系信息</span>
	                <div>
	                    <label style="width: 100%;"><span>联系人：</span><i>{{val.contact}}</i></label>
	                    <label><span>QQ/微信：</span><i>{{val.qq}}</i></label>
	                    <label><span>电话：</span><i>{{val.mobile}}</i></label>
	                    <label><span>其他电话：</span><i>{{val.other_mobile}}</i></label>
	                    <label><span>邮箱：</span><i>{{val.email}}</i></label>
	                </div>
	            </div>
	            <div class="detailsBox1_gengxin">
					<span>进展记录</span>
	                <div class="compile" v-if="pathNum == 0">
					<div class="compile-bottom">
						<div class="recordTable">
							<el-row>
								<el-col :span="4"><div class="grid-content recordHeader">更新时间</div></el-col>
								<el-col :span="4"><div class="grid-content recordHeader">主题</div></el-col>
								<el-col :span="4"><div class="grid-content recordHeader">下次回访时间</div></el-col>
								<el-col :span="6"><div class="grid-content recordHeader">客户级别</div></el-col>
								<el-col :span="6"><div class="grid-content recordHeader">更新记录</div></el-col>
							</el-row>
							<el-row v-for="(val, index) in recordLists.list">
								<el-col :span="4"><div class="grid-content">{{val.create_time | time}}</div></el-col>
								<el-col :span="4"><div class="grid-content">{{val.title}}</div></el-col>
								<el-col :span="4"><div class="grid-content">{{val.return_time | time}}</div></el-col>
								<el-col :span="6"><div class="grid-content">{{val.level | level}}</div></el-col>
								<el-col :span="6"><div class="grid-content lhClass">
									<el-tooltip class="item" effect="dark" placement="bottom-start">
										<p slot="content" class="newContent">{{val.record}}
										<br>
										最新进展：{{val.progress}}</p>
										<span class="noWrap">{{val.record}}{{val.progress}}</span>
									</el-tooltip>
								</div></el-col>
							</el-row>
						</div>
					</div>
					<div class="headTitle">
						<div style="float: right;">
							<el-pagination small layout="prev, pager, next" :total="recordLists.count * 10" @current-change="getRecordLists"></el-pagination>
						</div>
					</div>
				</div>

	            </div>
	        </div>
	        <div class="detailsBox2">
	            <router-link :to="{name:'Bianji',params: {id:detail.id}}" tag="a" v-if="jurisdiction.edituser == 1 && detail.btn_edit == 1">编辑</router-link>
	            <a href="javascript:;"  @click="goBack">返回</a>
	        </div>
	    </div>
		<!-- 已成交客户 -->
		<div class="detailsBox" v-if="pathNum == 1">
	        <h3>客户信息</h3>
	        <div class="detailsBox1">
	            <div class="detailsBox1_jiben">
	                <span>基本信息</span>
	                <div>
	                    <label><span>客户名称：</span><i>{{detail.username}}</i></label>
	                    <label><span>客户状态：</span><i>{{detail.type_name}}</i></label>
	                    <label><span>客户余额：</span><i>{{detail.balance}}</i></label>
	                    <label><span>行业：</span><i>{{detail.industry_name}}</i></label>
	                    <label><span>累计消耗：</span><i>{{detail.consume}}</i></label>
	                    <label><span>类型：</span><i>{{detail.type | type}}</i></label>
	                    <label><span>网址：</span><i>{{detail.url}}</i></label>
	                    <label><span>地区：</span><i>{{detail.area}}</i></label>
	                    <label><span>推荐人：</span><i>{{detail.referee}}</i></label>
	                    <label><span>负责销售：</span><i>{{detail.sale_name}}</i></label>
	                    <label><span>备注：</span><i>{{detail.remark}}</i></label>
	                    <label><span>负责售后：</span><i>{{detail.alter_sale_name}}</i></label>
	                    <label style="width: 100%;"><span>详情：</span><i>{{detail.detail}}</i></label>
	                </div>
	            </div>
	            <div class="detailsBox1_lianxi" v-for="(val, index) in contect">
	                <span>联系信息</span>
	                <div>
	                    <label style="width: 100%;"><span>联系人：</span><i>{{val.contact}}</i></label>
	                    <label><span>QQ/微信：</span><i>{{val.qq}}</i></label>
	                    <label><span>电话：</span><i>{{val.mobile}}</i></label>
	                    <label><span>其他电话：</span><i>{{val.other_mobile}}</i></label>
	                    <label><span>邮箱：</span><i>{{val.email}}</i></label>
	                </div>
	            </div>
	            <div class="detailsBox1_gengxin">
					<span>进展记录</span>
	                <div class="compile">
					<div class="compile-bottom">
						<div class="recordTable">
							<el-row>
								<el-col :span="4"><div class="grid-content recordHeader">更新时间</div></el-col>
								<el-col :span="4"><div class="grid-content recordHeader">主题</div></el-col>
								<el-col :span="4"><div class="grid-content recordHeader">下次回访时间</div></el-col>
								<el-col :span="6"><div class="grid-content recordHeader">客户级别</div></el-col>
								<el-col :span="6"><div class="grid-content recordHeader">更新记录</div></el-col>
							</el-row>
							<el-row v-for="(val, index) in recordLists.list">
								<el-col :span="4"><div class="grid-content">{{val.create_time | time}}</div></el-col>
								<el-col :span="4"><div class="grid-content">{{val.title}}</div></el-col>
								<el-col :span="4"><div class="grid-content">{{val.return_time | time}}</div></el-col>
								<el-col :span="6"><div class="grid-content">{{val.level | level}}</div></el-col>
								<el-col :span="6"><div class="grid-content lhClass">
									<el-tooltip class="item" effect="dark" placement="bottom-start">
										<p slot="content" class="newContent">{{val.record}}
										<br>
										最新进展：{{val.progress}}</p>
										<span class="noWrap">{{val.record}}{{val.progress}}</span>
									</el-tooltip>
								</div></el-col>
							</el-row>
						</div>
					</div>
					<div class="headTitle">
						<div style="float: right;">
							<el-pagination small layout="prev, pager, next" :total="recordLists.count * 10" @current-change="getRecordLists"></el-pagination>
						</div>
					</div>
				</div>

	            </div>
	        </div>
	        <div class="detailsBox2">
	            <router-link :to="{name:'Bianji',params: {id:detail.id, type: 'deal'}}" tag="a" v-if="jurisdiction.editdealuser == 1 && detail.btn == 1">编辑</router-link>
	            <a href="javascript:;"  @click="goBack">返回</a>
	        </div>
	    </div>
		<!-- <div class="detailsBox" v-else-if="pathNum == 1">
			<div class="left">
				<p><strong>客户名称：</strong>{{detail.username}}</p>
				<p><strong>账户余额：</strong>{{detail.balance}}</p>
				<p><strong>累计消耗：</strong>{{detail.consume}}</p>
				<p><strong>网&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp址：</strong>{{detail.url}}</p>
				<p><strong>联&nbsp&nbsp系&nbsp&nbsp人：</strong>{{detail.contact}}</p>
				<p><strong>电&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp话：</strong>{{detail.mobile}}</p>
				<p><strong>邮&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp箱：</strong>{{detail.email}}</p>
			</div>
			<div class="right">
				<p><strong>推&nbsp&nbsp荐&nbsp&nbsp人：</strong>{{detail.referee}}</p>
				<p><strong>QQ/微信：</strong>{{detail.qq}}</p>
				<p><strong>行&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp业：</strong>{{detail.industry_name}}</p>
				<p><strong>类&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp型：</strong>{{detail.type | type}}</p>
				<p><strong>地&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp区：</strong>{{detail.area}}</p>
				<p><strong>负责销售：</strong>{{detail.sale_name}}</p>
				<p><strong>负责售后：</strong>{{detail.alter_sale_name}}</p>
			</div>
			<div class="foot">
				<span><strong>详&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp情：</strong></span><p>{{detail.detail}}</p>
				<div style="margin-top: 23px;">
					<span><strong>备&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp注：</strong></span><p>{{detail.remark}}</p>
				</div>
			</div>
			<el-button type="primary" @click="goBack">返回</el-button>
		</div>
		<div class="compile" v-if="pathNum == 1">
			<div class="compile-bottom">
				<div class="headTitle">
					<div style="font-size: 12px; font-weight: 700; float:left">进展记录</div>
					<div style="float: right;">
						<el-pagination small layout="prev, pager, next" :total="recordLists.count * 10" @current-change="getRecordLists"></el-pagination>
					</div>
				</div>
				<div class="recordTable">
					<el-row class="headline">
						<el-col :span="4"><div class="grid-content recordHeader">更新时间</div></el-col>
						<el-col :span="4"><div class="grid-content recordHeader">主题</div></el-col>
						<el-col :span="4"><div class="grid-content recordHeader">下次回访时间</div></el-col>
						<el-col :span="6"><div class="grid-content recordHeader">客户级别</div></el-col>
						<el-col :span="6"><div class="grid-content recordHeader">更新记录</div></el-col>
					</el-row>
					<el-row v-for="(val, index) in recordLists.list">
						<el-col :span="4"><div class="grid-content">{{val.return_time | time}}</div></el-col>
						<el-col :span="4"><div class="grid-content">{{val.title}}</div></el-col>
						<el-col :span="4"><div class="grid-content">{{val.return_time | time}}</div></el-col>
						<el-col :span="6"><div class="grid-content">{{val.level | level}}</div></el-col>
						<el-col :span="6"><div class="grid-content lhClass">
							<el-tooltip class="item" effect="dark" placement="bottom-start">
								<p slot="content" class="newContent">{{val.record}}
								<br>
								最新进展：{{val.progress}}</p>
								<span class="noWrap">{{val.record}}{{val.progress}}</span>
							</el-tooltip>
						</div></el-col>
					</el-row>
				</div>
			</div>
		</div> -->

	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	export default {
		created(){
			if(!this.$route.params.id) {
				this.$router.go(-1)
				return
			}
			var that = this
			if(this.$route.path.indexOf('allcus') > 0) {
				this.$http.post('/customer/getDetails/', {id: this.$route.params.id}).then(function(data){
					that.detail = data.body.data.list[0]
				})
			} else {
				this.$http.post('/customer/getDealDetails/', {id: this.$route.params.id}).then(function(data){
					that.detail = data.body.data.list[0]
				})
			}
			
			this.$http.post('/base/getContact', {user_id : this.$route.params.id}).then(function(data){
				that.contect = data.body.data
			})


			this.getRecordLists()
		},
		data(){
			return {
				detail: '',
				recordLists: '',
				contect: [],//联系人
			}
		},
		computed: {
			pathNum() {
				if(this.$route.path.indexOf('allcus') > 0) {
					return 0
				} else if(this.$route.path.indexOf('deal') > 0) {
					return 1
				}
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.customer
			},
		},
		methods: {
			goBack() {
				this.$router.go(-1)
			},
			getRecordLists(currentPage = 1) {
				let that = this
				this.$http.post('/customer/followRecord/', {user_id: this.$route.params.id, limit: 3, p: currentPage}).then(function(data) {
	            	// data.body //数据
	            	that.recordLists = data.body.data
	        	})
			}
		}
	}
</script>
<style scoped>
	.grid-content {
	    height: 26px;
    	line-height: 24px;
	}
	.lhClass {
		height: 19px;
	    line-height: 19px;
	    vertical-align: middle;
	    margin-top: 12px;
	}
</style>
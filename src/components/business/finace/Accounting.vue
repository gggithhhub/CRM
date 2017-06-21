<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline" style="background-color: #F6F6F6;">
				<el-col :span="3"><div class="reportList">客户名称</div></el-col>
				<el-col :span="2"><div class="reportList">最近消耗日期</div></el-col>
				<el-col :span="3"><div class="reportList">充值总金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">账户余额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">消耗总金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">退款总金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">返现总金额（元）</div></el-col>
				<el-col :span="2"><div class="reportList">负责售后</div></el-col>
				<el-col :span="2"><div class="reportList">负责销售</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in list.list" class="bgColor">
				<el-col :span="3"><div class="reportList">{{val.username}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.latelyTime}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.financeTotal}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.balance}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.consumeTotal}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.refundTotal}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.cashbackTotal}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.alter_sale_name}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.sale_name}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span>充值总金额：<em>￥{{list.totalRecharge}}</em></span>
			<span>消耗总金额：<em>￥{{list.totalConsume}}</em></span>
			<span>退款总金额：<em>￥{{list.totalRefund}}</em></span>
			<span>返现总金额：<em>￥{{list.totalCashback}}</em></span>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			// this.$store.dispatch('searchReportList', {url: 'paymentBusiness'})
		},
		components: {
			search,
		},
		computed: {
			list() {
				return this.$store.getters.reportLists
			}
		},
		methods: {
			getList(curretnPage) {
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'paymentBusiness'})
			},
		}
	}
</script>
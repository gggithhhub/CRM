<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline" style="background-color: #F6F6F6;">
				<el-col :span="4"><div class="reportList">客户名称</div></el-col>
				<el-col :span="3"><div class="reportList">行业</div></el-col>
				<el-col :span="3"><div class="reportList">充值次数</div></el-col>
				<el-col :span="4"><div class="reportList">充值总金额（元）</div></el-col>
				<el-col :span="4"><div class="reportList">消耗总金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">负责销售</div></el-col>
				<el-col :span="3"><div class="reportList">负责售后</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in list.list" class="bgColor">
				<el-col :span="4"><div class="reportList">{{val.username}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.industry_name}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.count}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.recharge_money}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.consume_money}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.sale_name}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.after_sale_name}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span>充值金额：<em>￥{{list.all_recharge_money}}</em></span> <span>消耗金额：<em>￥{{list.all_consume_money}}</em></span>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			// this.$store.dispatch('searchReportList', {url: 'userRechargeReport'})
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
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'userRechargeReport'})
			},
		}
	}
</script>
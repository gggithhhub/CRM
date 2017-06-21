<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline" style="background-color: #F6F6F6;">
				<el-col :span="4"><div class="reportList">负责销售</div></el-col>
				<el-col :span="4"><div class="reportList">客户名称</div></el-col>
				<el-col :span="4"><div class="reportList">需求单名称</div></el-col>
				<el-col :span="3"><div class="reportList">消耗金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">返现金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">返量消耗金额（元）</div></el-col>
				<el-col :span="3"><div class="reportList">总提成</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in list.list" class="bgColor">
				<el-col :span="4"><div class="reportList">{{val.sale_name}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.username}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.demand_name}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.consume}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.return_money}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.return_amount}}</div></el-col>
				<el-col :span="3"><div class="reportList">{{val.last_money}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span>消耗金额：<em>￥{{list.total_consume}}</em></span>
			<span>返现金额：<em>￥{{list.total_cash}}</em></span>
			<span>返量金额：<em>￥{{list.total_return}}</em></span>
			<span>总提成：<em>￥{{list.total_commission}}</em></span>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			// this.$store.dispatch('searchReportList', {url: 'demandCheckData'})
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
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'demandCheckData'})
			},
		}
	}
</script>
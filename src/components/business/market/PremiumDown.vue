<template>
	<div>
		<div class="query">
			<search></search>
		</div>

		<div class="allList" id="allList">
			<el-row class="headline" style="background-color: #F6F6F6;">
				<el-col :span="2"><div class="reportList">日期</div></el-col>
				<el-col :span="2"><div class="reportList">负责销售</div></el-col>
				<el-col :span="2"><div class="reportList">客户名称</div></el-col>
				<el-col :span="2"><div class="reportList">需求单名称</div></el-col>
				<el-col :span="2"><div class="reportList">投放地区</div></el-col>
				<el-col :span="2"><div class="reportList">投放类型</div></el-col>
				<el-col :span="2"><div class="reportList">展现量</div></el-col>
				<el-col :span="2"><div class="reportList">基准单价</div></el-col>
				<el-col :span="2"><div class="reportList">合同单价</div></el-col>
				<el-col :span="2"><div class="reportList">实际单价</div></el-col>
				<el-col :span="2"><div class="reportList">跌价消耗</div></el-col>
				<el-col :span="2"><div class="reportList">跌价提成</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in list.list" class="bgColor">
				<el-col :span="2"><div class="reportList">{{val.date}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.username}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.demand_name}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.area_name}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.put_type_name}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.pv}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.benchmark_price}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.contract_price}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.actual_price}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.premium_money}}</div></el-col>
				<el-col :span="2"><div class="reportList">{{val.fall_moneys}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span>跌价消耗金额：<em>￥{{list.totalAmount}}</em></span> <span>跌价消耗金额：<em>￥{{list.totalCommission}}</em></span>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			// this.$store.dispatch('searchReportList', {url: 'depreciationDetaile'})
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
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'depreciationDetaile'})
			},
		}
	}
</script>
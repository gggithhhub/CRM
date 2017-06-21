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
				<el-col :span="3"><div class="reportList">本月提成</div></el-col>
				<el-col :span="3"><div class="reportList">应发放总提成</div></el-col>
				<el-col :span="3"><div class="reportList">已发放提成</div></el-col>
				<el-col :span="3"><div class="reportList">最终提成</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in list.list" class="bgColor">
				<el-col :span="4"><div class="reportList">{{val.sale_name}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.username}}</div></el-col>
				<el-col :span="4"><div class="reportList">{{val.demand_name}}</div></el-col>

				<el-col :span="3"><div class="reportList detailColor">
					<router-link :to="{name: 'CommissionDetail', params: {sale_id: val.sale_id, demand_id: val.demand_id}}" tag="span">{{val.this_month_commission}}</router-link>
					
				</div></el-col>

				<el-col :span="3"><div class="reportList detailColor">
					<router-link :to="{name: 'CommissionDetail', params: {sale_id: val.sale_id, start_date: val.examine_time, demand_id: val.demand_id}}" tag="span">{{val.sure_commission}}</router-link>
					
				</div></el-col>

				<el-col :span="3"><div class="reportList detailColor">
					<router-link :to="{name: 'CommissionDetail', params: {sale_id: val.sale_id, date: val.examine_time, demand_id: val.demand_id}}" tag="span" v-if="val.yes_commission > 0">{{val.yes_commission}}</router-link>

					<span v-else>0</span>

				</div></el-col>

				<el-col :span="3"><div class="reportList">{{val.last_commission}}</div></el-col>
			</el-row>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			// this.$store.dispatch('searchReportList', {url: 'demandSummary'})
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
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'demandSummary'})
			},
		}
	}
</script>
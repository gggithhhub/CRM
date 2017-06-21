<template>
	<div>
		<div class="report">
			<div class="reportTable">
				<ul>
					<li>客户</li>
					<li>
						<router-link to="/business/report/consume" tag="span" style="cursor: pointer">
							<el-button type="text">消耗明细表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/recharge" tag="span" style="cursor: pointer">
							<el-button type="text">充值明细表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/active" tag="span" style="cursor: pointer">
							<el-button type="text">客户活跃度</el-button>
						</router-link>
					</li>
				</ul>
				<ul>
					<li>销售</li>
					<li>
						<router-link to="/business/report/commission" tag="span" style="cursor: pointer">
							<el-button type="text">提成总览表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/demandTable" tag="span" style="cursor: pointer">
							<el-button type="text">需求单情况汇总表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/commissionDetail" tag="span" style="cursor: pointer">
							<el-button type="text">提成明细表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/premiumUp" tag="span" style="cursor: pointer">
							<el-button type="text">溢价明细表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/premiumDown" tag="span" style="cursor: pointer">
							<el-button type="text">跌价明细表</el-button>
						</router-link>
					</li>
				</ul>
				<ul>
					<li>财务</li>
					<li>
						<router-link to="/business/report/accounting" tag="span" style="cursor: pointer">
							<el-button type="text">款项核算表</el-button>
						</router-link>
					</li>
					<li>
						<router-link to="/business/report/check" tag="span" style="cursor: pointer">
							<el-button type="text">需求单核对表</el-button>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'
	export default {
		computed: {
			jurisdiction() { //权限
				return Cookie.get('data').operation.business
			},
		}
	}
</script>
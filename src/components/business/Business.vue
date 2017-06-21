<template>
	<div>
		<div class="contentRout">
			<div class="rout">
			    <ul class="clear">
					<router-link to="/business/demand" tag="li" class="firstRout" v-if="demand">需求单管理</router-link>
					<router-link to="/business/indent" tag="li" v-if="indent">订单管理</router-link>
					<router-link to="/business/report" tag="li" v-if="report">数据报表管理</router-link>
					<router-link to="/business/contract" tag="li" v-if="contract">合同管理</router-link>
				</ul>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
	import Cookie from '../../vuex/cookie.js'

	function forNav(arr, str) {
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].name == str) {
				return true
			}
		}
		return false
	}

	export default {
		computed: {
			allData() {
				let d = Cookie.get('data').nav
				for(let i = 0; i < d.length; i++) {
					if(d[i].name == '业务管理') {
						return d[i].child
					}
				}
			},
			demand() {
				return forNav(this.allData, '需求单管理')
			},
			indent() {
				return forNav(this.allData, '订单管理')
			},
			report() {
				return forNav(this.allData, '数据报表管理')
			},
			contract() {
				return forNav(this.allData, '合同管理')
			},
		}
	}
</script>
<style></style>
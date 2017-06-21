<template>
	<div>
		<div class="contentRout">
			<div class="rout">
				<ul class="clear">
					<router-link v-if="scheme" to="/market/scheme" class="firstRout" tag="li">销售方案</router-link>
					<router-link v-if="target" to="/market/target" tag="li">销售目标</router-link>
					<router-link v-if="transition" to="/market/transition" tag="li">销售转化</router-link>
					<router-link v-if="performance" to="/market/performance" tag="li">员工业绩</router-link>
					<router-link v-if="manage" to="/market/manage" tag="li">员工管理</router-link>
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
		data() {
			return {
				
			}
		},
		computed: {
			allData() {
				let d = Cookie.get('data').nav
				for(let i = 0; i < d.length; i++) {
					if(d[i].name == '销售管理') {
						return d[i].child
					}
				}
			},
			scheme() {
				return forNav(this.allData, '销售方案')
			},
			transition() {
				return forNav(this.allData, '销售转化')
			},
			target() {
				return forNav(this.allData, '销售目标')
			},
			performance() {
				return forNav(this.allData, '员工业绩')
			},
			manage() {
				return forNav(this.allData, '员工管理')
			}
		},
		methods: {
			handleIconClick(ev) {
			}
		}
	}




</script>
<style></style>
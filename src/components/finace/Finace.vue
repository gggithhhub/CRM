<template>
	<div>
		<div class="contentRout">
			<div class="rout">
			    <ul class="clear">
					<router-link v-if="audit" to="/finace/audit" tag="li" class="firstRout">打款审核</router-link>
					<router-link v-if="returnCash" to="/finace/returnCash" tag="li" class="firstRout">返现审核</router-link>
					<router-link v-if="returnQuantity" to="/finace/returnQuantity" tag="li" class="firstRout">返量审核</router-link>
					<router-link v-if="refund" to="/finace/refund" tag="li" class="firstRout">退款管理</router-link>
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
					if(d[i].name == '财务管理') {
						return d[i].child
					}
				}
			},
			audit() {
				return forNav(this.allData, '打款审核')
			},
			returnCash() {
				return forNav(this.allData, '返现管理')
			},
			returnQuantity() {
				return forNav(this.allData, '返量管理')
			},
			refund() {
				return forNav(this.allData, '退款管理')
			},
		}
	}
</script>
<style></style>
<template>
	<div>
		<div class="contentRout">
			<ul class="clear">
				<router-link v-if="juri" to="/system/juri" tag="li" class="firstRout">权限管理</router-link>
			</ul>
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
					if(d[i].name == '系统管理') {
						return d[i].child
					}
				}
			},
			juri() {
				return forNav(this.allData, '权限管理')
			},
		}
	}
</script>
<style></style>
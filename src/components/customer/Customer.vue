<template>
	<div>
		<div class="contentRout">
			<div class="rout">
			    <ul class="clear">
					<router-link v-if="allcus" to="/customer/allcus" tag="li" class="firstRout">客户池</router-link>
					<router-link v-if="deal" to="/customer/deal" tag="li">已成交客户</router-link>
					<router-link v-if="record" to="/customer/record" tag="li">客户跟进记录</router-link>
					<router-link v-if="common" to="/customer/common" tag="li">公共客户池</router-link>
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
		data(){
			return {
				// searchShow: true
			}
		},
		computed: {
			allData() {
				let d = Cookie.get('data').nav
				for(let i = 0; i < d.length; i++) {
					if(d[i].name == '客户管理') {
						return d[i].child
					}
				}
			},
			allcus() {
				return forNav(this.allData, '客户池')
			},
			deal() {
				return forNav(this.allData, '已成交客户')
			},
			record() {
				return forNav(this.allData, '客户跟进记录')
			},
			common() {
				return forNav(this.allData, '公共客户池')
			}
		}
	}
</script>
<style></style>
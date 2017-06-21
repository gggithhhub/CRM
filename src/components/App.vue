<template>
	<div id="app">
		<div class="top">
			<div class="logo">
				<img src="src/img/Zhejiang-Qiguan-Network-Co.,-Ltd.png" height="33" width="239">
			</div>
			<ul class="clear">
				<router-link to="/home" tag="li">首页</router-link>
				<router-link to="/customer" tag="li" v-if="customer">客户管理</router-link>
				<router-link to="/market" tag="li" v-if="market">销售管理</router-link>
				<router-link to="/business" tag="li" v-if="business">业务管理</router-link>
				<router-link to="/finace" tag="li" v-if="finace">财务管理</router-link>
				<router-link to="/system" tag="li" v-if="system">系统管理</router-link>
			</ul>
			<div class="rightContent">
				<span>日期：{{nowData}}</span>
				<span>{{allData.position}}：{{allData.username}}</span>
				<span class="exit" style="cursor: pointer"><a @click="out" href="/member/logout">退出</a></span>
			</div>
		</div>
		<div class="content" id="content">
			<router-view></router-view>	
		</div>
	</div>

</template>

<script>
import Cookie from '../vuex/cookie.js'

function forNav(arr, str) {
	for(let i = 0; i < arr.length; i++) {
		if(arr[i].name == str) {
			return true
		}
	}
	return false
}
export default {
	name: 'app',
	data () {
		return {
			nowData: this.getNowFormatDate(),

			lastUrl: '',
			nowUrl: ''
		}
	},
	computed: {
		//权限控制显示
		allData() {
			return Cookie.get('data')
		},
		customer() {
			if(this.allData) {
				return forNav(this.allData.nav, '客户管理')
			}
		},
		market() {
			if(this.allData) {
				return forNav(this.allData.nav, '销售管理')
			}
		},
		business() {
			if(this.allData) {
				return forNav(this.allData.nav, '业务管理')
			}
		},
		finace() {
			if(this.allData) {
				return forNav(this.allData.nav, '财务管理')
			}
		},
		system() {
			if(this.allData) {
				return forNav(this.allData.nav, '系统管理')
			}
		},
	},
	watch: {
		$route(to, from, next){
			// if(this.getNumber(to.fullPath) == 3) {
			// 	this.lastUrl = from.fullPath
			// 	this.nowUrl = to.fullPath
			// }
			// if(this.getNumber(to.fullPath) == 2 && this.getNumber(from.fullPath) == 3 && this.lastUrl == to.fullPath && this.nowUrl == from.fullPath) {

			// } else if(this.getNumber(to.fullPath) != 3) {
			// 	console.log(1)
			// 	this.$store.commit('deleteSearchData')
			// 	this.$store.commit('changeUsername', { username: '' })
			// }
			// console.log(to.fullPath + '-----' + from.fullPath)

			if((this.getNumber(to.fullPath) == 3 && this.getNumber(from.fullPath) == 3) || to.fullPath.indexOf('business/report') > -1) {
				this.$store.commit('deleteSearchData')
				this.$store.commit('changeUsername', { username: '' })
			}
			
		}
	},
	methods: {
		getNumber(str) {

			var arr = str.split('/')

			return arr.length
		},

		getNowFormatDate(){ //日期
			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

			return currentdate;
		},
		out() {
			Cookie.del('data')
		}
	}
}
</script>

<style>

</style>

<template>
	<div>
		<div class="searchName">
			<el-input placeholder="需求单名称/客户名称" icon="search" v-model="username" @change="changUsername" :on-icon-click="handleIconClick">
			</el-input>
		</div>
	</div>
</template>
<script>
	export default {
		created() {
			this.username = this.$store.getters.all_state.username
		},
		data() {
			return {
				username: ''
			}
		},
		computed: {
			searchData() {
				if(this.$route.path.indexOf('audit') > -1) {
					return this.$store.getters.all_state.auditSearchData
				}
				if(this.$route.path.indexOf('returnCash') >  -1) {
					return this.$store.getters.all_state.cashSearchData
				}
				if(this.$route.path.indexOf('returnQuantity') > -1) {
					return this.$store.getters.all_state.quantitySearchData
				}
				if(this.$route.path.indexOf('refund') > -1) {
					return this.$store.getters.all_state.refundSearchData
				}
			}
		},
		methods: {
			handleIconClick() {
				this.$store.commit('changeUsername', { username: this.username })
				this.searchAllList()
			},
			searchAllList() {
				for(var key in this.searchData) {
					if(key != 'p' && key != 'limit') {
						this.searchData[key] = ''
					}
				}
				if(this.$route.path.indexOf('audit') > 0) {
					this.$store.dispatch('searchAuditList', { username: this.username })
				}
				if(this.$route.path.indexOf('returnCash') > 0) {
					this.$store.dispatch('searchCashList', { username: this.username })
				}
				if(this.$route.path.indexOf('returnQuantity') > 0) {
					this.$store.dispatch('searchQuantityList', { username: this.username })
				}
				if(this.$route.path.indexOf('refund') > 0) {
					this.$store.dispatch('searchRefundList', { username: this.username })
				}
			},
		}
	}
</script>
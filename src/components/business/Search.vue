<template>
	<div>
		<div class="searchName">
			<el-input placeholder="需求单名称/客户名称" icon="search" v-model="username" :on-icon-click="handleIconClick">
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
				if(this.$route.path.indexOf('demand') > -1) {
					return this.$store.getters.all_state.demandSearchData
				}
				if(this.$route.path.indexOf('indent') >  -1) {
					return this.$store.getters.all_state.indentSearchData
				}
				if(this.$route.path.indexOf('contract') > -1) {
					return this.$store.getters.all_state.contractSearchData
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
				if(this.$route.path.indexOf('demand') > 0) {
					this.$store.dispatch('searchDemandList', { username: this.username })
				}
				if(this.$route.path.indexOf('indent') > 0) {
					this.$store.dispatch('indentDemandList', { username: this.username })
				}
				if(this.$route.path.indexOf('contract') > 0) {
					this.$store.dispatch('searchContractList', { username: this.username })
				}
			},
		}
	}
</script>
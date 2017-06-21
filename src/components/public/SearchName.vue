<template>
	<div class="searchName">
		<el-input placeholder="客户名称/联系人"  icon="search" v-model="username" @change="changUsername" :on-icon-click="handleIconClick">
		</el-input>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				username: '',//用户名搜索
			}
		},
		methods: {
			handleIconClick() {
				if(this.username == '') {
					this.searchData.p = 1
					this.searchAlllist()
					return
				} else {
					for(var key in this.searchData) {
						this.searchData[key] = ''
					}
					this.searchData.p = 1
					this.searchAlllist()
				}
			},
			changUsername() {
				this.$store.commit('changeUsername', { username: this.username })
			},
		}
	}
</script>
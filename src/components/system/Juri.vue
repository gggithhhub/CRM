<template>
	<div class="juri">
		<div class="leftRout">
			<div class="leftRoutCount">
				<p class="headP">权限组</p>

				<router-link :to="{ path: '/system/juri/defaultPms', query: { id: val.id, name:val.name }}" tag="div"  v-for="(val, index) in position" >
					<p @mouseover="val.over=true" @mouseout="val.over=false" :class="{current: val.over, click: val.click}" @click="clearClick(index)">
							{{val.name}}权限组
						<el-button type="text" size="mini" v-show="val.over" @click="clearClick(index)">
							<router-link :to="{ path: '/system/juri/modifyPms', query: { id: val.id, name:val.name }}" tag="span">
								修改
							</router-link>
						</el-button>
					</p>
				</router-link>

				<el-button type="primary" icon="plus" size="small" disabled="true">新建权限组</el-button>
			</div>
		</div>
		<div class="rightRoutCouint">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	export default {
		created() {
			let that = this
			this.$http.post('/system/jurisdiction').then(d => {
				for(let i = 0; i < d.body.data.position.length; i++) {
					d.body.data.position[i].over = false
					d.body.data.position[i].click = false
				}
				this.position = d.body.data.position
			})
		},
		data() {
			return {
				position: '',
			}
		},
		methods: {
			clearClick(i) {
				
				for(let i = 0; i < this.position.length; i++) {
					this.position[i].click = false
				}
				this.position[i].click = true
			}
		}
	}
</script>
<style></style>
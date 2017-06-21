<template>
	<div id="aaa">
		<div class="query">
			<search></search>
		</div>
		<div class="allList" id="allList">
			<el-row class="headline">
				<el-col :span="3"><div class="grid-content">创建时间</div></el-col>
				<el-col :span="3"><div class="grid-content">主题</div></el-col>
				<el-col :span="3"><div class="grid-content">客户名称</div></el-col>
				<el-col :span="2"><div class="grid-content">客户状态</div></el-col>
				<el-col :span="3"><div class="grid-content">最新进展</div></el-col>
				<el-col :span="3"><div class="grid-content">下次回访时间</div></el-col>
				<el-col :span="2"><div class="grid-content">负责销售</div></el-col>
				<el-col :span="2"><div class="grid-content">负责售后</div></el-col>
				<el-col :span="3"><div class="grid-content">操作</div></el-col>
			</el-row>
			<el-row v-for="(val, index) in recordLists.list">
				<el-col :span="3"><div class="grid-content">{{val.create_time | time}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.title}}</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.username}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.level | level}}</div></el-col>
				<el-col :span="3"><div class="grid-content specailLine">
					<el-tooltip class="item" effect="dark" placement="bottom">
						 <p slot="content" class="newContent">{{val.progress}}</p>
						<span class="bjText">{{val.progress}}</span>
					</el-tooltip>
				</div></el-col>
				<el-col :span="3"><div class="grid-content">{{val.return_time | time}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.sale_name}}</div></el-col>
				<el-col :span="2"><div class="grid-content">{{val.alter_sale_name}}</div></el-col>
				<el-col :span="3"><div class="grid-content"><el-button type="text" v-if="val.btn_update_progress == 1 && jurisdiction.updateprogress == 1"><router-link :to="{name:'Compile',params: {id:val.user_id}}" tag="span">更新进展</router-link></el-button></div></el-col>
			</el-row>

		</div>
		<div class="footer">
			<!-- @current-change="getList"  -->
			<el-pagination small layout="prev, pager, next" :total="recordLists.count * 10" :current-page="currentPage" @current-change="getList"></el-pagination>
		</div>
	</div>
</template>
<script>
	
	import Search from './Search.vue'
	import Cookie from '../../vuex/cookie.js'
	export default {
		created() {
			var that = this
			setTimeout(function() {
				that.$store.dispatch('searchRecordList')
			} ,200)
		},
		components: {
			'search': Search
		},
		computed: {
			recordLists() {
				return this.$store.getters.recordLists
			},
			jurisdiction() { //权限
				return Cookie.get('data').operation.customer
			},
			currentPage() {
				return this.$store.getters.all_state.recordSearchData.p || 1
			}
		},
		methods: {
			//翻页
			getList(currentPage) {
				this.$store.dispatch('searchRecordList', {p: currentPage})
			},
		}
	}
</script>
<style scoped>

</style>
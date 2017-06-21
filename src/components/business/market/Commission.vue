<template>
	<div>
		<div class="query">
			<search></search>
		</div>
		
		<div class="customSelect"><span @click="isShow = !isShow" class="title">自定义报表</span>

			<div class="customBox" v-if="isShow">
				<p>属性列</p>
				<el-checkbox-group v-model="customData.pro">
					<ul>
					    <li><el-checkbox label="sale" disabled :size="small">负责销售</el-checkbox></li>
					    <li><el-checkbox label="user" :size="small">客户名称</el-checkbox></li>
					    <li><el-checkbox label="demand" :size="small">需求单名称</el-checkbox></li>
					</ul>
				</el-checkbox-group>	

				<p>数据列</p>

				<ul>
				    <li><el-checkbox :size="small" v-model="customData.data.xh">消耗总金额</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.jb">提成级别</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.jbtc">基本提成</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.yjtc">溢价提成</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.djtc">跌价提成</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.yuji">预计提成</el-checkbox></li>
				    <li><el-checkbox :size="small" v-model="customData.data.shiji">实际提成</el-checkbox></li>
				</ul>
				</el-checkbox-group>	
				<div style="width: 100%; text-align: center;">
					<el-button type="primary" size="small" @click="sure">保存</el-button>
					<el-button size="small" @click="cancle">取消</el-button>
				</div>
			</div>
			<div style="position: fixed; top: 0; left: 0; bottom: 0; right: 0;z-index: 10;" v-if="isShow" @click.stop="isShow = false"></div>

		</div>

		<div class="custom">
			<ul class="headline" style="background-color: #F6F6F6;border-top: 1px solid #CCC;">
				<li style="border-left: none;">负责销售</li>
				<li v-if="changePro.indexOf('user') != -1">客户名称</li>
				<li v-if="changePro.indexOf('demand') != -1">需求单名称</li>
				<li v-if="changeData.xh">消耗总金额（元）</li>
				<li v-if="changeData.jb">提成级别</li>
				<li v-if="changeData.jbtc">基本提成（元）</li>
				<li v-if="changeData.yjtc">溢价提成（元）</li>
				<li v-if="changeData.djtc">跌价提成（元）</li>
				<li v-if="changeData.yuji">预计提成（元）</li>
				<li v-if="changeData.shiji">实际提成（元）</li>
			</ul>

			<ul v-for="(val, index) in list.list" class="bgColor">
				<li style="border-left: none;">{{val.sale_name}}</li>
				<li v-if="changePro.indexOf('user') != -1">{{val.username}}</li>
				<li v-if="changePro.indexOf('demand') != -1">{{val.demand_name}}</li>
				<li v-if="changeData.xh">{{val.all_consume}}</li>
				<li v-if="changeData.jb">{{val.level}}</li>
				<li v-if="changeData.jbtc">{{val.parity_moneys}}</li>
				<li v-if="changeData.yjtc">{{val.premium_moneys}}</li>
				<li v-if="changeData.djtc">{{val.fall_moneys}}</li>
				<li v-if="changeData.yuji" class="detailColor">
					
				<router-link :to="{name: 'CommissionDetail', params: {sale_id:val.sale_id, username: val.username || '', demand_id: val.demand_id || ''}}" tag="span">{{val.estimate_money}}</router-link>
				</li>
				<li v-if="changeData.shiji" class="detailColor">
					<router-link :to="{name: 'DemandTable', params: {sale_id:val.sale_id, username: val.username || '', demand_id: val.demand_id || ''}}" tag="span">{{val.last_money}}</router-link>
				</li>
			</ul>
		</div>
		<div class="footer">
			<el-pagination small layout="prev, pager, next" :total="list.count * 10" @current-change="getList"></el-pagination>
		</div>
		<div class="leftFooter">
			共计：<span>消耗金额：<em>￥{{list.total_consume}}</em></span> <span>跌价消耗金额：<em>￥{{list.total_fall}}</em></span> <span>溢价消耗金额：<em>￥{{list.total_premium}}</em></span>
		</div>
	</div>
</template>
<script>
	import search from '../public/Search.vue'
	export default {
		created() {
			var date=new Date();
 			var a = date.setDate(1);
 			var timestamp4 = new Date(a)
 			var now = timestamp4.toLocaleDateString().replace(/\//g, "-")

			this.$store.dispatch('searchReportList', {searchData: {attribute: this.customData.pro}, url: 'commissionOverview'})
		},
		components: {
			search,
		},
		data() {
			return {
				customData: {
					pro: ['sale'],
					data: {
						xh: true,
						jb: true,
						jbtc: true,
						yjtc: true,
						djtc: true,
						yuji: true,
						shiji: true
					},
				},
				changePro: ['sale'],
				changeData: {
					xh: true,
					jb: true,
					jbtc: true,
					yjtc: true,
					djtc: true,
					yuji: true,
					shiji: true
				},
				isShow: false,

			}
		},
		computed: {
			list() {
				return this.$store.getters.reportLists
			}
		},
		methods: {
			getList(curretnPage) {
				this.$store.dispatch('searchReportList', {p: curretnPage, url: 'commissionOverview'})
			},
			sure() {
				this.changePro = this.customData.pro

				for(let k in this.customData.data) {
					for(let key in this.changeData) {
						if(k == key) {
							this.changeData[k] = this.customData.data[k]
						}
					}
				}

				this.$store.dispatch('searchReportList', {searchData: {attribute: this.changePro}, url: 'commissionOverview'})
				this.isShow = false
			},
			cancle() {
				this.customData.pro = this.changePro

				for(let k in this.customData.data) {
					for(let key in this.changeData) {
						if(k == key) {
							this.customData.data[k] = this.changeData[k]
						}
					}
				}
				this.isShow = false
			}
		}
	}
</script>
<template>
	<div>
		<!-- <div class="redactContent">
			<div class="redactTop">
				<el-button type="primary" size="small">返回</el-button>
			</div>
			<div class="redactBottom"></div>
		</div> -->
		<div class="redactBox">
			<div class="left">
					<p><strong>申请时间：</strong>{{allMsg.create_time | time}}</p>
					<p><strong>方案名称：</strong>{{allMsg.title}}</p>
					<p><strong>客户名称：</strong>{{allMsg.username}}</p>
					<p><strong>方案附件：</strong><span style="margin-right: 10px;">{{allMsg.filename}}</span><a :href="allMsg.plan" target="_blank"><el-button type="text">下载</el-button></a></p>
				</div>
				<div class="right">
					<p><strong>负责销售：</strong>{{allMsg.sale_name}}</p>
					<p><strong>负责售后：</strong>{{allMsg.after_sale_name}}</p>
					<p><strong>上传时间：</strong>{{allMsg.upload_time | time}}</p>
				</div>
				<div class="foot">
					<span><strong>方案描述：</strong></span><p>{{allMsg.describe}}</p>
				</div>
				<el-button type="primary" @click="goBack" style="float: left;">返回</el-button>

			</div>

		</div>
			
	</div>
</template>
<script>
	export default {
		created() {
			// alert(this.$route.params.id)
			if(!this.$route.params.id) {
				this.$router.go(-1)
				return
			}
			this.$http.post('/sale/getProgramme', {id: this.$route.params.id}).then(d => {
				this.allMsg = d.body.data
			})
		},
		data() {
			return{
				allMsg: ''
			}
		},
		methods: {
			goBack() {
				this.$router.go(-1)
			}
		}
	} 
</script>
<style>
	.redactContent {
		width: 500px;
		height: 500px;
		background-color: #ccc;
		margin-top: 40px;
		margin-left: 40px;
	}
	.redactTop {

	}
</style>
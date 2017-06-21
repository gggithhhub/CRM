<template>
	<div class="dps">
        <div class="topDps">
            <span style="margin-left: 36px;"><strong>权限名称</strong></span>
            <el-input v-model="pmsName" placeholder="权限名称" size="small" style="margin-left: 36px;display: inline-block; width: 156px" :disabled="true"></el-input>
            <el-button type="primary" size="small" @click="save">保存</el-button>
        </div>
        <div class="dpscontent">
            <el-checkbox-group v-model="operation">
	            <div class="dpsbox" v-for="(val, index) in allRadio">
	                <p class="headtitle"><el-checkbox :label="val.id">{{val.name}}</el-checkbox></p>
					
	                <div class="contentbox" v-for="(val, index) in val.child">
	                    <p class="contenttitle"><el-checkbox :label="val.id">{{val.name}}</el-checkbox></p>
	                    <ul>
	                        <li v-for="(val, index) in val.child"><el-checkbox :label="val.id">{{val.name}}</el-checkbox></li>
	                    </ul>
	                </div>
	            </div>
            </el-checkbox-group>



        </div>
    </div>
</template>
<script>
	export default {
		created() {
			let that = this
			this.$http.post('/system/jurisdiction').then(d => {
				that.allRadio = d.body.data.jurisdiction
			})

			that.operation = []
			this.$http.post('/base/getTaskById', { id: this.$route.query.id}).then(d => {
				var data = d.body.data
				for(let i = 0; i < data.length; i++) {
					that.operation.push(data[i].task_id)
				}
			})
		},
		watch: {
			pmsId() {//监视路由变换
                let that = this
                that.operation = []
                this.$http.post('/base/getTaskById/',{ id: this.pmsId }).then(d => {
					var data = d.body.data
					for(let i = 0; i < data.length; i++) {
						that.operation.push(data[i].task_id)
					}
                })
            }
		},
		data() {
			return {
				operation: [],
				allRadio: '',
			}
		},
		computed: {
			pmsId() {
				return this.$route.query.id
			},
			pmsName() {
				return this.$route.query.name + '权限组'
			},
		},
		methods: {
			save() {
				let that = this
				this.$http.post('/system/editJurisdiction',{id: this.pmsId, operation: this.operation}).then(d => {
					that.$router.push(`/system/juri/defaultPms?id=${that.pmsId}&name=${that.$route.query.name}`)
				})
			}
		}
	}
</script>
<style></style>
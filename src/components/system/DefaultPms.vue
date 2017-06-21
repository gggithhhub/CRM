<template>
    <div class="dps">
        <div class="topDps">
            <span style="margin-left: 36px;"><strong>权限名称</strong></span>
            <span style="margin-left: 36px;">{{pmsName}}</span>
        </div>
        <div class="dpscontent">

            <div class="dpsbox" v-for="(val, inde) in jurisdictionList">
                <p class="headtitle">{{val.name}}</p>

                <div class="contentbox" v-for="(val, inde) in val.child">
                    <p class="contenttitle">{{val.name}}</p>
                    <ul>
                        <li v-for="(val, inde) in val.child">{{val.name}}</li>
                    </ul>
                </div>
            </div>


        </div>
    </div>
</template>
<script>
	export default {
		created() {
            let that = this
            this.$http.post('/base/detaultTask',{ id: this.pmsId }).then(d => {
                that.jurisdictionList = d.body.data
            })
		},
        watch: {
            pmsId() {//监视路由变换
                let that = this
                this.$http.post('/base/detaultTask',{ id: this.pmsId }).then(d => {
                    that.jurisdictionList = d.body.data
                })
            }
        },
        data() {
            return {
                jurisdictionList: []
            }
        },
		computed: {
            pmsId() {
                return this.$route.query.id
            },
            pmsName() {
                return this.$route.query.name + '权限组'
            }
		},
        methods: {
        }
	}
</script>
<style>

</style>
// import Vue from './js/vue.min.js'
// import VueRouter from './js/vue-router.min.js'

import RouterConfig from './router.config.js'
import App from './components/App.vue'
import store from './vuex/store'
import Cookie from './vuex/cookie'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
    //yyyy-MM-dd 格式化时间
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "q+": Math.floor((this.getMonth() + 3) / 3)
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}



//过滤器
Vue.filter('time', function(value) {
    if (value == 0 || !value || value == null) {
        return '暂无'
    } else {
        var newDate = new Date();
        newDate.setTime(value * 1000);
        return newDate.format('yyyy-MM-dd')
    }
    return '暂无'

})

Vue.filter('level', function(value) {
    if (value == 1) {
        return '未联系'
    } else if (value == 2) {
        return '联系失败'
    } else if (value == 3) {
        return '联系成功'
    } else if (value == 4) {
        return '触达KP'
    } else if (value == 5) {
        return '发送资料/案例'
    } else if (value == 6) {
        return '方案/报价议价'
    } else if (value == 7) {
        return '签约(未打款)'
    } else if (value == 0) {
        return '洽谈失败'
    }
})

Vue.filter('type', function(value) {
    if (value == 1) {
        return '民营企业'
    } else if (value == 2) {
        return '国有企业'
    } else if (value == 3) {
        return '股份企业'
    } else if (value == 4) {
        return '外资企业'
    } else if (value == 5) {
        return '合资企业'
    } else if (value == 6) {
        return '个人企业'
    } else if (value == 7) {
        return '其他'
    }
})


Vue.filter('payType', function(value) {
    if (value == 1) {
        return "支付宝"
    } else if (value == 2) {
        return "银行"
    } else if (value == 3) {
        return "其他"
    }
})

Vue.filter('payType1', function(value) {
    if (value == 2) {
        return "银行"
    } else if (value == 1) {
        return "支付宝"
    } else if (value == 3) {
        return "其他"
    }
})

Vue.filter('cashStatus', function(value) {
    if (value == 0) {
        return "待总监审核"
    } else if (value == 1) {
        return "待徐总审核"
    } else if (value == 2) {
        return "待确认返现"
    } else if (value == 3) {
        return "已返"
    } else if (value == 4) {
        return "审核未通过"
    }
})

Vue.filter('deType', function(value) {
    if (value == 1) {
        return "暂无"
    } else if (value == 2) {
        return "返现（正价）"
    } else if (value == 3) {
        return "返现（跌价）"
    } else if (value == 4) {
        return "返量"
    }
})

Vue.filter('deStatus', function(value) {
    if (value == 0) {
        return "待总监审核"
    } else if (value == 1) {
        return "待渠道(徐总)审核"
    } else if (value == 2) {
        return "审核不通过"
    } else if (value == 9) {
        return "审核通过"
    }
})
Vue.filter('detailType', function(value) {
    if (value == 1) {
        return "暂无"
    } else if (value == 4) {
        return "返量"
    } else {
        return "返点"
    }
})

Vue.filter('quStatus', function(value) {
    if (value == 0) {
        return "待总监审核"
    } else if (value == 1) {
        return "待渠道(徐总)审核"
    } else if (value == 2) {
        return "审核不通过"
    } else if (value == 3) {
        return "待返(审核通过)"
    } else if (value == 4) {
        return "已返"
    }
})

Vue.filter('refstatus', function(value) {
    if (value == 0) {
        return "待总监审核"
    } else if (value == 1) {
        return "通过审核"
    } else if (value == 2) {
        return "未通过"
    } else if (value == 3) {
        return "财务确认退款"
    } else if (value == 9) {
        return "完成"
    }
})

Vue.filter('cash_type', function(value) {
    if (value == 1) {
        return "充值返现"
    } else if (value == 2) {
        return "消耗百分比返"
    } else if (value == 3) {
        return "差价返"
    }
})


Vue.filter('put_type', function(value) {
    if (value === "") {
        return ''
    }
    if (value == 0) {
        return "PC"
    } else if (value == 1) {
        return "无线"
    }
})

Vue.filter('return_flow', function(value) {
    if (value == 1) {
        return "充值返量"
    } else if (value == 3) {
        return "测试返量"
    } else if (value == 2) {
        return "活动返量"
    }
})
Vue.filter('flow_type', function(value) {
    if (value == 1) {
        return "充值返量"
    } else if (value == 3) {
        return "测试返量"
    } else if (value == 2) {
        return "活动返量"
    }
})

var number = (rule, value, callback) => {
    var e = /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
    if (!e.test(value) && value) {
        callback(new Error('请输入正确的金额'));
    } else {
        callback();
    }
};
const routes = RouterConfig //引入路由

//加载路由
var router = new VueRouter({
    // mode: 'history',
    routes
})
const vmO = new Vue()

router.beforeEach((to, from, next) => {
    setTimeout(function() {
        if (!Cookie.get('data')) {
            window.location.href = '/member/login'
        }
    }, 500)
    vmO.$http.post('/member/checkLogin').then(d => {
        if (d.body.ret == 0) {
            window.location.href = '/member/login'
        } else {
            // if (to.path.indexOf('details') > -1 && Cookie.get('data').position_id == 5) {
            //     return
            // }
            next()
        }
    })

});
// /base/getauth
vmO.$http.post('/base/defaultData').then(d => {
    Cookie.set('data', d.body.data)
        // alert(1)

    new Vue({
        el: '#app',
        store,
        render: h => h(App),
        router,
    })

})


//过滤器

const vm = new Vue()
var limit = '';
// window.onload = function() {
//     limit = Math.floor((document.getElementById('content').offsetHeight - 148) / 44) //根据高度计算每页显示多少条数据
//     state.limit = limit - 2
// }

function deleteData(data) {
    for (var key in data) {
        if (key != 'p' && key != 'limit') {
            data[key] = ''
        }
        if (key == 'p') {
            data.p = 1
        }
    }
}


var state = {
    limit: '', //每页的个数

    username: '', //搜索用户名

    /*客户管理*/


    //客户池
    allcusLists: '', //客户池数据
    allcusSearchData: { //客户池搜索数据
        sale_id: '',
        level: '',
        industry_id: '',
        after_sale_id: '',
        return_time: '',
        p: 1,
        username: ''
    },

    //已成交客户
    dealLists: '', //已成交客户列表
    dealSearchData: { //已成交客户搜索数据
        sale_id: '',
        industry_id: '',
        after_sale_id: '',
        p: 1,
        username: '',
        type_id: ''
    },

    //签约客户
    signed: {
        isSigned: false, //签约客户打开或关闭
        name: '', //签约客户的名字
        user_id: ''
    },

    allocation: '', //可一键分配的个数

    //客户跟进记录
    recordLists: {
        list: [],
        count: '',
        p: 1,
    },
    recordSearchData: { //客户跟进记录搜索数据
        // user_id: '',
        sale_id: '',
        level: '',
        industry_id: '',
        after_sale_id: '',
        return_time: '',
        p: 1,
        username: ''
    },
    //公共客户池
    commonLists: {
        list: [],
        count: ''
    },
    commonSearchData: { //客户跟进记录搜索数据
        industry_id: '',
        after_sale_id: '',
        p: 1,
    },
    /*客户管理*/

    /*销售管理*/
    //销售方案
    schemeLists: '', //销售方案列表
    schemeSearchData: { //销售方案搜索数据
        name: '',
        sale_id: '',
        status: '',
        after_sale_id: '',
        p: 1,
        username: ''
    },

    //销售目标
    targetLists: '', //销售方案列表
    targetSearchData: { //销售方案搜索数据
        sale_id: '',
        parentid: '',
        level: '',
        start_date: '',
        end_date: '',
        p: 1
    },

    //销售转化
    tranLists: '', //转化列表
    tranTopData: '', //转化顶部
    tranSearchData: { //转化搜索数据
        parentid: '',
        sale_id: '',
        start_date: '',
        end_date: '',
        p: 1,
    },

    //员工管理
    manageLists: '',
    manageSearchData: {
        realname: '',
        position_id: '',
        p: 1,
        username: ''
    },
    /*销售管理*/
    /*业务管理*/
    //需求单管理
    demandLists: '',
    demandSearchData: {
        return_cash_type: '',
        type: '',
        sale_id: '',
        after_sale_id: '',
        p: 1,
        username: ''
    },

    //订单管理
    indentLists: '',
    indentSearchData: {
        order_type: '',
        province: '',
        put_type: '',
        after_sale_id: '',
        sale_id: '',
        p: 1,
        username: ''
    },

    //数据报表
    reportLists: '',
    reportSearcjData: {},

    //合同管理
    contractLists: '',
    contractSearchData: {
        sale_id: '',
        money: '',
        year: '',
        p: 1,
        username: ''
    },
    /*业务管理*/

    /*财务管理*/

    auditLists: '',
    auditSearchData: {
        p: 1,
        position_id: '',
        username: '',
        sale_id: '',
        pay_type: '',
        start_date: '',
        end_date: '',
    },

    //返现审核
    cashLists: '',
    cashSearchData: {
        p: 1,
        sale_id: '',
        status: '',
        type: '',
        username: ''
    },

    //返量审核
    quantityLists: '',
    quantitySearchData: {
        sale_id: '',
        after_sale_id: '',
        status: '',
        type: '',
        p: 1,
        username: ''
    },

    //退款审核
    refundLists: '',
    refundSearchData: {
        sale_id: '',
        status: '',
        p: 1,
        username: ''
    },
    /*财务管理*/
};

const mutations = {
    changeUsername(state, payload) {
        state.username = payload.username
    },

    /*客户管理*/

    //获取销售行业售后
    getAllSale(state, payload) {
        var d = data.body.data
        state.all_after_sales = d.after_sales
        state.all_industry = d.industry
        state.all_sales = d.sales
        state.allocation = d.count
    },
    //获取客户池列表
    searchAllcusList(state, payload) {
        state.allcusLists = payload
    },
    //获取已成交用户列表
    searchDealList(state, payload) {
        state.dealLists = payload
    },

    //成为签约客户
    openOrCloseSigned(state, payload) {
        state.signed.isSigned = !state.signed.isSigned
        state.signed.name = payload.name
        state.signed.user_id = payload.user_id
    },
    //获取客户跟进记录列表
    searchRecordList(state, payload) {
        state.recordLists = payload
    },
    //获取公共客户池
    searchCommonList(state, payload) {
        state.commonLists = payload
    },

    /*客户管理*/

    /*销售管理*/
    //销售方案
    searchSchemeList(state, payload) {
        state.schemeLists = payload
    },

    //销售目标
    searchTargetList(state, payload) {
        state.targetLists = payload
    },
    //销售转化
    searchTranList(state, payload) { //列表
        state.tranLists = payload
    },
    searchTranTopData(state, payload) { //头部
        state.tranTopData = payload
    },

    //员工管理
    searchManageList(state, payload) {
        state.manageLists = payload
    },
    /*销售管理*/

    /*业务管理*/

    //需求单管理
    searchDemandList(state, payload) {
        state.demandLists = payload
    },

    //订单管理
    searchIndentList(state, payload) {
        state.indentLists = payload
    },


    //合同管理
    searchContractList(state, payload) {
        state.contractLists = payload
    },

    //数据报表
    searchReportList(state, payload) {
        state.reportLists = payload
    },

    /*业务管理*/

    /*财务管理*/
    searchAuditList(state, payload) {
        for (let i = 0; i < payload.list.length; i++) {
            var data = payload.list[i]
            data.over = false
        }
        state.auditLists = payload
    },
    //返现审核searchCashList
    searchCashList(state, payload) {
        for (let i = 0; i < payload.list.length; i++) {
            var data = payload.list[i]
            data.over = false
        }
        state.cashLists = payload
    },
    //返量审核 searchQuantityList
    searchQuantityList(state, payload) {
        for (let i = 0; i < payload.list.length; i++) {
            var data = payload.list[i]
            data.over = false
        }
        state.quantityLists = payload
    },

    //退款审核 searchRefundList
    searchRefundList(state, payload) {
        for (let i = 0; i < payload.list.length; i++) {
            var data = payload.list[i]
            data.over = false
        }
        state.refundLists = payload
    },
    /*财务管理*/

    //public 更改username

    //路由变化删除所有搜索数据
    deleteSearchData(state) {
        deleteData(state.dealSearchData)
        deleteData(state.allcusSearchData)
        deleteData(state.recordSearchData)
        deleteData(state.commonSearchData)
        deleteData(state.schemeSearchData)
        deleteData(state.targetSearchData)
        deleteData(state.manageSearchData)
        deleteData(state.demandSearchData)
        deleteData(state.indentSearchData)
        state.reportSearcjData = {}
        deleteData(state.contractSearchData)
        deleteData(state.auditSearchData)
        deleteData(state.cashSearchData)
        deleteData(state.quantitySearchData)
        deleteData(state.refundSearchData)
        deleteData(state.tranSearchData)
        state.reportLists = ''
    },

};

const actions = {
    /*客户管理*/


    //获取客户池列表 查询 
    searchAllcusList({ commit, state }, a) {
        state.allcusSearchData.limit = state.limit;
        state.allcusSearchData.username = state.username;
        //保存搜索数据
        for (var key in a) {
            for (var k in state.allcusSearchData) {
                if (key == k) {
                    state.allcusSearchData[key] = a[key]
                }
            }
        }
        //进行搜索
        vm.$http.post('/customer/index/', state.allcusSearchData).then(function(data) {
            // data.body //数据

            commit('searchAllcusList', data.body.data)
        })
    },

    //已成交客户获取列表数据
    searchDealList({ commit, state }, a) {
        state.dealSearchData.limit = state.limit;
        state.dealSearchData.username = state.username;
        //保存搜索数据
        for (var key in a) {
            for (var k in state.dealSearchData) {
                if (key == k) {
                    state.dealSearchData[key] = a[key]
                }
            }
        }
        //进行搜索
        vm.$http.post('/customer/dealUser/', state.dealSearchData).then(function(data) {
            // data.body //数据
            commit('searchDealList', data.body.data)
        })

    },
    //客户跟进记录列表
    searchRecordList({ commit, state }, a) {
        state.recordSearchData.limit = state.limit;
        state.recordSearchData.username = state.username;
        //保存搜索数据
        for (var key in a) {
            for (var k in state.recordSearchData) {
                if (key == k) {
                    state.recordSearchData[key] = a[key]
                }
            }
        }
        if (a && a.user_id) {
            vm.$http.post('/customer/followRecord/', { user_id: a.user_id, limit: 3, p: a.p }).then(function(data) {
                // data.body //数据
                commit('searchRecordList', data.body.data)
            })
        } else {
            //进行搜索
            vm.$http.post('/customer/followRecord/', state.recordSearchData).then(function(data) {
                // data.body //数据
                commit('searchRecordList', data.body.data)
            })
        }

    },

    //公共客户池
    searchCommonList({ commit, state }, a) {
        state.commonSearchData.limit = state.limit;
        state.commonSearchData.username = state.username;
        //保存搜索数据
        for (var key in a) {
            for (var k in state.commonSearchData) {
                if (key == k) {
                    state.commonSearchData[key] = a[key]
                }
            }
        }
        //进行搜索
        vm.$http.post('/customer/commonUser', state.commonSearchData).then(function(data) {
            // data.body //数据
            commit('searchCommonList', data.body.data)
        })
    },

    /*客户管理*/


    /*销售管理*/
    //销售方案
    searchSchemeList({ commit, state }, a) {
        state.schemeSearchData.limit = state.limit;
        state.schemeSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.schemeSearchData) {
                if (key == k) {
                    state.schemeSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/sale/programme', state.schemeSearchData).then(function(data) {
            commit('searchSchemeList', data.body.data)
        })
    },

    //销售目标
    searchTargetList({ commit, state }, a) {
        state.targetSearchData.limit = state.limit;
        for (var key in a) {
            for (var k in state.targetSearchData) {
                if (key == k) {
                    state.targetSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/Sale/salesTarget', state.targetSearchData).then(function(data) {
            commit('searchTargetList', data.body.data)
        })
    },

    //销售转化
    searchTranAll({ commit, state }, a) {
        state.tranSearchData.limit = state.limit;
        for (var key in a) {
            for (var k in state.tranSearchData) {
                if (key == k) {
                    state.tranSearchData[key] = a[key]
                }
            }
        }
        vm.$http.post('Sale/transformHead', state.tranSearchData).then(function(data) {
            commit('searchTranTopData', data.body.data)
        })
    },
    searchTranList({ commit, state }, a) {
        state.tranSearchData.limit = state.limit;
        for (var key in a) {
            for (var k in state.tranSearchData) {
                if (key == k) {
                    state.tranSearchData[key] = a[key]
                }
            }
        }
        vm.$http.post('Sale/transform', state.tranSearchData).then(function(data) {
            commit('searchTranList', data.body.data)
        })
    },
    //员工管理
    searchManageList({ commit, state }, a) {
        state.manageSearchData.limit = state.limit;
        state.manageSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.manageSearchData) {
                if (key == k) {
                    state.manageSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('sale/index', state.manageSearchData).then(function(data) {
            commit('searchManageList', data.body.data)
        })
    },
    /*销售管理*/

    /*业务管理*/

    //需求单管理
    searchDemandList({ commit, state }, a) {
        state.demandSearchData.limit = state.limit;
        state.demandSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.demandSearchData) {
                if (key == k) {
                    state.demandSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/business/list', state.demandSearchData).then(function(data) {
            commit('searchDemandList', data.body.data)
        })
    },

    //订单管理
    indentDemandList({ commit, state }, a) {
        state.indentSearchData.limit = state.limit;
        state.indentSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.indentSearchData) {
                if (key == k) {
                    state.indentSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/business/orderList', state.indentSearchData).then(function(data) {
            commit('searchIndentList', data.body.data)
        })
    },
    //数据报表 reportSearcjData
    searchReportList({ commit, state }, a) {
        state.reportSearcjData.limit = 20;
        if (a.p) {
            state.reportSearcjData.p = a.p
        } else {
            if (!state.reportSearcjData.attribute) {
                state.reportSearcjData = {}
            }

            state.reportSearcjData.p = 1
            for (var key in a.searchData) {
                if (a.searchData[key]) {
                    state.reportSearcjData[key] = a.searchData[key]
                }
            }
        }
        vm.$http.post('/Business/' + a.url, state.reportSearcjData).then(function(data) {
            commit('searchReportList', data.body.data)
        })
    },
    //合同管理

    searchContractList({ commit, state }, a) {
        state.contractSearchData.limit = state.limit;
        state.contractSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.contractSearchData) {
                if (key == k) {
                    state.contractSearchData[key] = a[key]
                }
            }
        }
        vm.$http.post('/Business/contractManage', state.contractSearchData).then(function(data) {
            commit('searchContractList', data.body.data)
        })
    },
    /*业务管理*/


    /*财务管理*/
    searchAuditList({ commit, state }, a) {
        state.auditSearchData.limit = state.limit
        state.auditSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.auditSearchData) {
                if (key == k) {
                    state.auditSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('finance/index', state.auditSearchData).then(function(data) {
            commit('searchAuditList', data.body.data)
        })
    },
    //返现审核cashSearchData
    searchCashList({ commit, state }, a) {
        state.cashSearchData.limit = state.limit
        state.cashSearchData.username = state.username;
        for (var key in a) {
            for (var k in state.cashSearchData) {
                if (key == k) {
                    state.cashSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/finance/cashBack', state.cashSearchData).then(function(data) {
            commit('searchCashList', data.body.data)
        })
    },

    //返量审核 quantitySearchData
    searchQuantityList({ commit, state }, a) {
        state.quantitySearchData.limit = state.limit
        state.quantitySearchData.username = state.username;
        for (var key in a) {
            for (var k in state.quantitySearchData) {
                if (key == k) {
                    state.quantitySearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/Finance/returnAmount', state.quantitySearchData).then(function(data) {
            commit('searchQuantityList', data.body.data)
        })
    },

    //退款审核 refundSearchData

    searchRefundList({ commit, state }, a) {
        state.refundSearchData.limit = state.limit
        state.refundSearchData.username = state.username
        for (var key in a) {
            for (var k in state.refundSearchData) {
                if (key == k) {
                    state.refundSearchData[key] = a[key]
                }
            }
        }

        vm.$http.post('/finance/refundList', state.refundSearchData).then(function(data) {
            commit('searchRefundList', data.body.data)
        })
    },
    /*财务管理*/
};

const getters = {
    searchUsername(state) {
        return state.username
    },
    /*客户管理*/
    //客户池
    allcusLists(state) {
        return state.allcusLists
    },
    //成为签约客户
    signed(state) {
        return state.signed
    },
    //已成交客户
    dealLists(state) {
        return state.dealLists
    },
    //客户更近记录列表
    recordLists(state) {
        return state.recordLists
    },
    //公共客户池
    commonLists(state) {
        return state.commonLists
    },
    /*客户管理*/

    /*销售管理*/
    //销售方案列表
    schemeLists(state) {
        return state.schemeLists
    },

    //销售目标
    targetLists(state) {
        return state.targetLists
    },
    //销售转化
    tranLists(state) { //列表
        return state.tranLists
    },
    tranTopData(state) { //头部
        return state.tranTopData
    },
    //员工管理列表
    manageLists(state) {
        return state.manageLists
    },
    /*销售管理*/

    /*业务管理*/

    //需求单管理
    demandLists(state) {
        return state.demandLists
    },

    //订单管理
    indentLists(state) {
        return state.indentLists
    },

    //数据报表
    reportLists(state) {
        return state.reportLists
    },

    //合同管理
    contractLists(state) {
        return state.contractLists
    },
    /*业务管理*/

    /*财务管理*/
    auditLists(state) {
        return state.auditLists
    },
    //返现审核
    cashLists(state) {
        return state.cashLists
    },
    //返量审核 quantityLists
    quantityLists(state) {
        return state.quantityLists
    },

    //退款审核 refundLists
    refundLists(state) {
        return state.refundLists
    },
    /*财务管理*/

    /*全部state*/
    all_state(state) {
        return state
    },
};


//需要导出Store对象
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});

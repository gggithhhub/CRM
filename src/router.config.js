import Home from './components/home/Home.vue'

import Customer from './components/customer/Customer.vue'
import Allcus from './components/customer/Allcus.vue'
import AddCus from './components/customer/AddCus.vue'
import Details from './components/customer/Details.vue'
import Deal from './components/customer/Deal.vue'
import Record from './components/customer/Record.vue'
import Compile from './components/customer/Compile.vue'
import Bianji from './components/customer/Bianji.vue'
import Common from './components/customer/Common.vue'

import Market from './components/market/Market.vue'
import Scheme from './components/market/Scheme.vue'
import Transition from './components/market/Transition.vue'
import Target from './components/market/Target.vue'
import Performance from './components/market/Performance.vue'
import Manage from './components/market/Manage.vue'
import Redact from './components/market/Redact.vue'

import Business from './components/business/Business.vue'
import Demand from './components/business/Demand.vue'
import Indent from './components/business/Indent.vue'
import AddIndent from './components/business/AddIndent.vue'
import AddReport from './components/business/AddReport.vue'
import Contract from './components/business/Contract.vue'
import AddDemand from './components/business/AddDemand.vue'
import Report from './components/business/Report.vue'


import Active from './components/business/customer/Active.vue'
import Consume from './components/business/customer/Consume.vue'
import Recharge from './components/business/customer/Recharge.vue'

import Commission from './components/business/market/Commission.vue'
import CommissionDetail from './components/business/market/CommissionDetail.vue'
import DemandTable from './components/business/market/DemandTable.vue'
import PremiumDown from './components/business/market/PremiumDown.vue'
import PremiumUp from './components/business/market/PremiumUp.vue'

import Accounting from './components/business/finace/Accounting.vue'
import Check from './components/business/finace/Check.vue'



import Finace from './components/finace/Finace.vue'
import Audit from './components/finace/Audit.vue'
import returnCash from './components/finace/returnCash.vue'
import detailCash from './components/finace/detailCash.vue'
import addCash from './components/finace/addCash.vue'
import returnQuantity from './components/finace/returnQuantity.vue'
import addQuantity from './components/finace/addQuantity.vue'
import detailQuantity from './components/finace/detailQuantity.vue'
import refund from './components/finace/refund.vue'
import addRefund from './components/finace/addRefund.vue'
import detailDefund from './components/finace/detailDefund.vue'

import System from './components/system/System.vue'
import Juri from './components/system/Juri.vue'
import DefaultPms from './components/system/DefaultPms.vue'
import ModifyPms from './components/system/ModifyPms.vue'

export default [{
    path: '/home',
    component: Home
}, {
    path: '/customer',
    component: Customer,

    children: [{
        path: 'allcus',
        component: Allcus,
    }, {
        path: 'deal',
        component: Deal
    }, {
        path: 'deal/details',
        name: 'dealDetails',
        component: Details
    }, {
        path: 'allcus/add',
        component: AddCus
    }, {
        path: 'allcus/details',
        name: 'allcusDetails',
        component: Details
    }, {
        path: 'record',
        component: Record
    }, {
        path: 'record/details',
        name: 'recordDetails',
        component: Details
    }, {
        path: 'record/Compile',
        name: 'Compile',
        component: Compile
    }, {
        path: 'detail/bianji',
        name: 'Bianji',
        component: Bianji
    }, {
        path: 'common',
        component: Common
    }, {
        path: '/customer',
        redirect: '/customer/allcus'
    }]
}, {
    path: '/market',
    component: Market,
    children: [{
        path: 'scheme',
        component: Scheme,
    }, {
        path: 'transition',
        component: Transition
    }, {
        path: 'target',
        component: Target
    }, {
        path: 'performance',
        component: Performance
    }, {
        path: 'manage',
        component: Manage
    }, {
        path: 'scheme/redact',
        name: 'redact',
        component: Redact
    }, {
        path: '/market',
        redirect: '/market/scheme'
    }]
}, {
    path: '/business',
    component: Business,
    children: [{
        path: 'demand',
        component: Demand
    }, {
        path: 'indent',
        component: Indent
    }, {
        path: 'indent/AddIndent',
        component: AddIndent,
        name: 'AddIndent'
    }, {
        path: 'indent/AddReport',
        component: AddReport,
        name: 'AddReport'
    }, {
        path: 'report',
        component: Report
    }, {
        path: 'report/active',
        component: Active
    }, {
        path: 'report/consume',
        component: Consume
    }, {
        path: 'report/recharge',
        component: Recharge
    }, {
        path: 'report/commission',
        component: Commission
    }, {
        path: 'report/commissionDetail',
        component: CommissionDetail,
        name: 'CommissionDetail'
    }, {
        path: 'report/demandTable',
        component: DemandTable,
        name: 'DemandTable'
    }, {
        path: 'report/premiumDown',
        component: PremiumDown
    }, {
        path: 'report/premiumUp',
        component: PremiumUp
    }, {
        path: 'report/accounting',
        component: Accounting
    }, , {
        path: 'report/check',
        component: Check
    }, {
        path: 'contract',
        component: Contract
    }, {
        path: 'demand/addDemand',
        component: AddDemand,
        name: 'AddDemand'
    }, {
        path: 'demand/redDemand',
        component: AddDemand,
        name: 'redDemand'
    }, {
        path: 'demand/changeDemand',
        component: AddDemand,
        name: 'changeDemand'
    }, {
        path: '/business',
        redirect: '/business/demand'
    }]
}, {
    path: '/finace',
    component: Finace,
    children: [{
        path: 'audit',
        component: Audit
    }, {
        path: 'returnCash',
        component: returnCash
    }, {
        path: 'returnCash/detailCash',
        component: detailCash,
        name: 'detailCash'
    }, {
        path: 'returnCash/addCash',
        component: addCash,
        name: 'addCash'
    }, {
        path: 'returnQuantity',
        component: returnQuantity
    }, {
        path: 'returnQuantity/addQuantity',
        component: addQuantity,
        name: 'addQuantity',
    }, {
        path: 'returnQuantity/detailQuantity',
        component: detailQuantity,
        name: 'detailQuantity'
    }, {
        path: 'refund',
        component: refund
    }, {
        path: 'refund/addRefund',
        component: addRefund,
        name: 'addRefund',
    }, {
        path: 'refund/editRefund',
        component: addRefund,
        name: 'editRefund'
    }, {
        path: 'refund/detailDefund',
        component: detailDefund,
        name: 'detailDefund'
    }, {
        path: '/finace',
        redirect: '/finace/audit'
    }]
}, {
    path: '/system',
    component: System,
    children: [{
        path: 'juri',
        component: Juri,
        children: [{
            path: 'defaultPms',
            name: 'defaultPms',
            component: DefaultPms
        }, {
            path: 'modifyPms',
            component: ModifyPms
        }, {
            path: '/system',
            redirect: '/system/juri'
        }]
    }]
}, {
    path: '*',
    redirect: '/home'
}]

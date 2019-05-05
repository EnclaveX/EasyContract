import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home/Home'
import Auth from '@/components/auth/Auth'
import Contract from '@/components/contract/Contract'
import ContractSign from '@/components/contract/ContractSign'
import ContractQuery from '@/components/contract/ContractQuery'
import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}, {
    name: 'contract',
    path: '/contract/:id',
    component: Contract
},
{
    name: 'contractSign',
    path: '/contractSign/:id',
    component: ContractSign
},
{
    name: 'contractQuery',
    path: '/contracts',
    component: ContractQuery
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router

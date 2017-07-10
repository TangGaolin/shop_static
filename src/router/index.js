import Vue from 'vue'
import Router from 'vue-router'


import store from '../store'

const Login = resolve       => require(['../pages/Login'], resolve)

const Header = resolve      => require(['../pages/header'], resolve)
const Index = resolve       => require(['../pages/Index'], resolve)

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            component: Header,
            redirect: '/index',
            name: '首页',
            children: [
                {
                    path: 'index',
                    component: Index
                }
            ]
        },
        {
            path: '/orderList',
            component: Header,
            name: '审核交班',
            children: [
                {
                    path: 'index',
                    component: Index
                }
            ]
        }
  ]
})


router.beforeEach((to, from, next) => {
    var account = store.state.account
    console.log(store.state.account)

    if(to.path === '/login') {
        return next()
    }

    if (typeof(account.userInfo) === "undefined") {
        return next(`/login?redirect=${encodeURIComponent(to.path)}`)
    }else {
        return next()
    }

})

router.afterEach(transition => {

});

export default router

import Vue from 'vue'
import Router from 'vue-router'


import store from '../store'

const Login =           resolve  => require(['../pages/Login'], resolve)
const Layout =          resolve  => require(['../pages/Layout'], resolve)
const dashboard =       resolve  => require(['../pages/dashboard'], resolve)
const UserController =  resolve  => require(['../pages/UserController'], resolve)

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
            component: Layout,
            redirect: '/dashboard',
            name: '首页',
            children: [
                {
                    path: 'dashboard',
                    name: "dashboard",
                    component: dashboard
                },
                {
                    path: 'user-controller',
                    name: "userController",
                    component: UserController
                }
            ]
        },
        {
            path: '/orderList',
            component: Layout,
            name: '交班审核',
            children: [
                {
                    path: 'index',
                    component: UserController
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

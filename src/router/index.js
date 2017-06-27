import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'


const Login = resolve       => require(['../pages/Login'], resolve)
const Index = resolve       => require(['../pages/Index'], resolve)

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'index',
            component: Index
        }
  ]
})

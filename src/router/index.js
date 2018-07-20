import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const entry = {
  index: r => require.ensure([], () => r(require('../components/entry/index')), 'otcMobile'),
  register: r => require.ensure([], () => r(require('../components/entry/register')), 'otcMobile'),
  login: r => require.ensure([], () => r(require('../components/entry/login')), 'otcMobile'),
  forgetPassword: r => require.ensure([], () => r(require('../components/entry/forgetPassword')), 'otcMobile'),
  modifyPassword: r => require.ensure([], () => r(require('../components/entry/modifyPassword')), 'otcMobile')
}
const page = {
  error: r => require.ensure([], () => r(require('../components/page/error')), 'otcMobile'),
  notFound: r => require.ensure([], () => r(require('../components/page/notFound')), 'otcMobile')
}
const trade = {
  index: r => require.ensure([], () => r(require('../components/trade/index')), 'otcMobile')
}
const routers = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/entry',
    component: entry.index,
    children: [
      {
        path: 'login',
        alias: ['/login', '/user/login', '/entry'],
        component: entry.login
      },
      {
        path: 'register',
        alias: ['/register', '/user/register'],
        component: entry.register
      },
      {
        path: 'forgetPassword',
        alias: '/forgetPassword',
        component: entry.forgetPassword
      },
      {
        path: 'modifyPassword',
        alias: '/modifyPassword',
        component: entry.modifyPassword
      }
    ]
  },
  {
    path: '/trade',
    component: trade.index,
    children: [
    ]
  },
  {
    path: '/error',
    component: page.error
  },
  {
    path: '*',
    component: page.notFound
  }
]
const router = new VueRouter({
  mode: 'history',
  routes: routers
})
export default router

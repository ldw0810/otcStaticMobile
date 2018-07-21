import Vue from 'vue'
import VueRouter from 'vue-router'
import {Indicator} from 'mint-ui'
import store from '../store'

Vue.use(VueRouter)
const entry = {
  index: r => require.ensure([], () => r(require('../components/entry/index')), 'otcMobile'),
  register: r => require.ensure([], () => r(require('../components/entry/register')), 'otcMobile'),
  login: r => require.ensure([], () => r(require('../components/entry/login')), 'otcMobile'),
  forgetPassword: r => require.ensure([], () => r(require('../components/entry/forgetPassword')), 'otcMobile'),
  modifyPassword: r => require.ensure([], () => r(require('../components/entry/modifyPassword')), 'otcMobile')
}
const page = {
  home: r => require.ensure([], () => r(require('../components/page/home')), 'otcMobile'),
  error: r => require.ensure([], () => r(require('../components/page/error')), 'otcMobile'),
  notFound: r => require.ensure([], () => r(require('../components/page/notFound')), 'otcMobile')
}
const trade = {
  index: r => require.ensure([], () => r(require('../components/trade/index')), 'otcMobile')
}
const routers = [
  {
    path: '/',
    component: page.home,
    meta: {
      needLogin: true
    },
    children: [
      {
        path: 'trade',
        component: trade.index,
        meta: {
          tarbarIndex: 0
        },
        children: []
      }
    ]
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
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin && !store.state.userToken) { // 用户界面都需要登录
    next({
      path: '/login'
    })
  } else {
    next()
  }
})
router.afterEach((to, from) => {
  if (to.meta.initAxios) { // initAxios 初始化页面时有接口请求
    Indicator.open({
      text: '',
      spinnerType: 'snake'
    })
  }
  window.scrollTo(0, 0)
  if (window.gtag) {
    window.gtag('event', to.fullPath, {
      from: from.fullPath,
      to: to.fullPath
    })
  }
})
export default router

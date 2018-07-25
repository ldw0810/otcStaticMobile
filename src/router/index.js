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
  index: r => require.ensure([], () => r(require('../components/trade/index')), 'otcMobile'),
  adList: r => require.ensure([], () => r(require('../components/trade/adList')), 'otcMobile'),
  adDetail: r => require.ensure([], () => r(require('../components/trade/adDetail')), 'otcMobile'),
  order: r => require.ensure([], () => r(require('../components/trade/order')), 'otcMobile')
}
const me = {
  userCenter: r => require.ensure([], () => r(require('../components/me/userCenter')), 'otcMobile'),
  authEmail: r => require.ensure([], () => r(require('../components/me/authEmail')), 'otcMobile'),
  about: r => require.ensure([], () => r(require('../components/me/about')), 'otcMobile'),
  changeLanguage: r => require.ensure([], () => r(require('../components/me/changeLanguage')), 'otcMobile'),
  settings: r => require.ensure([], () => r(require('../components/me/settings')), 'otcMobile'),
  addCollection: r => require.ensure([], () => r(require('../components/me/addCollection')), 'otcMobile'),
  addAlipay: r => require.ensure([], () => r(require('../components/me/addAlipay')), 'otcMobile'),
  addBankcard: r => require.ensure([], () => r(require('../components/me/addBankcard')), 'otcMobile'),
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
          tabbarIndex: 0
        },
        children: [
          {
            path: 'buy',
            alias: ['/buy'],
            component: trade.adList,
            meta: {
              navbarIndex: 0
            }
          },
          {
            path: 'sell',
            alias: ['/sell'],
            component: trade.adList,
            meta: {
              navbarIndex: 1
            }
          },
          {
            path: 'order',
            alias: ['/order'],
            component: trade.order,
            meta: {
              navbarIndex: 2
            }
          }
        ]
      },
      {
        path: 'me',
        meta: {
          tabbarIndex: 2
        },
        component: me.userCenter
      }
    ]
  },
  {
    path: '/detail',
    component: trade.adDetail
  },
  {
    path: '/me/authEmail',
    component: me.authEmail
  },
  {
    path: '/me/about',
    component: me.about
  },
  {
    path: '/me/changeLanguage',
    component: me.changeLanguage
  },
  {
    path: '/me/settings',
    component: me.settings
  },
  {
    path: '/me/addCollection',
    component: me.addCollection
  },
  {
    path: '/me/addCollection/addAlipay',
    component: me.addAlipay
  },
  {
    path: '/me/addCollection/addBankcard',
    component: me.addBankcard
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
  Indicator.open({
    text: '',
    spinnerType: 'snake'
  })
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
    Indicator.close()
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

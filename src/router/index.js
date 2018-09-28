import Vue from 'vue'
import VueRouter from 'vue-router'
import {Indicator} from 'mint-ui'
import store from '../store'
import languageData from '../locale'
import {$getLanguage, $title} from '../utils'

const language = languageData.find(
  item => item.language === $getLanguage()
).data

Vue.use(VueRouter)

const entry = {
  index: r => require.ensure([], () => r(require('../components/entry/index'))),
  register: r => require.ensure([], () => r(require('../components/entry/register'))),
  login: r => require.ensure([], () => r(require('../components/entry/login'))),
  forgetPassword: r => require.ensure([], () => r(require('../components/entry/forgetPassword'))),
  modifyPassword: r => require.ensure([], () => r(require('../components/entry/modifyPassword')))
}
const page = {
  mainPage: r => require.ensure([], () => r(require('../components/page/mainPage'))),
  home: r => require.ensure([], () => r(require('../components/page/home'))),
  error: r => require.ensure([], () => r(require('../components/page/error'))),
  notFound: r => require.ensure([], () => r(require('../components/page/notFound')))
}
const trade = {
  index: r => require.ensure([], () => r(require('../components/trade/index'))),
  adList: r => require.ensure([], () => r(require('../components/trade/adList'))),
  adDetail: r => require.ensure([], () => r(require('../components/trade/adDetail'))),
  adShare: r => require.ensure([], () => r(require('../components/trade/adShare'))),
  orderList: r => require.ensure([], () => r(require('../components/trade/orderList'))),
  order: r => require.ensure([], () => r(require('../components/trade/order'))),
  myAd: r => require.ensure([], () => r(require('../components/trade/myAd')))
}
const asset = {
  index: r => require.ensure([], () => r(require('../components/asset/index'))),
  assetDetail: r => require.ensure([], () => r(require('../components/asset/assetDetail'))),
  assetHistory: r => require.ensure([], () => r(require('../components/asset/assetHistory')))
}
const me = {
  userCenter: r => require.ensure([], () => r(require('../components/me/userCenter'))),
  authEmail: r => require.ensure([], () => r(require('../components/me/authEmail'))),
  about: r => require.ensure([], () => r(require('../components/me/about'))),
  changeLanguage: r => require.ensure([], () => r(require('../components/me/changeLanguage'))),
  settings: r => require.ensure([], () => r(require('../components/me/settings'))),
  addCollection: r => require.ensure([], () => r(require('../components/me/addCollection'))),
  addAlipay: r => require.ensure([], () => r(require('../components/me/addAlipay'))),
  addBankcard: r => require.ensure([], () => r(require('../components/me/addBankcard'))),
  collectionList: r => require.ensure([], () => r(require('../components/me/collectionList'))),
  modifyPassword: r => require.ensure([], () => r(require('../components/me/modifyPassword'))),
  authPhone: r => require.ensure([], () => r(require('../components/me/authPhone'))),
  addGoogle: r => require.ensure([], () => r(require('../components/me/addGoogle'))),
  authGoogle: r => require.ensure([], () => r(require('../components/me/authGoogle')))
  // invite: r => require.ensure([], () => r(require('../components/me/invite')))
}
const routers = [
  {
    path: '/',
    redirect: '/buy',
    component: page.mainPage,
    meta: {
      needLogin: true
    },
    children: [
      {
        path: '/home',
        redirect: '/buy',
        component: page.home,
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
                  navbarIndex: 0,
                  needLogin: false
                }
              },
              {
                path: 'sell',
                alias: ['/sell'],
                component: trade.adList,
                meta: {
                  navbarIndex: 1,
                  needLogin: false
                }
              },
              {
                path: 'myAd',
                alias: ['/myAd', '/myAds'],
                component: trade.myAd,
                meta: {
                  navbarIndex: 2
                }
              },
              {
                path: 'orderList',
                alias: ['/orderList'],
                component: trade.orderList,
                meta: {
                  navbarIndex: 3
                }
              }
            ]
          },
          {
            path: 'asset',
            alias: ['/asset'],
            meta: {
              tabbarIndex: 1
            },
            component: asset.index
          },
          {
            path: 'me',
            alias: ['/me'],
            meta: {
              tabbarIndex: 2
            },
            component: me.userCenter
          }
        ]
      },
      {
        path: '/adDetail',
        alias: ['/ad'],
        component: trade.adDetail
      },
      {
        path: '/adShare',
        component: trade.adShare
      },
      {
        path: '/assetDetail',
        component: asset.assetDetail
      },
      {
        path: '/assetHistory',
        component: asset.assetHistory
      },
      {
        path: '/order',
        alias: ['/orderDetail'],
        component: trade.order
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
        path: '/me/collectionList',
        component: me.collectionList
      },
      {
        path: '/me/modifyPassword',
        component: me.modifyPassword
      },
      {
        path: '/me/authPhone',
        component: me.authPhone
      },
      {
        path: '/me/addGoogle',
        component: me.addGoogle
      },
      {
        path: '/me/authGoogle',
        component: me.authGoogle
      }
      // {
      //   path: '/me/invite',
      //   alias: '/invite',
      //   component: me.invite
      // }
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
        alias: ['/forgetPassword', '/user/forgetPassword'],
        component: entry.forgetPassword
      },
      {
        path: 'modifyPassword',
        alias: ['/modifyPassword', '/user/modifyPassword'],
        component: entry.modifyPassword
      }
    ]
  },
  {
    path: '/error',
    meta: {
      error: 2
    },
    component: page.error
  },
  {
    path: '*',
    meta: {
      error: 1
    },
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
  // 页面标题
  if (to.meta.error !== from.meta.error) {
    if (to.meta.error === 1) {
      $title(language.public.not_found)
    } else if (to.meta.error === 2) {
      $title(language.public.server_maintenance)
    } else {
      $title()
    }
  }
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

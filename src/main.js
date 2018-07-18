// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import vuexI18n from 'vuex-i18n'
import store from './store'
import {$getLanguage} from './utils'
import install from './utils/install'
import languageDataList from './locale'
import './style/index.styl'

Vue.config.productionTip = false
Vue.use(install)
Vue.use(vuexI18n.plugin, store)
// Vue.use(VueLazyLoad, {
//   preLoad: 1.3,
//   error: require('../src/assets/images/common/logo.svg'),
//   loading: require('../src/assets/images/common/logo.svg'),
//   attempt: 1
// })
// 自动设置语言
for (let i = 0; i < languageDataList.length; i++) {
  Vue.i18n.add(languageDataList[i].language, languageDataList[i].data)
}
// 自动设置语言
Vue.i18n.set($getLanguage())

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

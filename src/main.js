// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import vuexI18n from 'vuex-i18n'
import VueClipboard from 'vue-clipboard2'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import {$getLanguage} from './utils'
import filters from './utils/filters'
import install from './utils/installs'
import languageDataList from './locale'
import './style/index.styl'

Vue.config.productionTip = false
Vue.use(install)
Vue.use(vuexI18n.plugin, store)
Vue.use(VueClipboard)
Vue.use(VueLazyLoad)
// 存储token
if (localStorage.getItem('userToken') && !store.state.userToken) {
  store.commit('saveToken', localStorage.getItem('userToken'))
}
// 自动设置语言
for (let i = 0; i < languageDataList.length; i++) {
  Vue.i18n.add(languageDataList[i].language, languageDataList[i].data)
}
Vue.i18n.set($getLanguage())
// filters
Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

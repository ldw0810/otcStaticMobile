import axios from 'axios'
import store from '../store'
import router from '../router'
import languageDataList from '../locale'
import {$getLanguageIndex} from '../utils'
import {Toast} from 'mint-ui'

const configure = require('../../configure')

/**
 * Responsible for all HTTP requests.
 */
axios.defaults.timeout = configure.axios_TIMEOUT
axios.defaults.baseURL = configure.axios_BASEURL

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (store.state.userToken) {
      config.headers.Authorization = `${store.state.userToken}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器

const showAxiosError = (errorCode) => {
  const errMsg = languageDataList[$getLanguageIndex()].data.request['' + errorCode]
  if (+errorCode) {
    if ([999999, 100039].indexOf(+errorCode) > -1) {
      store.commit('delToken')
      errMsg && Toast({
        message: errMsg,
        iconClass: 'icon icon-error'
      })
      router.push('/login')
    } else if ([100002, 100017, 100021, 100036, 100038].indexOf(+errorCode) === -1) {
      errMsg && Toast({
        message: errMsg,
        iconClass: 'icon icon-error'
      })
      if (+errorCode === 100031) {
        // store.commit("showAuthEmail_setter", 1);
      }
    }
  }
}
axios.interceptors.response.use(
  response => {
    showAxiosError(+response.data.error)
    return response
  },
  error => {
    if (error.response) {
      showAxiosError(+error.response.data.error)
    } else if (error.message) {
      error.response = {
        data: error.message
      }
    }
    return Promise.reject(error.response.data)
  })

export default axios

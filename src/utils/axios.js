import axios from 'axios'
import store from '../store'
// import router from '../router'
// import languageData from '../locale'

const configure = require('../../configure')

/**
 * Responsible for all HTTP requests.
 */

axios.defaults.timeout = 20000
axios.defaults.baseURL = configure.axios_BASEURL

// function languageSelectIndex () {
//   let index = 0
//   for (let i = 0; i < languageData.length; i++) {
//     if (languageData[i].language === (window.localStorage.getItem('language') || configure.DEFAULT_LANGUAGE)) {
//       index = i
//     }
//   }
//   return index
// }

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

const showaxiosError = (errorCode) => {
  // const index = languageSelectIndex()
  // const errMsg = languageData[index].data.request['' + errorCode]
  if (+errorCode) {
    if (+errorCode === 999999) {
      store.commit('delToken')
      // Alert.error({
      //   title: languageData[index].data.public.error_title_default,
      //   content: languageData[index].data.request['' + +errorCode],
      //   onCancel: router.push('/user/login')
      // })
    } else if (+errorCode === 100031) {
      // store.commit("showAuthEmail_setter", 1);
    } else if (+errorCode === 100039) {
      // errMsg && Alert.error({
      //   title: languageData[index].data.public.error_title_default,
      //   content: errMsg,
      //   onCancel: router.push('/user/login')
      // })
    } else if ([100002, 100017, 100021, 100030, 100033, 100036, 100038].contains(+errorCode)) {
    } else {
      // errMsg && Alert.error({
      //   title: languageData[index].data.public.error_title_default,
      //   content: errMsg
      // })
    }
  }
}
axios.interceptors.response.use(
  response => {
    showaxiosError(response.data.error)
    return response
  },
  error => {
    if (error.response) {
      showaxiosError(error.response.data.error)
    } else if (error.message) {
      error.response = {
        data: error.message
      }
    }
    return Promise.reject(error.response.data)
  })

export default axios

import axios from '../utils/axios'
import qs from 'qs' // post请求转码
import store from './index'
import {Indicator} from 'mint-ui'
import configure from '../../configure'

const http = {
  get: function (url, requestJson, config) {
    return new Promise((resolve, reject) => {
      axios.get(url, Object.assign({params: requestJson}, config)).then(res => {
        Indicator.close()
        resolve(res)
      }).catch(err => {
        Indicator.close()
        reject(err)
      })
    })
  },
  post: function (url, requestJson, config) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(Object.assign(requestJson, config))).then(res => {
        Indicator.close()
        resolve(res)
      }).catch(err => {
        Indicator.close()
        reject(err)
      })
    })
  },
  put: function (url, requestJson, config) {
    return new Promise((resolve, reject) => {
      axios.put(url, qs.stringify(Object.assign(requestJson, config))).then(res => {
        Indicator.close()
        resolve(res)
      }).catch(err => {
        Indicator.close()
        reject(err)
      })
    })
  },
  delete: function (url, requestJson, config) {
    return new Promise((resolve, reject) => {
      axios.delete(url, Object.assign({params: requestJson}, config)).then(res => {
        Indicator.close()
        resolve(res)
      }).catch(err => {
        Indicator.close()
        reject(err)
      })
    })
  }
}
export default {
  // axios
  // get
  axios_captcha_server ({commit}, requestData = {}) {
    return http.get('/api/v1/common/captcha_server.json', requestData)
  },
  axios_verified_email ({commit}, requestData = {}) {
    return http.get('/api/v1/members/verified_email.json', requestData)
  },
  axios_verified_nickname ({commit}, requestData = {}) {
    return http.get('/api/v1/members/verified_nickname.json', requestData)
  },
  axios_me ({commit}, requestData = {}) {
    let source = axios.CancelToken.source()
    store.commit('axiosCancel_setter', {
      me: source
    })
    return new Promise((resolve, reject) => {
      http.get('/api/v1/members/me.json', requestData, {
        cancelToken: source.token
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          commit('userInfo_setter', res.data.member)
        } else {
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  axios_notice ({commit}, requestData = {}) {
    return http.get('/api/v1/members/notice.json', requestData)
  },
  axios_national_list ({commit}, requestData = {}) {
    return http.get('/api/v1/two_factor/national_list.json', requestData)
  },
  axios_invited_detail ({commit}, requestData = {}) {
    return http.get('/api/v1/members/invited_detail.json', requestData)
  },
  axios_invited_activity ({commit}, requestData = {}) {
    return http.get('/api/v1/members/invited_activity.json', requestData)
  },
  axios_banks ({commit}, requestData = {}) {
    return http.get('/api/v1/common/banks.json', requestData)
  },
  axios_get_receiving ({commit}, requestData = {}) {
    return http.get('/api/v1/common/receiving.json', requestData)
  },
  axios_get_deposit ({commit}, requestData = {}) {
    return http.get('/api/v1/funds/deposit.json', requestData)
  },
  axios_get_withdraw ({commit}, requestData = {}) {
    return http.get('/api/v1/funds/withdraw.json', requestData)
  },
  axios_order_list ({commit}, requestData = {}) {
    return http.get('/api/v1/order/list.json', requestData)
  },
  axios_order_info ({commit}, requestData = {}) {
    return http.get('/api/v1/order/info.json', requestData)
  },
  axios_me_nft ({commit}, requestData = {}) {
    return http.get('/api/v1/nft/me.json', requestData)
  },
  axios_ads_main ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/main.json', requestData)
  },
  axios_ads ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/list.json', requestData)
  },
  axios_ads_my ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/my.json', requestData)
  },
  axios_pay_collections ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/pay_collections.json', requestData)
  },
  axios_get_ad ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/ad.json', requestData)
  },
  axios_exam_ad ({commit}, requestData = {}) {
    return http.get('/api/v1/otc/ex_ad.json', requestData)
  },
  axios_currency_code ({commit}, requestData = {}) {
    return new Promise((resolve, reject) => {
      http.get('/api/v1/currency/code.json', requestData).then(res => {
        if (res.data && +res.data.error === 0) {
          store.commit('code_setter', res.data)
        } else {
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  axios_trade_price ({commit}, requestData = {}) {
    return http.get('/api/v1/currency/trade_price.json', requestData)
  },
  axios_zendesk ({commit}, requestData = {}) {
    return http.get('/api/v1/common/zendesk.json', requestData)
  },
  axios_chat ({commit}, requestData = {}) {
    let source = axios.CancelToken.source()
    store.commit('axiosCancel_setter', {
      chat: source
    })
    return http.get(configure.CHAT_URL, requestData, {
      timeout: 90000,
      cancelToken: source.token
    })
  },
  axios_announcements ({commit}, requestData = {}) {
    return http.get('/api/v1/common/announcements', requestData)
  },
  axios_language ({commit}, requestData = {}) {
    return http.get('/api/v1/common/ln.json', requestData)
  },
  axios_banner ({commit}, requestData = {}) {
    return http.get('/api/v1/common/banner.json', requestData)
  },
  axios_search ({commit}, requestData = {}) {
    return http.get('/api/v1/common/search.json', requestData)
  },
  // post
  axios_register ({commit}, requestData) {
    return http.post('/api/v1/members/reg.json', requestData)
  },
  axios_login ({commit}, requestData = {}) {
    return http.post('/api/v1/members/login.json', requestData)
  },
  axios_login_verify ({commit}, requestData = {}) {
    return http.post('/api/v1/members/login_verify.json', requestData)
  },
  axios_sms_auth ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/sms_auth.json', requestData)
  },
  axios_refresh ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/refresh.json', requestData)
  },
  axios_verify_code ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/verify_code.json', requestData)
  },
  axios_google_auth ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/google_auth.json', requestData)
  },
  axios_bind_google ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/bind_google.json', requestData)
  },
  axios_unbind_google ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/unbind_google.json', requestData)
  },
  axios_unbind_sms ({commit}, requestData = {}) {
    return http.post('/api/v1/two_factor/unbind_sms.json', requestData)
  },
  axios_update_password ({commit}, requestData = {}) {
    return http.post('/api/v1/members/update_password.json', requestData)
  },
  axios_send_forget_mail ({commit}, requestData = {}) {
    return http.post('/api/v1/members/send_forget_mail.json', requestData)
  },
  axios_forget_password ({commit}, requestData = {}) {
    return http.post('/api/v1/members/forget_password.json', requestData)
  },
  axios_verified_token ({commit}, requestData = {}) {
    return http.get('/api/v1/members/verified_token.json', requestData)
  },
  axios_update_nickname ({commit}, requestData = {}) {
    return http.post('/api/v1/members/update.json', requestData)
  },
  axios_logout ({commit}, requestData = {}) {
    return http.post('/api/v1/members/logout.json', requestData)
  },
  axios_send_activation ({commit}, requestData = {}) {
    return http.post('/api/v1/members/send_activation.json', requestData)
  },
  axios_email_verified ({commit}, requestData = {}) {
    return http.post('/api/v1/members/email_verified.json', requestData)
  },
  axios_add_ad ({commit}, requestData = {}) {
    return http.post('/api/v1/otc/ad.json', requestData)
  },
  axios_add_receiving ({commit}, requestData = {}) {
    return http.post('/api/v1/common/receiving.json', requestData)
  },
  axios_gen_address ({commit}, requestData = {}) {
    return http.post('/api/v1/funds/gen_address.json', requestData)
  },
  axios_withdraw ({commit}, requestData = {}) {
    return http.post('/api/v1/funds/withdraw.json', requestData)
  },
  axios_order_buy ({commit}, requestData = {}) {
    return http.post('/api/v1/order/buy.json', requestData)
  },
  axios_order_cancel ({commit}, requestData = {}) {
    return http.post('/api/v1/order/cancel_pay.json', requestData)
  },
  axios_order_pay ({commit}, requestData = {}) {
    return http.post('/api/v1/order/complete_pay.json', requestData)
  },
  axios_order_release ({commit}, requestData = {}) {
    return http.post('/api/v1/order/complete_release.json', requestData)
  },
  axios_order_evaluate ({commit}, requestData = {}) {
    return http.post('/api/v1/order/evaluate.json', requestData)
  },
  axios_add_fund_sources ({commit}, requestData = {}) {
    return http.post('/api/v1/fund_sources.json', requestData)
  },
  axios_resend_confirm ({commit}, requestData = {}) {
    return http.post('/api/v1/funds/resend_confirming.json', requestData)
  },
  axios_send_msg ({commit}, requestData = {}) {
    return http.post('/api/v1/otc/send.json', requestData)
  },
  // put方式
  axios_update_receiving ({commit}, requestData = {}) {
    return http.put('/api/v1/common/receiving.json', requestData)
  },
  axios_default_receiving ({commit}, requestData = {}) {
    return http.put('/api/v1/common/default_receiving.json', requestData)
  },
  axios_update_ad ({commit}, requestData = {}) {
    return http.put('/api/v1/otc/ad.json', requestData)
  },
  axios_update_ad_status ({commit}, requestData = {}) {
    return http.put('/api/v1/otc/ad_status.json', requestData)
  },
  axios_withdraw_confirm ({commit}, requestData = {}) {
    return http.put('/api/v1/funds/withdraw.json', requestData)
  },
  axios_set_default_fund_sources ({commit}, requestData = {}) {
    return http.put('/api/v1/fund_sources.json', requestData)
  },
  // delete方式
  axios_del_receiving ({commit}, requestData = {}) {
    return http.delete('/api/v1/common/delete_receiving.json', requestData)
  },
  axios_withdraw_cancel ({commit}, requestData = {}) {
    return http.delete('/api/v1/funds/withdraw.json', requestData)
  },
  axios_del_fund_sources ({commit}, requestData = {}) {
    return http.delete('/api/v1/fund_sources.json', requestData)
  }
}

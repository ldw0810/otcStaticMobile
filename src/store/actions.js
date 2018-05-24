import ajax from '../libs/ajax';
import queryString from 'querystring';   //post请求转码
import store from '../store/store';
import {CHAT_URL} from 'config/config';

const http = {
    get: function (url, requestJson, config) {
        return new Promise((resolve, reject) => {
            ajax.get(url, Object.assign({params: requestJson}, config)).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    },
    post: function (url, requestJson, config) {
        return new Promise((resolve, reject) => {
            ajax.post(url, queryString.stringify(Object.assign(requestJson, config))).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    },
    put: function (url, requestJson, config) {
        return new Promise((resolve, reject) => {
            ajax.put(url, queryString.stringify(Object.assign(requestJson, config))).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    },
    delete: function (url, requestJson, config) {
        return new Promise((resolve, reject) => {
            ajax.delete(url, Object.assign({params: requestJson}, config)).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    },
};
export default {
  //ajax
  //get
    ajax_captcha_server({commit}, requestData = {}) {
        return http.get('/api/v1/common/captcha_server.json', requestData);
    },
    ajax_verified_email({commit}, requestData = {}) {
        return http.get('/api/v1/members/verified_email.json', requestData);
    },
    ajax_verified_nickname({commit}, requestData = {}) {
        return http.get('/api/v1/members/verified_nickname.json', requestData);
    },
    ajax_me({commit}, requestData = {}) {
        let source = ajax.CancelToken.source();
        store.commit('ajax_source_setter', {
            me: source
        });
        return new Promise((resolve, reject) => {
            http.get('/api/v1/members/me.json', requestData, {
                cancelToken: source.token
            }).then(res => {
                if (res.data && +res.data.error === 0) {
                    commit('userInfo_setter', res.data.member);
                } else {
                }
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    },
    ajax_notice({commit}, requestData = {}) {
        return http.get('/api/v1/members/notice.json', requestData);
    },
    ajax_national_list({commit}, requestData = {}) {
        return http.get('/api/v1/two_factor/national_list.json', requestData);
    },
    ajax_invited_detail({commit}, requestData = {}) {
        return http.get('/api/v1/members/invited_detail.json', requestData);
    },
    ajax_invited_activity({commit}, requestData = {}) {
        return http.get('/api/v1/members/invited_activity.json', requestData);
    },
    ajax_banks({commit}, requestData = {}) {
        return http.get('/api/v1/common/banks.json', requestData);
    },
    ajax_get_receiving({commit}, requestData = {}) {
        return http.get('/api/v1/common/receiving.json', requestData);
    },
    ajax_get_deposit({commit}, requestData = {}) {
        return http.get('/api/v1/funds/deposit.json', requestData);
    },
    ajax_get_withdraw({commit}, requestData = {}) {
        return http.get('/api/v1/funds/withdraw.json', requestData);
    },
    ajax_order_list({commit}, requestData = {}) {
        return http.get('/api/v1/order/list.json', requestData);
    },
    ajax_order_info({commit}, requestData = {}) {
        return http.get('/api/v1/order/info.json', requestData);
    },
    ajax_me_nft({commit}, requestData = {}) {
        return http.get('/api/v1/nft/me.json', requestData);
    },
    ajax_ads_main({commit}, requestData = {}) {
        return http.get('/api/v1/otc/main.json', requestData);
    },
    ajax_ads({commit}, requestData = {}) {
        return http.get('/api/v1/otc/list.json', requestData);
    },
    ajax_ads_my({commit}, requestData = {}) {
        return http.get('/api/v1/otc/my.json', requestData);
    },
    ajax_pay_collections({commit}, requestData = {}) {
        return http.get('/api/v1/otc/pay_collections.json', requestData);
    },
    ajax_get_ad({commit}, requestData = {}) {
        return http.get('/api/v1/otc/ad.json', requestData);
    },
    ajax_exam_ad({commit}, requestData = {}) {
        return http.get('/api/v1/otc/ex_ad.json', requestData);
    },
    ajax_currency_code({commit}, requestData = {}) {
        return http.get('/api/v1/currency/code.json', requestData);
    },
    ajax_trade_price({commit}, requestData = {}) {
        return http.get('/api/v1/currency/trade_price.json', requestData);
    },
    ajax_zendesk({commit}, requestData = {}) {
        return http.get('/api/v1/common/zendesk.json', requestData);
    },
    ajax_chat({commit}, requestData = {}) {
        let source = ajax.CancelToken.source();
        store.commit('ajax_source_setter', {
            chat: source
        });
        return http.get(CHAT_URL, requestData, {
            timeout: 90000,
            cancelToken: source.token
        });
    },
    ajax_language({commit}, requestData = {}) {
        return http.get('/api/v1/common/ln.json', requestData);
    },
    ajax_banner({commit}, requestData = {}) {
        return http.get('/api/v1/common/banner.json', requestData);
    },
  //post
    ajax_register({commit}, requestData) {
        return http.post('/api/v1/members/reg.json', requestData);
    },
    ajax_login({commit}, requestData = {}) {
        return http.post('/api/v1/members/login.json', requestData);
    },
    ajax_login_verify({commit}, requestData = {}) {
        return http.post('/api/v1/members/login_verify.json', requestData);
    },
    ajax_sms_auth({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/sms_auth.json', requestData);
    },
    ajax_refresh({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/refresh.json', requestData);
    },
    ajax_verify_code({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/verify_code.json', requestData);
    },
    ajax_google_auth({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/google_auth.json', requestData);
    },
    ajax_bind_google({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/bind_google.json', requestData);
    },
    ajax_unbind_google({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/unbind_google.json', requestData);
    },
    ajax_unbind_sms({commit}, requestData = {}) {
        return http.post('/api/v1/two_factor/unbind_sms.json', requestData);
    },
    ajax_update_password({commit}, requestData = {}) {
        return http.post('/api/v1/members/update_password.json', requestData);
    },
    ajax_send_forget_mail({commit}, requestData = {}) {
        return http.post('/api/v1/members/send_forget_mail.json', requestData);
    },
    ajax_forget_password({commit}, requestData = {}) {
        return http.post('/api/v1/members/forget_password.json', requestData);
    },
    ajax_verified_token({commit}, requestData = {}) {
        return http.get('/api/v1/members/verified_token.json', requestData);
    },
    ajax_update_nickname({commit}, requestData = {}) {
        return http.post('/api/v1/members/update.json', requestData);
    },
    ajax_logout({commit}, requestData = {}) {
        return http.post('/api/v1/members/logout.json', requestData);
    },
    ajax_send_activation({commit}, requestData = {}) {
        return http.post('/api/v1/members/send_activation.json', requestData);
    },
    ajax_email_verified({commit}, requestData = {}) {
        return http.post('/api/v1/members/email_verified.json', requestData);
    },
    ajax_add_ad({commit}, requestData = {}) {
        return http.post('/api/v1/otc/ad.json', requestData);
    },
    ajax_add_receiving({commit}, requestData = {}) {
        return http.post('/api/v1/common/receiving.json', requestData);
    },
    ajax_gen_address({commit}, requestData = {}) {
        return http.post('/api/v1/funds/gen_address.json', requestData);
    },
    ajax_withdraw({commit}, requestData = {}) {
        return http.post('/api/v1/funds/withdraw.json', requestData);
    },
    ajax_order_buy({commit}, requestData = {}) {
        return http.post('/api/v1/order/buy.json', requestData);
    },
    ajax_order_cancel({commit}, requestData = {}) {
        return http.post('/api/v1/order/cancel_pay.json', requestData);
    },
    ajax_order_pay({commit}, requestData = {}) {
        return http.post('/api/v1/order/complete_pay.json', requestData);
    },
    ajax_order_release({commit}, requestData = {}) {
        return http.post('/api/v1/order/complete_release.json', requestData);
    },
    ajax_order_evaluate({commit}, requestData = {}) {
        return http.post('/api/v1/order/evaluate.json', requestData);
    },
    ajax_add_fund_sources({commit}, requestData = {}) {
        return http.post('/api/v1/fund_sources.json', requestData);
    },
    ajax_resend_confirm({commit}, requestData = {}) {
        return http.post('/api/v1/funds/resend_confirming.json', requestData);
    },
    ajax_send_msg({commit}, requestData = {}) {
        return http.post('/api/v1/otc/send.json', requestData);
    },
  //put方式
    ajax_update_receiving({commit}, requestData = {}) {
        return http.put('/api/v1/common/receiving.json', requestData);
    },
    ajax_default_receiving({commit}, requestData = {}) {
        return http.put('/api/v1/common/default_receiving.json', requestData);
    },
    ajax_update_ad({commit}, requestData = {}) {
        return http.put('/api/v1/otc/ad.json', requestData);
    },
    ajax_update_ad_status({commit}, requestData = {}) {
        return http.put('/api/v1/otc/ad_status.json', requestData);
    },
    ajax_withdraw_confirm({commit}, requestData = {}) {
        return http.put('/api/v1/funds/withdraw.json', requestData);
    },
    ajax_set_default_fund_sources({commit}, requestData = {}) {
        return http.put('/api/v1/fund_sources.json', requestData);
    },
  //delete方式
    ajax_del_receiving({commit}, requestData = {}) {
        return http.delete('/api/v1/common/delete_receiving.json', requestData);
    },
    ajax_withdraw_cancel({commit}, requestData = {}) {
        return http.delete('/api/v1/funds/withdraw.json', requestData);
    },
    ajax_del_fund_sources({commit}, requestData = {}) {
        return http.delete('/api/v1/fund_sources.json', requestData);
    }
};
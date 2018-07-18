<template lang="pug">
  .login
    .content
      .title(v-text="$t('public.login')")
      el-form(class="form" ref="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
        el-form-item(prop="email" class="formItem" :show-message="false")
          el-input(class="input" v-model="form.email" :placeholder="$t('user.email_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Email-FFFFFF.svg")
        el-form-item(prop="password" class="formItem" :show-message="false")
          el-input(class="input" type="password" v-model="form.password" :placeholder="$t('user.password_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Lock-FFFFFF.svg")
        el-form-item(class="formItem submit")
          el-button(class="submitButton" type='primary' @click="submit" :disabled="captchaLoading")
            slot(v-if="captchaLoading")
              mt-spinner(class="spinner" :type="3" color="#00A6AE" :size="14")
            slot(v-else) {{$t('public.login')}}
      .goDiv
        .goButton(v-text="$t('user.password_forget')" @click="$router.push('/forgetPassword')")
        .empty
        .goButton(v-text="$t('user.login_toRegister')" @click="$router.push('/register')")
    #captcha
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import {Spinner} from 'mint-ui'
import Vue from 'vue'
import axios from '../../utils/axios'
import '../../utils/gt'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Spinner.name, Spinner)

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: this.$i18n.translate('user.email_required', '')
          },
          {
            type: 'email',
            message: this.$i18n.translate('user.email_notValid', '')
          }
        ],
        password: [
          {
            required: true,
            message: this.$i18n.translate('user.password_required', '')
          },
          {
            min: 6,
            max: 100,
            message: this.$i18n.translate('user.password_minLength', '')
          }
        ]
      },
      captchaLoading: false,
      captchaObj: ''
    }
  },
  watch: {
    $route: function (val) {
      this.init()
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid, message) => {
        if (valid) {
          this.captchaObj.verify()
        } else {
          for (let i = 0; i < Object.keys(this.form).length; i++) {
            let item = Object.keys(this.form)[i]
            if (message && message['' + item] && message['' + item].length) {
              this.$message.error(message['' + item][0]['message'])
              break
            }
          }
        }
      })
    },
    initCaptcha () {
      this.captchaLoading = true
      this.$store.dispatch('axios_captcha_server').then(res => {
        this.captchaLoading = false
        if (res.data && +res.data.error === 0) {
          window.initGeetest({
            gt: res.data.gt,
            challenge: res.data.challenge,
            offline: false,
            new_captcha: res.data.new_captcha,
            product: 'bind', // 产品形式，包括：float，popup, custom
            width: '292px',
            lang: localStorage.getItem('language') === 'zh-CN' ? 'zh-cn' : 'en'
          },
          captchaObj => {
            captchaObj.appendTo(document.getElementById('captcha'))
            this.captchaObj = captchaObj
            captchaObj.onSuccess(() => {
              let result = this.captchaObj.getValidate()
              this.$loading.open()
              this.$store.dispatch('axios_login', {
                email: this.form.email,
                password: this.form.password,
                geetest_challenge: result.geetest_challenge,
                geetest_validate: result.geetest_validate,
                geetest_seccode: result.geetest_seccode,
                check_captcha: 1
              }).then(result => {
                if (result.data && +result.data.error === 0) {
                  this.$store.commit('saveToken', result.data.token)
                  axios.all([
                    this.$store.dispatch('axios_me'),
                    this.$store.dispatch('axios_language', {
                      ln: this.$getLanguage()
                    })]).then(axios.spread((resMe, resLan) => {
                    if (resMe.data && +resMe.data.error === 0 && resLan.data && +resLan.data.error === 0) {
                      this.$message.success(this.$i18n.translate('user.login_success', ''))
                      this.$router.push(this.$route.query.redirect || '/userCenter')
                    }
                  }))
                } else if (result.data && +result.data.error === 100038) {
                  if (result.data.sms || result.data.app) {
                    this.$store.commit('loginInfo_setter', {
                      mobile: result.data.mobile,
                      login_token: result.data.login_token
                    })
                    this.$store.commit('userInfo_mobile_setter', result.data.sms)
                    this.$store.commit('userInfo_app_two_factor_setter', result.data.app)
                    if (result.data.sms) {
                      this.$router.push('/validatePhone', this.$route.query.redirect ? {
                        redirect: this.$route.query.redirect
                      } : null)
                    } else if (result.data.app) {
                      this.$router.push('/validateGoogle', this.$route.query.redirect ? {
                        redirect: this.$route.query.redirect
                      } : null)
                    }
                  } else {
                    this.$message.error(this.$i18n.translate('user.login_error', ''))
                  }
                }
              })
            })
          })
        }
      })
    },
    init () {
      this.$loading.close()
      this.initCaptcha()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
</style>

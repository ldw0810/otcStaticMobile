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
          el-button(class="submitButton" type='primary' @click="submit" :disabled="captchaStatus === 'loading'")
            slot(v-if="captchaStatus === 'loading'")
              mt-spinner(class="spinner" :type="3" color="#00A6AE" :size="14")
            slot(v-else-if="captchaStatus === 'error'") {{$t('public.reload')}}
            slot(v-else) {{$t('public.login')}}
      .goDiv
        .goButton(v-text="$t('user.password_forget')" @click="$router.push('/forgetPassword')")
        .empty
        .goButton(v-text="$t('user.login_toRegister')" @click="$router.push('/register')")
      mt-popup(class="popup" v-model="validatePhoneFlag" position="right" v-if="validatePhonePopupFlag")
        slot
          ValidatePhone(@close="validatePhoneFlag = false" @changeValidate="changeValidate('google')" @success="login")
      mt-popup(class="popup" v-model="validateGoogleFlag" position="right" v-if="validateGooglePopupFlag")
        slot
          ValidateGoogle(@close="validateGoogleFlag = false" @changeValidate="changeValidate('phone')" @success="login")
    #captcha
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import {Spinner, Popup} from 'mint-ui'
import Vue from 'vue'
import axios from '../../utils/axios'
import '../../utils/gt'
import {$getAxiosLanguage} from '../../utils'
import ValidatePhone from '../common/validatePhone'
import ValidateGoogle from '../common/validateGoogle'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Spinner.name, Spinner)
Vue.component(Popup.name, Popup)

export default {
  components: {
    ValidatePhone,
    ValidateGoogle
  },
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
      captchaStatus: '',
      captchaObj: '',
      validatePhoneFlag: false,
      validateGoogleFlag: false,
      validatePhonePopupFlag: false,
      validateGooglePopupFlag: false
    }
  },
  watch: {
    $route: function (val) {
      this.init()
    }
  },
  methods: {
    submit () {
      if (this.captchaStatus === 'success') {
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
      } else if (this.captchaStatus === 'error') {
        this.initCaptcha()
      }
    },
    changeValidate (validateStr) {
      if (validateStr === 'phone') {
        this.validateGoogleFlag = false
        this.validatePhonePopupFlag = true
        this.validatePhoneFlag = true
      } else {
        this.validatePhoneFlag = false
        this.validateGooglePopupFlag = true
        this.validateGoogleFlag = true
      }
    },
    login () {
      axios.all([
        this.$store.dispatch('axios_me'),
        this.$store.dispatch('axios_language', {
          ln: $getAxiosLanguage()
        })]).then(axios.spread((resMe, resLan) => {
        if (resMe.data && +resMe.data.error === 0 && resLan.data && +resLan.data.error === 0) {
          this.$message.success(this.$i18n.translate('user.login_success', ''))
          this.$router.push(this.$route.query.redirect || '/user')
        }
      }))
    },
    initCaptcha () {
      this.captchaStatus = 'loading'
      this.$store.dispatch('axios_captcha_server').then(res => {
        if (res.data && +res.data.error === 0) {
          this.captchaStatus = 'success'
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
                  this.login()
                } else if (result.data && +result.data.error === 100038) {
                  if (result.data.sms || result.data.app) {
                    this.$store.commit('loginInfo_setter', {
                      mobile: result.data.mobile,
                      loginToken: result.data.login_token
                    })
                    this.$store.commit('userInfo_mobile_setter', result.data.sms)
                    this.$store.commit('userInfo_app_two_factor_setter', result.data.app)
                  }
                  if (result.data.sms) {
                    this.validatePhonePopupFlag = true
                    this.validatePhoneFlag = true
                  } else if (result.data.app) {
                    this.validateGooglePopupFlag = true
                    this.validateGoogleFlag = true
                  }
                }
              }).catch(() => {
                this.$message.error(this.$i18n.translate('public.url_request_fail', ''))
              })
            })
          })
        } else {
          this.captchaStatus = 'error'
          this.$message.error(this.$i18n.translate('user.captcha_request_fail', ''))
        }
      }).catch(() => {
        this.captchaStatus = 'error'
        this.$message.error(this.$i18n.translate('user.captcha_request_fail', ''))
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
  .popup {
    width 100%
    height 100%
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>

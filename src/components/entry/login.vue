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
              .imageLoading
            slot(v-else-if="captchaStatus === 'error'") {{$t('public.reload')}}
            slot(v-else) {{$t('public.login')}}
      .goDiv
        .goButton(v-text="$t('user.password_forget')" @click="$router.push('/forgetPassword')")
        .empty
        .goButton(v-text="$t('user.login_toRegister')" @click="$router.push('/register')")
      transition-group(tag="div" name="slide-right")
        .popup(class="popup-right" v-if="validatePhonePopupFlag" :key="1")
          slot
            validatePhoneLogin(@close="validatePhonePopupFlag = false" @changeValidate="changeValidate('google')" @success="login")
        .popup(class="popup-right" v-if="validateGooglePopupFlag" :key="2")
          slot
            validateGoogleLogin(@close="validateGooglePopupFlag = false" @changeValidate="changeValidate('phone')" @success="login")
    #captcha
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import axios from '../../utils/axios'
import '../../utils/gt'
import {$getAxiosLanguage} from '../../utils'
import validatePhoneLogin from '../common/validatePhoneLogin'
import validateGoogleLogin from '../common/validateGoogleLogin'
import {VALI_PASSWORD_NUMBER} from '../../utils/validator'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  components: {
    validatePhoneLogin,
    validateGoogleLogin
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
            message: this.$t('user.email_required')
          },
          {
            type: 'email',
            message: this.$t('user.email_notValid')
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('user.password_required')
          },
          {
            min: VALI_PASSWORD_NUMBER.min,
            max: VALI_PASSWORD_NUMBER.max,
            message: this.$t('validate.password_range', {'0': VALI_PASSWORD_NUMBER.min, '1': VALI_PASSWORD_NUMBER.max})
          }
        ]
      },
      captchaStatus: '',
      captchaObj: '',
      validatePhonePopupFlag: false,
      validateGooglePopupFlag: false
    }
  },
  watch: {
    $route: function (val) {
      this.doInit()
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
        this.validatePhonePopupFlag = true
        this.validateGooglePopupFlag = false
      } else {
        this.validatePhonePopupFlag = false
        this.validateGooglePopupFlag = true
      }
    },
    login () {
      this.$loading.open()
      axios.all([
        this.$store.dispatch('axios_me'),
        this.$store.dispatch('axios_language', {
          ln: $getAxiosLanguage()
        })]).then(axios.spread((resMe, resLan) => {
        if (resMe.data && +resMe.data.error === 0 && resLan.data && +resLan.data.error === 0) {
          this.$message.success(this.$t('user.login_success'))
          this.$router.push(this.$route.query.redirect || '/buy')
          this.$store.commit('isFirstLogin_setter', 1)
        }
      })).catch(() => {
        // this.$message.error(this.$t('public.url_request_fail'))
      })
    },
    initCaptcha () {
      this.captchaStatus = 'loading'
      this.$store.dispatch('axios_captcha_server').then(res => {
        if (res.data && +res.data.error === 0) {
          if (window.initGeetest) {
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
              this.captchaStatus = 'success'
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
                      this.validateGooglePopupFlag = false
                    } else if (result.data.app) {
                      this.validatePhonePopupFlag = false
                      this.validateGooglePopupFlag = true
                    }
                  }
                }).catch(() => {
                  // this.$message.error(this.$t('public.url_request_fail'))
                })
              })
            })
          } else {
            this.captchaStatus = 'error'
          }
        } else {
          this.captchaStatus = 'error'
          this.$message.error(this.$t('user.captcha_request_fail'))
        }
      }).catch(() => {
        this.captchaStatus = 'error'
        // this.$message.error(this.$t('user.captcha_request_fail'))
      })
    },
    doInit () {
      this.$loading.close()
      this.initCaptcha()
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang='stylus' scoped>
</style>

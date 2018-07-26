<template lang="pug">
  .register
    .bg
    .content
      .title(v-text="$t('public.register')")
      el-form(ref="form" class="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
        el-form-item(prop="email" class="formItem" :show-message="false")
          el-input(class="input" v-model="form.email" :placeholder="$t('user.email_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Email-FFFFFF.svg")
        el-form-item(prop="password" class="formItem" :show-message="false")
          el-input(class="input" type="password" v-model="form.password" :placeholder="$t('user.password_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Lock-FFFFFF.svg")
        el-form-item(prop="invitationCode" class="formItem" :show-message="false")
          el-input(class="input" v-model="form.invitationCode" :placeholder="$t('user.invitationCode_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/InviteCode-FFFFFF.svg")
        el-form-item(prop="checkbox" class="formItem checkbox" :show-message="false")
          el-checkbox(v-model="form.checkbox") {{$t('user.terms_allowed')}}
            span(class="showLink" @click="showAgreement") {{$t('user.terms_name')}}
        el-form-item(class="formItem submit")
          el-button(class="submitButton" type='primary' @click="submit" :disabled="captchaStatus === 'loading'")
            slot(v-if="captchaStatus === 'loading'")
              .imageLoading
            slot(v-else-if="captchaStatus === 'error'") {{$t('public.reload')}}
            slot(v-else) {{$t('public.register')}}
      .goDiv
        .empty
        .goButton(v-text="$t('user.register_toLogin')" @click="$router.push('/login')")
      transition(name="slide-right" mode="out-in")
        .popup(class="popup-right" v-if="popupFlag")
          slot
            UserAgreement(@close="popupFlag = false")
    #captcha
</template>
<script type="es6">
import {Button, Checkbox, Form, FormItem, Input} from 'element-ui'
import UserAgreement from '../policy/userAgreement'
import Vue from 'vue'
import {$getAxiosLanguage, $getNicknameByHash} from '../../utils'
import '../../utils/gt'
import {VALI_PASSWORD_NUMBER} from '../../utils/validator'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Checkbox.name, Checkbox)

export default {
  components: {
    UserAgreement
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      this.$store.dispatch('axios_verified_email', {
        email: value
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          if (!res.data.exist) {
            callback()
          } else {
            this.emailRepeatList.push(value)
            callback(new Error(this.$i18n.translate('user.email_repeat')))
          }
        } else {
          this.emailRepeatList.push(value)
          callback(new Error(this.$i18n.translate('user.email_repeat')))
        }
      }).catch(() => {
        callback(new Error(this.$i18n.translate('public.url_request_fail')))
      })
    }
    const validateEmailRepeat = (rule, value, callback) => {
      if (this.emailRepeatList && this.emailRepeatList.length) {
        if (this.emailRepeatList.indexOf(value) > -1) {
          callback(new Error(this.$i18n.translate('user.email_repeat')))
        }
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!/[^\d].*[\d]|[\d].*[^\d]/.test(value)) {
        callback(new Error(this.$i18n.translate('user.password_minLength')))
      } else {
        callback()
      }
    }
    const validateInviteCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]*$/g.test(value)) {
        callback(new Error(this.$i18n.translate('user.invitationCode_notValid')))
      } else {
        callback()
      }
    }
    return {
      form: {
        email: '',
        password: '',
        invitationCode: this.$route.query.invitationCode || this.$route.query.inviteCode,
        checkbox: []
      },
      rules: {
        email: [
          {
            required: true,
            message: this.$i18n.translate('user.email_required')
          },
          {
            type: 'email',
            message: this.$i18n.translate('user.email_notValid')
          },
          {
            validator: validateEmailRepeat
          },
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$i18n.translate('user.password_required')
          },
          {
            min: VALI_PASSWORD_NUMBER.min,
            max: VALI_PASSWORD_NUMBER.max,
            message: this.$i18n.translate('validate.password_range')
          },
          {
            validator: validatePassword
          }
        ],
        invitationCode: [
          {
            validator: validateInviteCode
          }
        ],
        checkbox: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: this.$t('user.register_checkbox_required'),
            trigger: 'change'
          }
        ]
      },
      validatingFlag: false,
      captchaObj: '',
      captchaStatus: '',
      popupFlag: false,
      emailRepeatList: []
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showAgreement () {
      this.popupFlag = true
    },
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
    initCaptcha () {
      this.captchaStatus = 'loading'
      this.$store.dispatch('axios_captcha_server').then(res => {
        if (res.data && +res.data.error === 0) {
          window.initGeetest({
            gt: res.data.gt,
            challenge: res.data.challenge,
            offline: false,
            new_captcha: res.data.new_captcha,
            product: 'bind', // 产品形式，包括：float，popup, custom
            width: '292px',
            lang: localStorage.getItem('language') === 'zh-CN' ? 'zh-cn' : 'en'
          }, captchaObj => {
            captchaObj.appendTo(document.getElementById('captcha'))
            this.captchaObj = captchaObj
            this.captchaStatus = 'success'
            captchaObj.onSuccess(() => {
              let result = this.captchaObj.getValidate()
              this.$loading.open()
              this.$store.dispatch('axios_register', {
                email: this.form.email,
                password: this.form.password,
                password_confirmation: this.form.password,
                invite_code: this.form.invitationCode || '',
                nickname: $getNicknameByHash(this.form.email),
                ln: $getAxiosLanguage(),
                geetest_challenge: result.geetest_challenge,
                geetest_validate: result.geetest_validate,
                geetest_seccode: result.geetest_seccode,
                check_captcha: 1
              }).then(result => {
                if (result.data && +result.data.error === 0) {
                  this.$message.success(this.$i18n.translate('user.register_success'))
                  this.$router.push('/login')
                }
              }).catch(() => {
                this.$message.error(this.$i18n.translate('public.url_request_fail'))
              })
            })
          })
        } else {
          this.captchaStatus = 'error'
          this.$message.error(this.$i18n.translate('user.captcha_request_fail'))
        }
      }).catch(() => {
        this.captchaStatus = 'error'
        this.$message.error(this.$i18n.translate('user.captcha_request_fail'))
      })
    },
    init () {
      this.$loading.close()
      this.initCaptcha()
    }
  }
}
</script>
<style lang='stylus' scoped>
  .checkbox {
    margin 4vh 0 2vh
    display flex
    align-items center
    justify-content center
    /deep/ .el-form-item__content {
      color: #FFFFFF;
      word-break break-all
      display flex
      align-items center
      .el-checkbox {
        flex 1
      }
    }
    .showLink {
      word-break:normal;
      display:block;
      white-space:pre-wrap;
      overflow:hidden;
      text-decoration underline
    }
  }

  .popup {
    width 100%
    height 100%
    background #FFFFFF
    overflow: scroll;
    overflow-scrolling touch
    -webkit-overflow-scrolling: touch;
  }
</style>

<template lang="pug">
  .register
    .bg
    .content
      .title(v-text="$t('public.register')")
      .form
        el-form(ref="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
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
          el-form-item(prop="checkbox" class="formItem" :show-message="false")
            el-checkbox(class="checkbox" v-model="form.checkbox")
              span {{$t('user.terms_allowed')}}
              a(class="showLink" @click="showAgreement") {{$t('user.terms_name')}}
          el-form-item(class="formItem submit")
            el-button(class="submitButton" type='primary' @click="submit" :disabled="captchaLoading")
              slot(v-if="captchaLoading")
                mt-spinner(class="spinner" :type="3" color="#00A6AE" :size="14")
              slot(v-else) {{$t('public.register')}}
      .goDiv
        .empty
        .goButton(v-text="$t('user.register_toLogin')" @click="$router.push('/login')")
      mt-popup(class="popup" v-model="userAgreementFlag" position="right" v-if="popupFlag")
        slot
          UserAgreement(@close="userAgreementFlag = false")
    #captcha
</template>
<script type="es6">
import {Button, Form, FormItem, Input, Checkbox} from 'element-ui'
import {Spinner, Popup} from 'mint-ui'
import UserAgreement from '../policy/userAgreement'
import Vue from 'vue'
import {$getAxiosLanguage, $getNicknameByHash} from '../../utils'
import '../../utils/gt'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Spinner.name, Spinner)
Vue.component(Popup.name, Popup)

export default {
  components: {
    UserAgreement
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      this.validatingFlag = true
      this.$store.dispatch('axios_verified_email', {
        email: value
      }).then(res => {
        this.validatingFlag = false
        if (res.data && +res.data.error === 0) {
          if (!res.data.exist) {
            callback()
          } else {
            callback(new Error(this.$i18n.translate('user.email_repeat', '')))
          }
        } else {
          callback(new Error(this.$i18n.translate('user.email_repeat', '')))
        }
      }).catch(() => {
        this.validatingFlag = false
        callback(new Error(this.$i18n.translate('public.url_request_fail', '')))
      })
    }
    const validatePassword = (rule, value, callback) => {
      if (!/[^\d].*[\d]|[\d].*[^\d]/.test(value)) {
        callback(new Error(this.$i18n.translate('user.password_minLength', '')))
      } else {
        callback()
      }
    }
    const validateInviteCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]*$/g.test(value)) {
        callback(new Error(this.$i18n.translate('user.invitationCode_notValid', '')))
      } else {
        callback()
      }
    }
    return {
      emailDataList: [],
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
            message: this.$i18n.translate('user.email_required', '')
          },
          {
            type: 'email',
            message: this.$i18n.translate('user.email_notValid', '')
          },
          {
            validator: validateEmail,
            trigger: 'blur'
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
      captchaLoading: false,
      popupFlag: false,
      userAgreementFlag: false
    }
  },
  computed: {
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
      this.userAgreementFlag = true
    },
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
          }, captchaObj => {
            captchaObj.appendTo(document.getElementById('captcha'))
            this.captchaObj = captchaObj
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
                this.$loading.close()
                if (result.data && +result.data.error === 0) {
                  this.$message.success(this.$i18n.translate('user.register_success', ''))
                  this.$router.push('/login')
                } else {
                  this.$message.error(this.$i18n.translate('user.register_error', ''))
                }
              }).catch(() => {
                this.$loading.close()
                this.$message.error(this.$i18n.translate('public.url_request_fail', ''))
              })
            })
          }
          )
        } else {
          this.captchaLoading = false
          this.$message.error(this.$i18n.translate('user.captcha_request_fail', ''))
        }
      }).catch(() => {
        this.captchaLoading = false
        this.$message.error(this.$i18n.translate('user.captcha_request_fail', ''))
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
  .content div {
    word-wrap: break-word;
  }

  .logoBg {
    width: 100vm;
    height: 10vh;
    background: #f4f6f9;
  }

  .title {
    padding-top: 5vh;
    font-size: 1.6rem;
    color: #FFFFFF;
    margin-left: 14vw;
    text-align: left;
  }

  .checkbox {
    color: #FFFFFF;
  }

  .checkbox span a {
    color: #FFFFFF;
    text-decoration: underline;
  }

  #captcha {
    width: 72vw;
    display: inline-block;
  }

  .submitButton {
    width: 72vw;
    display flex
    align-items center
    justify-content center
  }

  .goDiv {
    display: flex;
    margin: 0 14vw;
    .empty {
      flex: 1;
    }
    .goButton {
      min-width: 1vw;
      text-align: center;
      font-size: 0.85rem;
      color: #FFFFFF;
      letter-spacing: 0;
      cursor: pointer;
    }
  }
  .checkbox {
    width 72vw
    word-break break-all
    .showLink {
      text-decoration underline
    }
  }
  .popup{
    overflow: scroll;
    -webkit-overflow-scrolling : touch;
  }
</style>

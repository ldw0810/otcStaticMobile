<template>
  <div>
    <div class="container-validate">
      <div class='g-mobile-tabs' v-if="validate_phone && validate_google">
        <div class="g-mobile-tabs-bar" :class="{'g-mobile-tabs-bar-active':validateIndex !== 1}" @click="changeValidate(0)">
          <span class='g-mobile-tabs-bar-text' v-text="$t('user.auth_phone')"></span>
        </div>
        <div class="g-mobile-tabs-bar" :class="{'g-mobile-tabs-bar-active': validateIndex !== 0}" @click="changeValidate(1)">
          <span class='g-mobile-tabs-bar-text' v-text="$t('user.auth_google')"></span>
        </div>
      </div>
      <div class='content'>
        <div class="title" v-if="validate_phone && !validate_google" v-text="$t('user.auth_phone')"></div>
        <div class="title" v-if="validate_google && !validate_phone" v-text="$t('user.auth_google')"></div>
        <!-- 手机验证 -->
        <div v-show="+validateIndex === 0">
          <div class="tip" v-text="tipText"></div>
          <Form class="form" ref="phoneForm" @checkValidate='checkValidate_phoneForm' :model="phoneForm"
                :rules="phoneRules">
            <FormItem prop="pinCode" class="formItem ">
              <div class='g-mobile-send-group'>
                <i-input class="inputPinCodePhone" type="text" v-model="phoneForm.pinCode"
                         :placeholder="$t('user.pinCode_required')" @on-enter="phoneSubmit">
                            <span slot="prepend">
                                <img src="../../assets/images/icon/IdentifyingCode-CCCCCC.svg">
                            </span>
                </i-input>
                <sendCodeButton ref="sendCodeButton" @sendCode="sendPinCode"/>
              </div>
            </FormItem>
            <!--防止自动提交表单-->
            <input type="text" style="display:none"/>
            <FormItem class="formItem  submit">
              <div class='g-mobile-comfirm-group'>
                <i-button class="submitButton" type="primary" :loading='submitPhoneLoading'
                          :disabled='!validate.phoneForm' @click="phoneSubmit">
                  {{$t('public.confirm')}}
                </i-button>
                <i-button class="cancelButton" @click="cancel">
                  {{$t('public.cancel')}}
                </i-button>
              </div>
            </FormItem>
          </Form>

        </div>
        <!-- 谷歌验证 -->
        <div v-show="+validateIndex === 1">
          <div class="tip" v-text="$t('user.auth_google_code_required')"></div>
          <Form class="form" ref="googleForm" @checkValidate='checkValidate_googleForm' :model="googleForm"
                :rules="googleRules">
            <FormItem prop="pinCode" class="formItem">
              <i-input class="inputPinCode" type="text" v-model="googleForm.pinCode"
                       :placeholder="$t('user.pinCode_required')" @on-enter="googleSubmit">
                            <span slot="prepend">
                                <img src="../../assets/images/icon/IdentifyingCode-CCCCCC.svg">
                            </span>
              </i-input>
            </FormItem>
            <!--防止自动提交表单-->
            <input type="text" style="display:none"/>
            <FormItem class="formItem submit">
              <div class='g-mobile-comfirm-group'>
                <i-button class="submitButton" type="primary" :loading='submitGoogleLoading'
                          :disabled='!validate.googleForm' @click="googleSubmit">
                  {{$t('public.confirm')}}
                </i-button>
                <i-button class="cancelButton" @click="cancel">
                  {{$t('public.cancel')}}
                </i-button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script type="es6">
import validateMixin from '../mixins/validate-mixin'
import sendCodeButton from '../common/sendCode.vue'
import axios from '../../config/axios'

export default {
  mixins: [
    validateMixin(['phoneForm', 'googleForm'])
  ],
  data () {
    return {
      submitPhoneLoading: false,
      submitGoogleLoading: false,
      phoneForm: {
        pinCode: ''
      },
      googleForm: {
        pinCode: ''
      },
      validateIndex: 0,
      phoneRules: {
        pinCode: [
          {
            required: true,
            message: this.$t('user.auth_phone_code_required')
          }
        ]
      },
      googleRules: {
        pinCode: [
          {
            required: true,
            message: this.$t('user.auth_google_code_required')
          }
        ]
      }
    }
  },
  computed: {
    validate_phone () {
      return true
      // return this.$store.state.userInfo.mobile
    },
    validate_google () {
      return this.$store.state.userInfo.app_two_factor
    },
    tipText () {
      return this.$t('user.auth_phone_code_will_send').format(
        this.$store.state.loginInfo.mobile || ''
      )
    },
    loginInfo () {
      return this.$store.state.loginInfo
    }
  },
  watch: {
    $route: function (val) {
      this.init()
    }
  },
  methods: {
    changeValidate (index) {
      this.validateIndex = index
    },
    phoneSubmit () {
      this.$refs['phoneForm'].validate(valid => {
        if (valid) {
          this.submitPhoneLoading = true
          this.$store.dispatch('axios_login_verify', {
            op: 'sms',
            code: this.phoneForm.pinCode,
            login_token: this.loginInfo.login_token
          }).then(res => {
            this.submitPhoneLoading = false
            if (res.data && +res.data.error === 0) {
              this.$store.commit('saveToken', res.data.token)
              axios.all([
                this.$store.dispatch('axios_me'),
                this.$store.dispatch('axios_language', {
                  ln: this.$getLanguage()
                })]).then(axios.spread((resMe, resLan) => {
                if (resMe.data && +resMe.data.error === 0 &&
                    resLan.data && +resLan.data.error === 0) {
                  this.$Message.success(this.$t('user.login_success'))
                  this.$goRouter(this.$route.query.redirect || '/user/userCenter')
                } else {
                  this.$alert.error({
                    title: this.$t('public.error_title_default'),
                    content: this.$t('user.userInfo_response_none')
                  })
                }
              })).catch(() => {
                // this.$Message.error(this.$t("user.userInfo_response_none"));
              })
            } else if (res.data && +res.data.error === 100036) {
              this.$goRouter('/user/login')
            } else if (res.data && +res.data.error === 100049) {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t('user.user_frozen')
              })
            } else {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t('user.auth_phone_fail')
              })
              this.$refs.sendCodeButton.refresh()
            }
          }).catch(err => {
            if (+err.error === 100036) {
              this.$goRouter('/user/login')
            } else {
              this.submitPhoneLoading = false
              // this.$Message.error(this.$t("user.auth_phone_fail"));
              this.$refs.sendCodeButton.refresh()
            }
          })
        } else {
          this.$alert.error({
            title: this.$t('public.error_title_default'),
            content: this.$t('user.auth_phone_notValid')
          })
        }
      })
    },
    googleSubmit () {
      this.$refs['googleForm'].validate(valid => {
        if (valid) {
          this.submitGoogleLoading = true
          this.$store.dispatch('axios_login_verify', {
            op: 'app',
            code: this.googleForm.pinCode,
            login_token: this.loginInfo.login_token
          }).then(res => {
            this.submitGoogleLoading = false
            if (res.data && +res.data.error === 0) {
              this.$store.commit('saveToken', res.data.token)
              axios.all([
                this.$store.dispatch('axios_me'),
                this.$store.dispatch('axios_language', {
                  ln: this.$getLanguage()
                })]).then(axios.spread((resMe, resLan) => {
                if (resMe.data && +resMe.data.error === 0 &&
                    resLan.data && +resLan.data.error === 0) {
                  this.$Message.success(this.$t('user.login_success'))
                  this.$goRouter(this.$route.query.redirect || '/user/userCenter')
                } else {
                  this.$alert.error({
                    title: this.$t('public.error_title_default'),
                    content: this.$t('user.userInfo_response_none')
                  })
                }
              })).catch(() => {
                // this.$Message.error(this.$t("user.userInfo_response_none"));
              })
            } else if (res.data && +res.data.error === 100039) {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t("request['" + +res.data.error + "']"),
                onClose: () => {
                  this.$goBack()
                }
              })
            } else {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t('user.auth_google_fail')
              })
            }
          }).catch(err => {
            if (+err.error === 100039) {
              this.$alert.error({
                title: this.$t('public.error_title_default'),
                content: this.$t("request['" + +err.error + "']"),
                onClose: () => {
                  this.$goBack()
                }
              })
            } else {
              this.submitGoogleLoading = false
              // this.$Message.error(this.$t("user.auth_google_fail"));
            }
          })
        } else {
          this.$alert.error({
            title: this.$t('public.error_title_default'),
            content: this.$t('user.auth_google_notValid')
          })
        }
      })
    },
    cancel () {
      this.$goBack()
    },
    sendPinCode () {
      this.$store.dispatch('axios_login_verify', {
        op: 'sms',
        login_token: this.loginInfo.login_token,
        code: '',
        refresh: 1
      })
    },
    sendGoogleCode () {
      this.$store.dispatch('axios_google_auth', {
        refresh: 1
      })
    },
    init () {
      // if (this.validate_phone) {
      // } else if (this.validate_google) {
      //   this.validateIndex = 1
      // } else {
      //   if (this.$route.query.redirect) {
      //     this.$goRouter('/user/login', {
      //       redirect: this.$route.query.redirect
      //     })
      //   } else {
      //     this.$goRouter('/user/login')
      //   }
      // }
    }
  },
  created: function () {
    this.init()
  },
  components: {
    sendCodeButton
  }
}
</script>
<style lang='scss' scoped>
  .container-validate {
    width: 100vw;
    font-family: SFUIDisplay-Regular sans-serif;
  }

  .content {
    padding: 0 14vw;
  }

  .content div {
    word-wrap: break-word;
  }

  .title {
    margin-top: 5vh;
    font-size: 1.6rem;
    color: #FFFFFF;
    text-align: left;
  }

  .tip {
    font-size: 0.85rem;
    color: #FFFFFF;
  }

  .form {
    margin-top: 5vh;
  }

  .formItem {
    // margin-left: 94px;
  }

  .inputPinCode {
    width: 68vw;
  }

  .inputPinCodePhone {
    width: 45vw;
  }

  .submit {
    margin-top: 8vh;
  }

  .submitButton {
    width: 38vw;
  }

  .cancelButton {
    width: 26vw;
  }
</style>

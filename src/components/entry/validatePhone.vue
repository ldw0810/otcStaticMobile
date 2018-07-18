<template lang="pug">
  .validatePhone
    .content
      .title(v-text="$t('user.auth_phone')")
      .subTitle(v-text="tipText")
      el-form(ref="form" class="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
        el-form-item(prop="pinCode" class="formItem" :show-message="false")
          el-input(class="input" type="text" v-model="form.pinCode" :placeholder="$t('user.pinCode_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/IdentifyingCode-CCCCCC.svg")
          sendCodeButton
        el-form-item(class="formItem submit")
          el-button(class="submitButton" type='primary' :loading='submitLoading' @click="submit") {{$t('public.complete')}}
      .goDiv
        .empty
        <!--.goButton(v-text="$t('user.auth_google_use')" @click="$router.push('/user/validateGoogle')")-->
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component
  export default class login_validatePhone extends Vue {
    submitPhoneLoading: boolean = false;
    submitGoogleLoading: boolean = false;
    form: Globe.validateForm = {
      pinCode: ''
    };
    rules: Globe.rules = {
      pinCode: [
        {
          required: true,
          message: this.$i18n.translate('user.auth_phone_code_required', '')
        }
      ]
    };
    get tipText(){
      return this.$i18n.translate('user.auth_phone_code_will_send', '').format(this.$store.state.loginInfo.mobile || '');
    }
  }

  export default {
    mixins: [
      validateMixin(['phoneForm', 'googleForm'])
    ],
    data() {
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
      validate_phone() {
        return true
        // return this.$store.state.userInfo.mobile
      },
      validate_google() {
        return this.$store.state.userInfo.app_two_factor
      },
      tipText() {
        return this.$t('user.auth_phone_code_will_send').format(
          this.$store.state.loginInfo.mobile || ''
        )
      },
      loginInfo() {
        return this.$store.state.loginInfo
      }
    },
    watch: {
      $route: function (val) {
        this.init()
      }
    },
    methods: {
      changeValidate(index) {
        this.validateIndex = index
      },
      phoneSubmit() {
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
      googleSubmit() {
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
      cancel() {
        this.$goBack()
      },
      sendPinCode() {
        this.$store.dispatch('axios_login_verify', {
          op: 'sms',
          login_token: this.loginInfo.login_token,
          code: '',
          refresh: 1
        })
      },
      sendGoogleCode() {
        this.$store.dispatch('axios_google_auth', {
          refresh: 1
        })
      },
      init() {
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

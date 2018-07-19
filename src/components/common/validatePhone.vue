<template lang="pug">
  .page
    LogoDiv
    .bg
    .content
      .validatePhone
        .content
          .title(v-text="$t('user.auth_phone')")
          .subTitle(v-text="tipText")
          el-form(ref="form" class="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
            el-form-item(prop="pinCode" class="formItem" :show-message="false")
              el-input(class="input" type="text" v-model="form.pinCode" :placeholder="$t('user.pinCode_required')")
                span(slot="prepend")
                  img(src="../../assets/images/icon/IdentifyingCode-CCCCCC.svg")
              SendCode
            el-form-item(class="formItem submit")
              el-button(class="submitButton" type='primary' @click="submit") {{$t('public.complete')}}
          .goDiv
            .goButton(v-text="$t('public.login')" @click="$emit('close', 1)")
            .empty
            .goButton(v-text="$t('user.auth_google_use')" @click="$emit('changeValidate', 1)")
    FooterDiv
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import LogoDiv from './logo'
import FooterDiv from './footer'
import SendCode from '../common/sendCode'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  components: {
    LogoDiv,
    FooterDiv,
    SendCode
  },
  data () {
    return {
      form: {
        pinCode: ''
      },
      rules: {
        pinCode: [
          {
            required: true,
            message: this.$i18n.translate('user.auth_phone_code_required', '')
          }
        ]
      }
    }
  },
  computed: {
    validatePhone () {
      return this.$store.state.userInfo.mobile
    },
    tipText () {
      return this.$i18n.translate('user.auth_phone_code_will_send', this.loginInfo.mobile)
    },
    loginInfo () {
      return this.$store.state.loginInfo || {}
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid, message) => {
        if (valid) {
          this.$loading.open()
          this.$store.dispatch('axios_login_verify', {
            op: 'sms',
            code: this.form.pinCode,
            login_token: this.loginInfo.loginToken
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$store.commit('saveToken', res.data.token)
              this.$emit('success', 1)
            } else {
              this.$refs.sendCodeButton.refresh()
            }
          }).catch(() => {
            this.$refs.sendCodeButton.refresh()
          })
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
    }
  }
}
</script>
<style lang='stylus' scoped>
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .bg {
      background-image: linear-gradient(45deg, #0BBFD5 0%, #6DD788 100%);
      background-size: cover;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: 100%;
      width: 100%;
    }
    .content {
      width: 100vw;
      min-height: 100 - $headerHeight - $footerHeight;
      .subTitle {
        font-size: 0.85rem;
        color: #FFFFFF;
      }
    }
  }
</style>

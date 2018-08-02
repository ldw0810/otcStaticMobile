<template lang="pug">
  .page
    LogoDiv
    .bg
    .content
      .validatePhone
        .content
          .title {{$t('user.auth_phone')}}
          el-form(ref="form" class="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
            el-form-item(prop="pinCode" class="formItem" :show-message="false")
              el-input(class="googleCode" type="text" v-model="form.pinCode" :placeholder="$t('user.auth_google_code_required')")
                span(slot="prepend")
                  img(src="../../assets/images/icon/IdentifyingCode-FFFFFF.svg")
            el-form-item(class="formItem submit")
              el-button(class="submitButton" type='primary' @click="submit") {{$t('public.complete')}}
          .goDiv(v-if="validatePhone")
            .goButton(v-text="$t('public.backLogin')" @click="$emit('close', 1)")
            .empty
            .goButton(v-text="$t('user.auth_phone_use')" @click="$emit('changeValidate', 1)")
          .goDiv(v-else)
            .empty
            .goButton(v-text="$t('public.backLogin')" @click="$emit('close', 1)")
    EntryFooter
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import LogoDiv from './logo'
import EntryFooter from './entryFooter'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  components: {
    LogoDiv,
    EntryFooter
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
            message: this.$t('user.auth_google_code_required')
          }
        ]
      }
    }
  },
  computed: {
    validatePhone () {
      return this.$store.state.userInfo.mobile
    },
    validateGoogle () {
      return this.$store.state.userInfo_app_two_factor_setter
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
            op: 'app',
            code: this.form.pinCode,
            login_token: this.loginInfo.loginToken
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$store.commit('saveToken', res.data.token)
              this.$emit('success', 1)
            } else if (res.data && +res.data.error === 100039) {
              this.$emit('close', 1)
            }
          }).catch(() => {
            this.$message.error(this.$t('public.url_request_fail'))
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
    },
    init () {
      if (!this.validateGoogleLogin) {
        if (this.validatePhone) {
          this.$emit('changeValidate', 1)
        } else {
          this.$emit('close', 1)
        }
      }
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
    }
  }
</style>

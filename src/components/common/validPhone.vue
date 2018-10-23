<template lang="pug">
  .validPhone
    mt-header(:title="$t('user.login_auth') + ' - ' + $t('user.auth_phone')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        mt-field(type="number" :attr="{pattern: '[0-9.]*'}" :label="$t('user.auth_phone_code')" :placeholder="$t('user.auth_phone_code_required')" v-model="form.pinCode" :state="formState.pinCode" @input="checkState('pinCode')")
          SendCode(ref="sendCode" class="sendCode" @sendCode="sendPinCode")
        .changeDiv(v-if="userInfo.app_two_factor")
          .empty
          .changeButton(v-text="$t('user.auth_google_use')" @click="$emit('change', 1)")
      .submit
        .mintSubmit
          mt-button(class="submitBtn" :disabled="!formStateAll" @click="submit") {{$t('public.confirm')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import SendCode from '../common/sendCode'
import formMixin from '../../mixins/formMixin'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  mixins: [formMixin],
  name: 'validPhone',
  components: {
    SendCode
  },
  props: {
    needAuth: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        pinCode: ''
      },
      formState: {
        pinCode: ''
      },
      formMessage: {
        pinCode: ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    checkState (value) {
      if (value === 'pinCode') {
        this.formState.pinCode = this.form.pinCode ? 'success' : ''
      }
    },
    sendPinCode () {
      this.$store.dispatch('axios_refresh', {
        refresh: 1
      }).then(res => {
        if (res.data && +res.data.error === 0) {
        }
      }).catch(() => {
        // this.$message.error(this.$t('user.auth_phone_code_send_fail'))
      })
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        let requestData = {
          op: 'sms',
          code: this.form.pinCode
        }
        if (!this.needAuth) {
          this.$emit('close', 1)
          this.$emit('success', requestData)
        } else {
          this.$loading.open()
          this.$store.dispatch('axios_verify_code', requestData).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$emit('close', 1)
              this.$emit('success', 1)
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_phone_fail'))
          })
        }
      }
    },
    init () {
      this.checkAllState()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .validPhone {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
  }

  .content {
    margin-top $mintHeaderHeight + 1
  }
  .changeDiv {
    width 100vw
    margin 2.5vh 0
    display flex
    align-items center
    .empty {
      flex 1
    }
    .changeButton {
      padding-right 6vw
      color #2EA2F8
      font-size 0.85rem
      font-weight normal
    }
  }
  .submit {
    margin-top 2.5vh
  }
  .mintSubmit {
    margin-bottom 2.5vh
  }
  /deep/ .send .primary {
    color #333333 !important
  }
</style>

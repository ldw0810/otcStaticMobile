<template lang="pug">
  .validatePhone
    mt-header(:title="$t('user.login_auth') + ' - ' + $t('user.auth_phone')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        mt-field(type="text" :label="$t('user.auth_phone_code')" :placeholder="$t('user.auth_phone_code_required')" v-model="form.pinCode" :state="formState.pinCode" @input="checkState('pinCode')")
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

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'validatePhone',
  components: {
    SendCode
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
    formStateAll () {
      const tempStateList = Object.keys(this.formState)
      for (let i = 0; i < tempStateList.length; i++) {
        if (this.formState[tempStateList[i]] === '') {
          return false
        }
      }
      return true
    },
    formMessageAll () {
      const tempMessageList = Object.keys(this.formMessage)
      for (let i = 0; i < tempMessageList.length; i++) {
        if (this.formMessage[tempMessageList[i]] !== '') {
          return this.formMessage[tempMessageList[i]]
        }
      }
      return ''
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    checkAllState () {
      Object.keys(this.formState).forEach((item) => {
        this.checkState(item)
      })
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
        this.$message.error(this.$t('user.auth_phone_code_send_fail'))
      })
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        let requestData = {
          op: 'sms',
          code: this.form.pinCode
        }
        this.$store.dispatch('axios_verify_code', requestData).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$emit('close', 1)
            this.$emit('success', requestData)
          }
        }).catch(() => {
          this.$message.error(this.$t('user.auth_phone_fail'))
        })
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
  .validatePhone {
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

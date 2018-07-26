<template lang="pug">
  .authPhoneCode
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        mt-field(type="text" :label="$t('user.auth_phone_code')" :placeholder="$t('user.auth_phone_code_required')" v-model="form.pinCode" :state="formState.pinCode" @input="checkState('pinCode')")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'authPhoneCode',
  props: {
    userInfo: '',
    country: '',
    phoneNumber: ''
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
    getMe () {
      this.$store.dispatch('axios_me')
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        this.$store.dispatch('axios_sms_auth', {
          commit: 'auth',
          country: this.country,
          mobile: this.phoneNumber,
          code: this.form.pinCode
        }).then(res => {
          this.$loading.close()
          if (res.data && +res.data.error === 0) {
            !this.userInfo.mobile ? this.$message.success(this.$i18n.translate('user.auth_phone_bind_success')) : this.$message.success(this.$i18n.translate('user.auth_phone_unbind_success'))
            this.$router.push('/me/settings')
          }
        }).catch(() => {
          this.$loading.close()
          !this.userInfo.mobile ? this.$message.success(this.$i18n.translate('user.auth_phone_bind_fail')) : this.$message.success(this.$i18n.translate('user.auth_phone_unbind_fail'))
        })
      }
    },
    init () {
      if (!this.userInfo) {
        this.getMe()
      }
      this.checkAllState()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .authPhoneCode {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
  }

  .content {
    margin-top $mintHeaderHeight + 1
  }

  .submit {
    margin-top 2.5vh
  }
</style>

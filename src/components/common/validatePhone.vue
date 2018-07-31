<template lang="pug">
  .validatePhone
    mt-header(:title="$t('public.login_auth')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        mt-field(type="password" :label="$t('user.password')" :placeholder="$t('user.password_required')" v-model="form.password" :state="formState.password" @input="checkState('password')" v-if="userInfo.mobile")
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
  name: 'validatePhone',
  props: {
    userInfo: '',
    country: '',
    phoneNumber: ''
  },
  data () {
    return {
      form: {
        password: '',
        pinCode: ''
      },
      formState: {
        password: '',
        pinCode: ''
      },
      formMessage: {
        password: '',
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
      if (value === 'password') {
        if (this.userInfo.mobile) {
          this.formState.password = this.form.password ? 'success' : ''
        } else {
          this.formState.password = 'success'
        }
      } else if (value === 'pinCode') {
        this.formState.pinCode = this.form.pinCode ? 'success' : ''
      }
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$emit('success', 1)
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

  .submit {
    margin-top 2.5vh
  }
</style>

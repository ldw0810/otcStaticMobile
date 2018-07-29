<template lang="pug">
  .modifyPassword
    mt-header(:title="$t('user.modify_password')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .content
      mt-field(type="password" :label="$t('user.password_old')" :placeholder="$t('user.password_old_required')" v-model="form.oldPassword" :state="formState.oldPassword" @input="checkState('oldPassword')")
      mt-field(type="password" :label="$t('user.password_new')" :placeholder="$t('user.password_new_required')" v-model="form.newPassword" :state="formState.newPassword" @input="checkState('newPassword')")
      mt-field(type="password" :label="$t('user.rePassword')" :placeholder="$t('user.rePassword_required')" v-model="form.rePassword" :state="formState.rePassword" @input="checkState('rePassword')")
    .submit(class="mintSubmit")
      mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import {VALI_PASSWORD_NUMBER} from '../../utils/validator'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'modifyPassword',
  data () {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      formState: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      formMessage: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
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
    checkAllState () {
      Object.keys(this.formState).forEach((item) => {
        this.checkState(item)
      })
    },
    checkState (value) {
      if (value === 'oldPassword') {
        this.formState.oldPassword = this.form.oldPassword ? 'success' : ''
      } else if (value === 'newPassword') {
        if (this.form.rePassword) {
          if (this.form.rePassword === this.form.newPassword) {
            this.formState.rePassword = 'success'
            this.formMessage.rePassword = ''
          } else {
            this.formState.rePassword = 'error'
            this.formMessage.rePassword = this.$t('user.password_different')
          }
        } else {
          if (this.form.newPassword) {
            if (this.form.newPassword.length > VALI_PASSWORD_NUMBER.max || this.form.newPassword.length < VALI_PASSWORD_NUMBER.min || !/[^\d].*[\d]|[\d].*[^\d]/.test(this.form.newPassword)) {
              this.formState.newPassword = 'error'
              this.formMessage.newPassword = VALI_PASSWORD_NUMBER.message
            } else {
              this.formState.newPassword = 'success'
              this.formMessage.newPassword = ''
            }
          } else {
            this.formState.newPassword = ''
            this.formMessage.newPassword = ''
          }
        }
      } else if (value === 'rePassword') {
        if (this.form.rePassword) {
          if (this.form.rePassword === this.form.newPassword) {
            this.formState.rePassword = 'success'
            this.formMessage.rePassword = ''
          } else {
            this.formState.rePassword = 'error'
            this.formMessage.rePassword = this.$t('user.password_different')
          }
        } else {
          this.formState.rePassword = ''
          this.formMessage.rePassword = ''
        }
      }
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        this.$store.dispatch('axios_update_password', {
          old_password: this.form.oldPassword,
          password: this.form.newPassword,
          password_confirmation: this.form.rePassword
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('user.password_modify_success'))
            this.$router.push('/me/settings')
          }
        }).catch(() => {
          this.$message.error(this.$t('user.password_modify_fail'))
        })
      }
    },
    init () {
      this.$loading.close()
      this.checkAllState()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .modifyPassword {
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

<template lang="pug">
  .authPhone
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id && countryList.length")
      .content
        mt-cell(:title="item.name" @click.native="changeLanguage(index)" is-link)
        mt-field(type="tel" :label="$t('user.password_old')" :placeholder="$t('user.password_old_required')" v-model="form.oldPassword" :state="formState.oldPassword" @input="checkState('oldPassword')")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
      mt-actionsheet(v-model="actionFlag" :actions="actionList")
</template>
<script type="es6">
import {Header, Button, Field, Actionsheet} from 'mint-ui'
import Vue from 'vue'
import {VALI_PASSWORD_NUMBER} from '../../utils/validator'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)
Vue.component(Actionsheet.name, Actionsheet)

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
    countryList () {
      return this.$store.state.countryList || []
    },
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
            this.formMessage.rePassword = this.$i18n.translate('user.password_different')
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
            this.formMessage.rePassword = this.$i18n.translate('user.password_different')
          }
        } else {
          this.formState.rePassword = ''
          this.formMessage.rePassword = ''
        }
      }
    },
    getCountryList () {
      if (!this.countryList.length) {
        this.$store.dispatch('axios_national_list').then(res => {
          if (res && +res.data.error === 0) {
            this.countryList = res.data.country || []
          }
        }).catch(() => {
          this.$message.error(this.$t('user.country_response_none'))
        })
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
          this.$loading.close()
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('user.password_modify_success'))
            this.$router.push('/me/settings')
          }
        }).catch(() => {
          this.$loading.close()
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

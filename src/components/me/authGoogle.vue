<template lang="pug">
  .authGoogle
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id")
      .content
        mt-field(type="tel" :label="$t('user.auth_phone_number')" :placeholder="$t('user.auth_phone_number_required')" v-model="form.phoneNumber" :state="formState.phoneNumber" :disabled="userInfo.mobile" @input="checkState('phoneNumber')")
        mt-field(type="tel" :label="$t('user.auth_phone_number')" :placeholder="$t('user.auth_phone_number_required')" v-model="form.phoneNumber" :state="formState.phoneNumber" :disabled="userInfo.mobile" @input="checkState('phoneNumber')")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Cell, Field, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Cell.name, Cell)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'authGoogle',
  data () {
    return {
      form: {
        phoneNumber: this.$store.state.userInfo.phone_number || ''
      },
      formState: {
        phoneNumber: ''
      },
      formMessage: {
        phoneNumber: ''
      },
      countryFlag: false,
      authGoogleCodeFlag: false
    }
  },
  watch: {
    'userInfo.mobile' (value) {
      if (value) {
        this.form.phoneNumber = this.userInfo.phone_number
        this.formState.phoneNumber = 'success'
        this.formMessage.phoneNumber = ''
      } else {
        this.form.phoneNumber = ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
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
      if (value === 'phoneNumber') {
        if (this.userInfo.mobile) {
          this.formState.phoneNumber = this.form.phoneNumber ? 'success' : ''
          this.formMessage.phoneNumber = ''
        } else {
          if (this.form.phoneNumber) {
            if (!/^[0-9]+.?[0-9]*$/.test(this.form.phoneNumber)) {
              this.formState.phoneNumber = 'error'
              this.formMessage.phoneNumber = this.$i18n.translate('validate.must_be_number')
            } else {
              this.formState.phoneNumber = 'success'
              this.formMessage.phoneNumber = ''
            }
          } else {
            this.formState.phoneNumber = ''
            this.formMessage.phoneNumber = ''
          }
        }
      }
    },
    changeCountry (value) {
      this.country = value
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        if (!this.userInfo.mobile) {
          this.$store.dispatch('axios_sms_auth', {
            commit: 'send_code',
            country: this.country[1],
            mobile: this.form.phoneNumber
          }).then(res => {
            this.$loading.close()
            if (res.data && +res.data.error === 0) {
              this.authGoogleCodeFlag = true
            }
          }).catch(() => {
            this.$loading.close()
            this.$message.error(this.$i18n.translate('user.auth_phone_code_send_fail'))
          })
        } else {
          this.$store.dispatch('axios_refresh', {
            refresh: 1
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.authGoogleCodeFlag = true
            }
          }).catch(() => {
            this.$message.error(this.$t('user.auth_phone_code_send_fail'))
          })
        }
      }
    },
    init () {
      this.getMe()
      this.checkAllState()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .authGoogle {
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

  .popup {
    width 100%
    height 100%
    background #FFFFFF
    overflow: scroll;
    overflow-scrolling touch
    -webkit-overflow-scrolling: touch;
  }
  /deep/ .mint-field-core {
    height 6vh
  }
</style>

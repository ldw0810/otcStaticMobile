<template lang="pug">
  .authPhone
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id")
      .content(v-if="!userInfo.mobile")
        mt-cell(:title="country[0] + ' +' + country[2]" @click.native.prevent="countryFlag = true" is-link)
        mt-field(type="number" :label="$t('user.auth_phone_number')" :placeholder="$t('user.auth_phone_number_required')" v-model="form.phoneNumber" :state="formState.phoneNumber" :disabled="userInfo.mobile" @input="checkState('phoneNumber')")
      .content(v-else class="closeContent")
        .label {{$t('user.auth_phone_number')}}
        .number {{userInfo.phone_number}}
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('user.auth_phone_code_send')}}
    transition-group(tag="div" name="slide-right")
      .popup(class="popup-right" v-if="countryFlag" :key="1")
        slot
          SelectCountry(@close="countryFlag = false" @success="changeCountry")
      .popup(class="popup-right" v-if="authPhoneCodeFlag" :key="2")
        slot
          AuthPhoneCode(@close="authPhoneCodeFlag = false" :userInfo="userInfo" :country="country[1]" :phoneNumber="form.phoneNumber")
</template>
<script type="es6">
import {Button, Cell, Field, Header} from 'mint-ui'
import Vue from 'vue'
import SelectCountry from './selectCountry'
import AuthPhoneCode from './authPhoneCode'

Vue.component(Header.name, Header)
Vue.component(Cell.name, Cell)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'authPhone',
  components: {AuthPhoneCode, SelectCountry},
  data () {
    return {
      country: ['China', 'CN', '86'],
      form: {
        phoneNumber: ''
      },
      formState: {
        phoneNumber: ''
      },
      formMessage: {
        phoneNumber: ''
      },
      countryFlag: false,
      authPhoneCodeFlag: false
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
              this.formMessage.phoneNumber = this.$t('validate.must_be_number')
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
      this.$store.dispatch('axios_me').then(() => {
        this.form.phoneNumber = this.userInfo.mobile ? this.userInfo.phone_number : ''
      })
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
            if (res.data && +res.data.error === 0) {
              this.authPhoneCodeFlag = true
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_phone_code_send_fail'))
          })
        } else {
          this.$store.dispatch('axios_refresh', {
            refresh: 1
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.authPhoneCodeFlag = true
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_phone_code_send_fail'))
          })
        }
      }
    },
    init () {
      console.log(this.userInfo)
      if (this.userInfo.mobile) {
        console.log(this.userInfo)
        this.form.phoneNumber = this.userInfo.phone_number
      }
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
  .authPhone {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
  }

  .content {
    margin-top $mintHeaderHeight + 1
  }
  .closeContent {
    display flex
    align-items center
    width 100vw
    .label {
      margin-left 2.5vw
      font-size 0.85rem
      font-weight normal
    }
    .number {
      flex 1
      font-size 0.85rem
      display flex
      align-items center
      justify-content center
    }
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

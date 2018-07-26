<template lang="pug">
  .authPhone
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id")
      .content
        mt-cell(:title="country[0] + ' +' + country[2]" @click.native="showCountry" :is-link="!userInfo.mobile")
        mt-field(type="tel" :label="$t('user.auth_phone_number')" :placeholder="$t('user.auth_phone_number_required')" v-model="form.phoneNumber" :state="formState.phoneNumber" @input="checkState('phoneNumber')")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('user.auth_phone_code_send')}}
    transition(name="slide-right" mode="out-in")
      .popup(class="popup-right" v-if="popupFlag")
        slot
          SelectCountry(@close="popupFlag = false" @success="changeCountry")
</template>
<script type="es6">
import {Button, Cell, Field, Header} from 'mint-ui'
import Vue from 'vue'
import SelectCountry from './selectCountry'

Vue.component(Header.name, Header)
Vue.component(Cell.name, Cell)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'authPhone',
  components: {SelectCountry},
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
      popupFlag: false
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
    },
    showCountry () {
      if (!this.userInfo.mobile) {
        this.popupFlag = true
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
        this.$store.dispatch('axios_sms_auth', {
          commit: 'send_code',
          country: this.country[1],
          mobile: this.form.phoneNumber
        }).then(res => {
          this.$loading.close()
          if (res.data && +res.data.error === 0) {
            this.$router.push('/authPhoneCode')
          }
        }).catch(() => {
          this.$loading.close()
          this.$message.error(this.$i18n.translate('user.auth_phone_code_send_fail'))
        })
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
  .authPhone {
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
</style>

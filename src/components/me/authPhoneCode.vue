<template lang="pug">
  .authPhoneCode
    mt-header(:title="userInfo.mobile ? $t('user.auth_phone_del') : $t('user.auth_phone_add')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        mt-field(type="password" :label="$t('user.password')" :placeholder="$t('user.password_required')" v-model="form.password" :state="formState.password" @input="checkState('password')" v-if="userInfo.mobile")
        mt-field(type="number" :attr="{pattern: '[0-9.]*'}" :label="$t('user.auth_phone_code')" :placeholder="$t('user.auth_phone_code_required')" v-model="form.pinCode" :state="formState.pinCode" @input="checkState('pinCode')")
          .right(name="slot" v-if="userInfo.mobile")
            SendCode(ref="sendCode" class="sendCode" @sendCode="sendCode")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import formMixin from '../../mixins/formMixin'
import SendCode from '../common/sendCode'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  mixins: [formMixin],
  name: 'authPhoneCode',
  components: {
    SendCode
  },
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
  methods: {
    sendCode () {
      this.$emit('sendCode', 1)
    },
    goBack () {
      if (this.userInfo.mobile) {
        this.$router.push('/me/settings')
      } else {
        this.$emit('close', 1)
      }
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
    getMe () {
      this.$store.dispatch('axios_me')
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        if (this.userInfo.mobile) {
          this.$store.dispatch('axios_unbind_sms', {
            password: this.form.password,
            code: this.form.pinCode
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('user.auth_phone_unbind_success'))
              this.getMe()
              this.$router.push('/me/settings')
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_phone_unbind_fail'))
          })
        } else {
          this.$store.dispatch('axios_sms_auth', {
            commit: 'auth',
            country: this.country,
            mobile: this.phoneNumber,
            code: this.form.pinCode
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('user.auth_phone_bind_success'))
              this.getMe()
              this.$router.push('/me/settings')
            }
          }).catch(() => {
            // this.$message.success(this.$t('user.auth_phone_bind_fail'))
          })
        }
      }
    },
    doInit () {
      this.$loading.close()
      if (!this.userInfo.mobile) {
        this.formState.password = 'success'
        this.formMessage.password = ''
      }
      this.checkAllState()
    }
  },
  mounted () {
    this.doInit()
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
  .sendCodeBtn {
    font-size 1rem
    @extend .flex-center
  }
  /deep/ .sendCode {
    padding 0 2.5vw
    .primary {
      color: #000 !important;
    }
  }
</style>

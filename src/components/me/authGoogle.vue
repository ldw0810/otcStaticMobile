<template lang="pug">
  .authGoogle
    mt-header(:title="userInfo.app_two_factor ? $t('user.auth_google_del') : $t('user.auth_google_add')" fixed)
      router-link(:to="userInfo.app_two_factor ? '/me/settings' : '/me/addGoogle'" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id")
      .content
        mt-field(type="password" :label="$t('user.password')" :placeholder="$t('user.password_required')" v-model="form.password" :state="formState.password" @input="checkState('password')")
        mt-field(type="number" :attr="{pattern: '[0-9.]*'}" :label="$t('user.auth_google_code')" :placeholder="$t('user.auth_google_code_required')" v-model="form.googleCode" :state="formState.googleCode" @input="checkState('googleCode')")
      .submit(class="mintSubmit")
        mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Cell, Field, Header} from 'mint-ui'
import Vue from 'vue'
import formMixin from '../../mixins/formMixin'

Vue.component(Header.name, Header)
Vue.component(Cell.name, Cell)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  mixins: [formMixin],
  name: 'authGoogle',
  data () {
    return {
      form: {
        password: '',
        googleCode: ''
      },
      formState: {
        password: '',
        googleCode: ''
      },
      formMessage: {
        password: '',
        googleCode: ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    checkState (value) {
      if (value === 'password') {
        this.formState.password = this.form.password ? 'success' : ''
        this.formMessage.password = ''
      } else if (value === 'googleCode') {
        this.formState.googleCode = this.form.googleCode ? 'success' : ''
        this.formMessage.googleCode = ''
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
        if (this.userInfo.app_two_factor) {
          this.$store.dispatch('axios_unbind_google', {
            password: this.form.password,
            code: this.form.googleCode
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('user.auth_google_del_success'))
              this.getMe()
              this.$router.push('/me/settings')
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_google_del_fail'))
          })
        } else {
          this.$store.dispatch('axios_bind_google', {
            otp_secret: this.$store.state.googleKey,
            password: this.form.password,
            code: this.form.googleCode
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('user.auth_google_add_success'))
              this.getMe()
              this.$router.push('/me/settings')
            }
          }).catch(() => {
            // this.$message.error(this.$t('user.auth_google_add_fail'))
          })
        }
      }
    },
    doInit () {
      this.getMe()
      this.checkAllState()
    }
  },
  mounted () {
    this.doInit()
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

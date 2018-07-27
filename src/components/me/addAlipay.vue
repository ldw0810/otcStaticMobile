<template lang="pug">
  .addAlipay
    mt-header(:title="$t('user.alipay_add')" fixed)
      router-link(to="/me/addCollection" slot="left")
        mt-button(icon="back")
    .content
      mt-field(:label="$t('user.alipay_userName')" :placeholder="$t('user.alipay_userName_required')" v-model="form.username" :state="formState.username" @input="checkState('username')")
      mt-field(:label="$t('user.alipay_account')" :placeholder="$t('user.alipay_account_required')" v-model="form.account" :state="formState.account" @input="checkState('account')")
      mt-field(:label="$t('user.alipay_reAccount')" :placeholder="$t('user.alipay_reAccount_required')" v-model="form.reAccount" :state="formState.reAccount" @input="checkState('reAccount')")
    .submit(class="mintSubmit")
      mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import {VALI_ALIPAY_NAME, VALI_ALIPAY_ACCOUNT} from '../../utils/validator'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'addAlipay',
  data () {
    return {
      form: {
        username: '',
        account: '',
        reAccount: ''
      },
      formState: {
        username: '',
        account: '',
        reAccount: ''
      },
      formMessage: {
        username: '',
        account: '',
        reAccount: ''
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
      if (value === 'username') {
        if (this.form.username) {
          if (this.form.username.length > VALI_ALIPAY_NAME.max || this.form.username.length < VALI_ALIPAY_NAME.min) {
            this.formState.username = 'error'
            this.formMessage.username = VALI_ALIPAY_NAME.message
          } else {
            this.formState.username = 'success'
            this.formMessage.username = ''
          }
        } else {
          this.formState.username = ''
          this.formMessage.username = ''
        }
      } else if (value === 'account') {
        if (this.form.reAccount) {
          if (this.form.reAccount === this.form.account) {
            this.formState.reAccount = 'success'
            this.formMessage.reAccount = ''
          } else {
            this.formState.reAccount = 'error'
            this.formMessage.reAccount = this.$t('user.alipay_account_different')
          }
        } else {
          if (this.form.account) {
            if (this.form.account.length > VALI_ALIPAY_ACCOUNT.max || this.form.account.length < VALI_ALIPAY_ACCOUNT.min) {
              this.formState.account = 'error'
              this.formMessage.account = VALI_ALIPAY_ACCOUNT.message
            } else {
              this.formState.account = 'success'
              this.formMessage.account = ''
            }
          } else {
            this.formState.account = ''
            this.formMessage.account = ''
          }
        }
      } else if (value === 'reAccount') {
        if (this.form.reAccount) {
          if (this.form.reAccount === this.form.account) {
            this.formState.reAccount = 'success'
            this.formMessage.reAccount = ''
          } else {
            this.formState.reAccount = 'error'
            this.formMessage.reAccount = this.$t('user.alipay_account_different')
          }
        } else {
          this.formState.reAccount = ''
          this.formMessage.reAccount = ''
        }
      }
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.$loading.open()
        this.$store.dispatch('axios_add_receiving', {
          name: this.form.username,
          account: this.form.account
        }).then(res => {
          this.$loading.close()
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('user.receivables_add_success'))
            this.$router.push('/me/collectionList')
          }
        }).catch(() => {
          this.$loading.close()
          this.$message.error(this.$t('user.receivables_add_fail'))
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
  .addAlipay {
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

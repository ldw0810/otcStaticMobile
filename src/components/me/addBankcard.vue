<template lang="pug">
  .addBankcard
    mt-header(:title="$t('user.bankCard_add')" fixed)
      router-link(to="/me/addCollection" slot="left")
        mt-button(icon="back")
    .content
      mt-field(:label="$t('user.bankCard_userName')" :placeholder="$t('user.bankCard_userName_required')" v-model="form.username" :state="formState.username" @input="checkState('username')")
      mt-field(:label="$t('user.bankCard_bank_select')" :placeholder="$t('user.bankCard_bank_required')" v-model="form.bank" :state="formState.bank" @input="checkState('bank')" readonly)
        mt-button(icon="more" @click.native="bankActionFlag = true")
      mt-field(:label="$t('user.bankCard_number')" :placeholder="$t('user.bankCard_number_required')" v-model="form.account" :state="formState.account" @input="checkState('account')")
      mt-field(:label="$t('user.bankCard_reNumber')" :placeholder="$t('user.bankCard_reNumber_required')" v-model="form.reAccount" :state="formState.reAccount" @input="checkState('reAccount')")
    .submit(class="mintSubmit")
      mt-button(@click="submit" :disabled="!formStateAll") {{$t('public.confirm')}}
    mt-actionsheet(v-model="bankActionFlag" :actions="bankActionList")
</template>
<script type="es6">
import {Button, Field, Header, Actionsheet} from 'mint-ui'
import Vue from 'vue'
import {VALI_CARD_HOLDER, VALI_CARD_NUMBER} from '../../utils/validator'

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)
Vue.component(Actionsheet.name, Actionsheet)

export default {
  name: 'addBankcard',
  data () {
    return {
      form: {
        username: '',
        bank: '',
        account: '',
        reAccount: ''
      },
      formState: {
        username: '',
        bank: '',
        account: '',
        reAccount: ''
      },
      formMessage: {
        username: '',
        bank: '',
        account: '',
        reAccount: ''
      },
      bankCode: '',
      bankList: [],
      bankActionFlag: false
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
    },
    bankActionList () {
      if (this.bankList.length) {
        return this.bankList.map((item, index) => {
          return {
            name: item.name,
            index: index,
            method: this.changeBank
          }
        })
      } else {
        return []
      }
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
          if (this.form.username.length > VALI_CARD_HOLDER.max || this.form.username.length < VALI_CARD_HOLDER.min) {
            this.formState.username = 'error'
            this.formMessage.username = VALI_CARD_HOLDER.message
          } else {
            this.formState.username = 'success'
          }
        } else {
          this.formState.username = ''
        }
      } else if (value === 'bank') {
        this.formState.bank = this.form.bank ? 'success' : ''
      } else if (value === 'account') {
        if (this.form.reAccount) {
          if (this.form.reAccount === this.form.account) {
            this.formState.reAccount = 'success'
            this.formMessage.reAccount = ''
          } else {
            this.formState.reAccount = 'error'
            this.formMessage.reAccount = this.$i18n.translate('user.bankCard_number_different')
          }
        } else {
          if (this.form.account) {
            if (this.form.account.length > VALI_CARD_NUMBER.max || this.form.account.length < VALI_CARD_NUMBER.min) {
              this.formState.account = 'error'
              this.formMessage.account = VALI_CARD_NUMBER.message
            } else {
              this.formState.account = 'success'
            }
          } else {
            this.formState.account = ''
          }
        }
      } else if (value === 'reAccount') {
        if (this.form.reAccount) {
          if (this.form.reAccount === this.form.account) {
            this.formState.reAccount = 'success'
            this.formMessage.reAccount = ''
          } else {
            this.formState.reAccount = 'error'
            this.formMessage.reAccount = this.$i18n.translate('user.bankCard_number_different')
          }
        } else {
          this.formState.reAccount = ''
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
          bank: this.bankCode,
          account: this.form.account
        }).then(res => {
          this.$loading.close()
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$i18n.translate('user.receivables_add_success'))
            this.$router.push('/me/collectionList')
          }
        }).catch(() => {
          this.$loading.close()
          this.$message.error(this.$i18n.translate('user.receivables_add_fail'))
        })
      }
    },
    changeBank (item) {
      const index = +item.index || 0
      if (this.bankList[index]) {
        this.bankCode = this.bankList[index].code
        this.form.bank = this.bankList[index].name
      }
    },
    getBankList () {
      this.$store.dispatch('axios_banks').then(res => {
        if (res.data && +res.data.error === 0) {
          this.bankList = res.data.list || []
        }
      }).catch(() => {
        this.$message.error(this.$t('user.banks_request_fail'))
      })
    },
    init () {
      this.$loading.close()
      this.getBankList()
      this.checkAllState()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .addBankcard {
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

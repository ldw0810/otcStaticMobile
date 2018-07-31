<template lang="pug">
  .assetDetail
    mt-header(:title="$t('public.asset') + ' - ' + currency.toUpperCase()" fixed)
      router-link(to="/asset" slot="left")
        mt-button(icon="back")
    .page(v-if="userInfo.id && userInfo.valid_account[currencyIndex]")
      .content
        .asset
          .banner
            .currency
              .logo(v-if="currencyDefaultData[currency]")
                img(v-lazy="currencyDefaultData[currency]['img']" :key="currencyDefaultData[currency]['img']")
              .text {{currency.toUpperCase()}}
            .amount {{userInfo.valid_account[currencyIndex].amount | $fixDecimalsAsset()}}
          .border
          .banner
            .balance
              .number {{userInfo.valid_account[currencyIndex].balance | $fixDecimalsAsset()}}
              .text {{$t('public.balance')}}
            .locked
              .number {{userInfo.valid_account[currencyIndex].locked | $fixDecimalsAsset()}}
              .text {{$t('public.locked')}}
        .oper
          .operDiv
            .btn(@click="goOper(0)")
              .text(:class="{'focus': assetOperIndex === 0}") {{$t('public.recharge')}}
            .btn(@click="goOper(1)")
              .text(:class="{'focus': assetOperIndex === 1}") {{$t('public.withdraw')}}
          .border
          .operContent
            mt-tab-container(v-model="assetOperIndex")
              mt-tab-container-item(:id="0")
                .wrapper(v-if="deposit.account.length")
                  .depositPage(v-if="deposit.account[0].deposit_address")
                    .text {{$t('asset.asset_recharge_address')}}:
                    .address(v-clipboard:copy="deposit.account[0].deposit_address" v-clipboard:success="copySuccess") {{deposit.account[0].deposit_address}}
                    .tip(v-html="$t('asset.asset_recharge_address_tip', {'0': deposit.deposit_channels ? +deposit.deposit_channels.max_confirm: 0, '1': deposit.deposit_channels ? +deposit.deposit_channels.min_value: 0, '2': currency.toUpperCase()})")
                  .noAddressPage(v-else)
                    .tip {{$t('asset.asset_recharge_address_get_tip')}}
                    mt-button(class="goBtn" @click.native.prevent="getAddress") {{$t('asset.asset_recharge_address_get')}}
              mt-tab-container-item(:id="1")
                .wrapper(v-if="withdraw.withdraw_channels.id")
                  .withdrawPage(v-if="userInfo.mobile || userInfo.app_two_factor")
                    .addressForm
                      mt-cell(v-if="withdraw.fund_sources.length" :title="$t('asset.asset_withdraw_address')" @click.native.prevent="withdrawAddressFlag = true" is-link)
                        .label {{form.selectAddress.label}}
                      mt-field(v-if="!withdraw.fund_sources.length || withdrawAddressAddFlag" :label="$t('public.label')" :placeholder="$t('asset.asset_withdraw_label_required')" v-model="form.label" :state="formState.label" @input="checkState('label')")
                      mt-field(v-if="!withdraw.fund_sources.length || withdrawAddressAddFlag" :label="$t('asset.asset_withdraw_address')" :placeholder="$t('asset.asset_withdraw_address_required')" v-model="form.address" :state="formState.address" @input="checkState('address')")
                      mt-field(class="numberBtn" :label="$t('asset.asset_withdraw_number')" :placeholder="amountText" v-model="form.number" :state="formState.number" @input="checkState('number')")
                        .right(name="slot")
                          .currency {{currency.toUpperCase()}}
                          mt-button(class="withdrawAllBtn" @click.native.prevent="form.number = amount") {{$t('asset.asset_withdraw_all')}}
                    .tip {{$t('asset.asset_withdraw_address_tip', {'0': withdraw.withdraw_channels.min, '1': withdraw.withdraw_channels ? withdraw.withdraw_channels.fee : 0, '2': currency.toUpperCase()})}}
                    .mintSubmit
                      mt-button(:disabled="!formStateAll" @click.native.prevent="checkAndShowConfirm") {{$t('public.submit')}}
                  .noAuthPage(v-else)
                    .text {{$t('asset.asset_withdraw_no_auth', {'0': currency.toUpperCase()})}}
                    mt-button(class="goBtn" @click.native.prevent="$router.push('/me/settings')") {{$t('asset.asset_go_set_auth')}}
      .footer(class="historyButton")
        mt-button(@click="$router.push('/assetHistory')") {{$t('asset.asset_withdraw_and_recharge_history')}}
    transition(name="slide-right" mode="out-in")
      .popPage
        .popup(class="popup-right" v-if="withdrawAddressFlag")
          slot
            SelectWithdrawAddress(@close="withdrawAddressFlag = false" @success="showWithdrawAddress" @add="addWithdrawAddress")
        .popup(class="popup-right" v-if="withdrawConfirmFlag")
          slot
            WithdrawConfirm(:currency="currency" :form="form" :currencyFee="withdraw.withdraw_channels.fee" @close="withdrawConfirmFlag = false" @success="showAuth")
        .popup(class="popup-right" v-if="withdrawAuthPhoneFlag")
          slot
            ValidatePhone(:needAuth="false" @close="withdrawAuthPhoneFlag = false" @success="doWithdraw" @change="changeValidate(0)")
        .popup(class="popup-right" v-if="withdrawAuthGoogleFlag")
          slot
            ValidateGoogle(:needAuth="false" @close="withdrawAuthGoogleFlag = false" @success="doWithdraw" @change="changeValidate(1)")
        .popup(class="popup-right" v-if="WithdrawEmailFlag")
          slot
            WithdrawEmail(@close="WithdrawEmailFlag = false" :withdraw_id="withdrawId" :currency="currency")
</template>
<script type="es6">
import {Button, Cell, Field, Header, MessageBox, TabContainer, TabContainerItem} from 'mint-ui'
import Vue from 'vue'
import ethereumAddress from 'ethereum-address'
import SelectWithdrawAddress from './selectWithdrawAddress'
import WithdrawConfirm from './withdrawConfirm'
import {$fixDecimalsAsset} from '../../utils'
import {VALI_ADDRESS_LABEL, VALI_NUMBER} from '../../utils/validator'
import ValidatePhone from '../common/ValidatePhone'
import ValidateGoogle from '../common/ValidateGoogle'
import WithdrawEmail from './withdrawEmail';

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)
Vue.component(Cell.name, Cell)
Vue.component(MessageBox.name, MessageBox)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)

export default {
  name: 'assetDetail',
  components: {WithdrawEmail, ValidatePhone, ValidateGoogle, WithdrawConfirm, SelectWithdrawAddress},
  data () {
    return {
      assetOperIndex: this.$route.query.oper === 'deposit' ? 0 : 1,
      defaultCollectionIndex: -1,
      currencyDefaultData: {
        'dai': {
          img: require('../../assets/images/trade/CoinLogo-DAI.png')
        },
        'eth': {
          img: require('../../assets/images/trade/CoinLogo-ETH.png')
        },
        'omt': {
          img: require('../../assets/images/trade/CoinLogo-OMT.svg')
        },
        'ck': {
          img: require('../../assets/images/trade/CoinLogo-CAT.png')
        }
      },
      form: {
        selectAddress: {},
        label: '',
        address: '',
        number: ''
      },
      formState: {
        selectAddress: '',
        label: '',
        address: '',
        number: ''
      },
      formMessage: {
        selectAddress: '',
        label: '',
        address: '',
        number: ''
      },
      withdrawAddressFlag: false,
      withdrawAddressAddFlag: false,
      withdrawConfirmFlag: false,
      withdrawAuthPhoneFlag: false,
      withdrawAuthGoogleFlag: false,
      WithdrawEmailFlag: false,
      withdrawId: ''
    }
  },
  watch: {
    $route: function () {
      this.init()
    },
    'withdrawAddressAddFlag': function () {
      this.checkAllState()
    }
  },
  computed: {
    deposit () {
      return this.$store.state.deposit
    },
    withdraw () {
      return this.$store.state.withdraw
    },
    currency () {
      return this.$route.query.currency || (this.userInfo.valid_account.length && this.userInfo.valid_account[0].currency) || configure.CONF_DIGITAL_CURRENCY_LIST[0].currency
    },
    currencyIndex () {
      if (this.userInfo.valid_account.length) {
        for (let i = 0; i < this.userInfo.valid_account.length; i++) {
          if (this.currency === this.userInfo.valid_account[i].currency) {
            return i
          }
        }
      } else {
        return -1
      }
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    account () {
      let index = 0
      for (let i = 0; i < this.userInfo.valid_account.length; i++) {
        if (this.userInfo.valid_account[i] &&
            this.userInfo.valid_account[i].currency === this.currency) {
          index = i
          break
        }
      }
      return this.userInfo.valid_account[index] || {}
    },
    amount () {
      return this.account ? $fixDecimalsAsset(this.account.balance) : 0
    },
    amountText () {
      return this.$t('asset.asset_add_balance') + ': ' + $fixDecimalsAsset(this.amount)
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
      if (value === 'selectAddress') {
        if (this.withdraw.fund_sources.length) {
          if (!this.withdrawAddressAddFlag) {
            this.formState.selectAddress = this.form.selectAddress.id ? 'success' : ''
            this.formMessage.selectAddress = ''
          } else {
            this.formState.selectAddress = 'success'
            this.formMessage.selectAddress = ''
          }
        } else {
          this.formState.selectAddress = 'success'
          this.formMessage.selectAddress = ''
        }
      } else if (value === 'label') {
        if (this.withdraw.fund_sources.length && !this.withdrawAddressAddFlag) {
          this.formState.label = 'success'
          this.formMessage.label = ''
        } else {
          if (!this.form.label.length) {
            this.formState.label = ''
            this.formMessage.label = ''
          } else if (this.form.label.length <= VALI_ADDRESS_LABEL.max && this.form.label.length >= VALI_ADDRESS_LABEL.min) {
            this.formState.label = 'success'
            this.formMessage.label = ''
          } else {
            this.formState.label = 'error'
            this.formMessage.label = VALI_ADDRESS_LABEL.message
          }
        }
      } else if (value === 'address') {
        if (this.withdraw.fund_sources.length && !this.withdrawAddressAddFlag) {
          this.formState.address = 'success'
          this.formMessage.address = ''
        } else {
          if (!this.form.address.length) {
            this.formState.address = ''
            this.formMessage.address = ''
          } else if (ethereumAddress.isAddress(this.form.address)) {
            this.formState.address = 'success'
            this.formMessage.address = ''
          } else {
            this.formState.address = 'error'
            this.formMessage.address = this.$t('asset.asset_withdraw_address_invalid')
          }
        }
      } else if (value === 'number') {
        this.form.number += ''
        if (!this.form.number.length) {
          this.formState.number = ''
          this.formMessage.number = ''
        } else if (!VALI_NUMBER.regexp(this.form.number)) {
          this.formState.number = 'error'
          this.formMessage.number = VALI_NUMBER.message
        } else if (+this.form.number > +$fixDecimalsAsset(this.account['balance'] || 0)) {
          this.formState.number = 'error'
          this.formMessage.number = this.$t('public.balance_insufficient')
        } else if (+this.form.number < (this.withdraw.withdraw_channels.min || 0)) {
          this.formState.number = 'error'
          this.formMessage.number = this.$t('asset.asset_withdraw_number_required', {
            '0': (this.withdraw.withdraw_channels.min || 0),
            '1': this.currency.toUpperCase()
          })
        } else {
          this.formState.number = 'success'
          this.formMessage.number = ''
        }
      }
    },
    goOper (index) {
      this.$router.push({
        path: this.$route.path,
        query: {
          currency: this.currency,
          oper: index === 0 ? 'deposit' : 'withdraw'
        }
      })
    },
    copySuccess () {
      this.$message.success(this.$t('public.invite_copy_success'))
    },
    showWithdrawAddress (item) {
      this.form.selectAddress = item
      this.withdrawAddressAddFlag = false
      this.checkAllState()
    },
    addWithdrawAddress () {
      this.form.selectAddress = {}
      this.withdrawAddressAddFlag = true
      this.checkAllState()
    },
    getAddress () {
      this.$loading.open()
      this.$store.dispatch('axios_gen_address', {
        currency: this.currency
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.getData()
        }
      }).catch(() => {
        this.$message.error(this.$t('asset.asset_address_request_fail'))
      })
    },
    get_address_id (val) {
      this.setAddress = val || ''
      if (val === 1000) {
        this.initFormData()
        this.addNewAddressStatus = true
      } else if (val) {
        this.$refs.select && this.$refs.select.updateOptions()
        this.addNewAddressStatus = false
        for (let i = 0; i < this.withdraw.fund_sources.length; i++) {
          if (val === this.withdraw.fund_sources[i].id + '-' + this.withdraw.fund_sources[i].uid) {
            this.form.id = this.withdraw.fund_sources[i].id
            this.form.label = this.withdraw.fund_sources[i].extra
            this.form.labelPlus = this.withdraw.fund_sources[i].extra
            this.form.address = this.withdraw.fund_sources[i].uid
            this.form.addressPlus = this.withdraw.fund_sources[i].uid
            return false
          }
        }
      } else {
        this.initFormData()
        this.addNewAddressStatus = false
      }
    },
    getData () {
      if (this.assetOperIndex === 0) {
        this.$store.dispatch('axios_get_deposit', {
          currency: this.currency,
          limit: this.deposit.per_page,
          page: this.deposit.page
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('deposit_setter', res.data)
          }
        }).catch(() => {
        })
      } else {
        this.$store.dispatch('axios_get_withdraw', {
          currency: this.currency,
          limit: this.withdraw.per_page,
          page: this.withdraw.page
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('withdraw_setter', res.data)
            this.checkAllState()
            this.get_address_id()
          }
        }).catch(() => {
        })
      }
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    checkAndShowConfirm () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.withdrawConfirmFlag = true
      }
    },
    changeValidate (value) {
      if (+value === 0) {
        this.withdrawAuthPhoneFlag = false
        this.withdrawAuthGoogleFlag = true
      } else {
        this.withdrawAuthGoogleFlag = false
        this.withdrawAuthPhoneFlag = true
      }
    },
    showAuth () {
      if (this.userInfo.mobile) {
        this.withdrawAuthPhoneFlag = true
      } else if (this.userInfo.app_two_factor) {
        this.withdrawAuthGoogleFlag = true
      }
    },
    doWithdraw (authForm) {
      this.$loading.open()
      let requestData = {
        currency: this.currency,
        sum: +this.form.number
      }
      if (!this.withdrawAddressAddFlag) {
        requestData.fund_source_id = this.form.selectAddress.id
      } else {
        requestData.uid = this.form.address
        requestData.extra = this.form.label
      }
      if (typeof authForm === 'object') {
        console.log(1)
        requestData = Object.assign(authForm, requestData)
      }
      this.$store.dispatch('axios_withdraw', requestData).then(res => {
        if (res.data && (res.data.uid || res.data.error === 0)) {
          this.withdrawId = res.data.id
          this.init()
          this.withdrawEmailFlag = true
        } else if (res.data && +res.data.error === 100017) {
          if (this.userInfo.mobile) {
            this.withdrawAuthPhoneFlag = true
          } else if (this.userInfo.app_two_factor) {
            this.withdrawAuthGoogleFlag = true
          }
        }
      }).catch(() => {
        this.$message.error(this.$t('asset.asset_withdraw_fail'))
      })
    },
    init () {
      this.getMe()
      this.assetOperIndex = this.$route.query.oper === 'withdraw' ? 1 : 0
      this.getData()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  footerHeight = 12vh
  .assetDetail {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
  }

  .content {
    flex 1
    margin-top $mintHeaderHeight
    height 100 - $mintHeaderHeight - footerHeight
    .asset {
      display flex
      flex-direction column
      align-items center
      margin-top 1vh
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      background #FFFFFF
      .banner {
        flex 1
        height 10vh
        width 100vw
        display flex
        align-items center
        .currency {
          flex 1
          display flex
          align-items center
          justify-content flex-start
          .logo {
            margin-left 10vw
            height 8vw
            width 8vw
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          .text {
            margin-left 5vw
            font-size 1.2rem
            font-weight normal
          }
        }
        .amount {
          flex 1
          display flex
          align-items center
          justify-content center
          font-size 1.2rem
          font-weight normal
        }
        .balance {
          flex 1
          display flex
          align-items center
          flex-direction column
          justify-content center
          .number {
            color #666666
            font-size 1rem
          }
          .text {
            color #CCCCCC
            font-size 0.8rem
          }
        }
        .locked {
          flex 1
          display flex
          align-items center
          flex-direction column
          justify-content center
          .number {
            color #666666
            font-size 1rem
          }
          .text {
            color #CCCCCC
            font-size 0.8rem
          }
        }
      }
      .border {
        display flex
        align-items center
        height 1px
        width 80vw
        background #EEEEEE
      }
    }
    .oper {
      display flex
      flex-direction column
      align-items center
      margin-top 1vh
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      background #FFFFFF
      .operDiv {
        display flex
        align-items center
        justify-content center
        width 100vw
        height $subTitleHeaderHeight
        .btn {
          flex 1
          display flex
          align-items center
          justify-content center
          .text {
            color #999999
            font-size 0.85rem
            font-weight lighter
          }
          .focus {
            color #333333
            font-size 1rem
            font-weight normal
            border-bottom 0.3vh solid
            border-color #333333
          }
        }
      }
      .border {
        display flex
        align-items center
        height 1px
        width 80vw
        background #EEEEEE
      }
      .operContent {
        width 100vw
        .depositPage {
          padding 5vh 8vw
          overflow-y scroll
          .text {
            font-size 1rem
            color #333333
            font-weight normal
            padding-bottom 2.5vh
          }
          .address {
            font-size 1.2rem
            color #2EA2F8
            font-weight normal
            padding-bottom 2.5vh
            cursor pointer
          }
          .tip {
            font-size 0.8rem
            color #999999
          }
        }
        .withdrawPage {
          display flex
          flex-direction column
          align-items center
          justify-content center
          height 55vh
          overflow-y scroll
          .addressForm {
            .label {
              max-width 68vw
              word-break break-all
            }
            .numberBtn {
              .right {
                display flex
                align-items center
                justify-content center
                margin 0 1vw
              }
              .currency {
                font-size 0.9rem
                color: #354052;
                font-weight normal
              }
              .withdrawAllBtn {
                margin-left 5vw
                min-width 20vw
                height 5vh
                color #333333
                background: #FFFFFF;
                border: 1px solid rgba(0, 0, 0, 0.10);
                box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
                border-radius: 2px;
                font-size: 0.8rem;
                line-height 1.2
                text-align: center;
                display flex
                align-items center
                justify-content center
              }
            }
          }
          .tip {
            padding 5vh 8vw 0
            font-size 0.8rem
            color #999999
          }
          .mintSubmit {
            padding 5vh 0
          }
        }
        .noAuthPage {
          display flex
          flex-direction column
          align-items center
          justify-content center
          padding 5vh 8vw
          overflow-y scroll
          .text {
            color #333333
            font-weight normal
            font-size 0.9rem
            margin-bottom 2.5vh
          }
        }
        .noAddressPage {
          display flex
          align-items center
          flex-direction column
          width 100vw
          margin 15vh 0
          overflow-y scroll
          .tip {
            color #333333
            font-weight normal
            font-size 0.9rem
            margin-bottom 2.5vh
          }
        }
      }
    }
  }

  .goBtn {
    min-width 32vw
    color #FFFFFF
    background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
    box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
    margin-top: 1vh;
    font-size: 0.8rem;
    line-height 1.2
    text-align: center;
    border-radius: 6px;
    display flex
    align-items center
    justify-content center
  }

  .footer {
    height footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }

  /deep/ .historyButton {
    display flex
    align-items center
    justify-content center
    .mint-button {
      width 72vw
      color #333333
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.10);
      box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
      border-radius: 2px;
      .mint-button-text {
        font-size 1rem
      }
    }
    .mint-button.is-disabled {
      background: #C8D4E0;
    }
  }

  /deep/ .numberBtn.mint-cell {
    width 100vw
    .mint-cell-title {
      width auto
    }
    .mint-cell-value {
      flex 1
      margin-left 2.5vw
    }
  }
</style>
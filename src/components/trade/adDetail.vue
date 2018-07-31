<template lang="pug">
  .adDetail
    mt-header(:title="(adType === 0 ? $t('public.buy') : $t('public.sell')) + currency.toUpperCase()" fixed)
      router-link(:to="backLink" slot="left")
        mt-button(icon="back")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .wrapper(v-if="ad.id")
      .content
        .user
          .wrapper
            Avatar(class="avatar" :status='ad.member.online' :statusType="2")
            .name {{ad.member.nickname}}
          .info
            .tradeNumber {{$t("order.order_trade_count", {'0': ad.member.stat.trade_count})}}
            .border |
            .goodRate {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
            .email
              img(src="../../assets/images/icon/Email-999999.svg")
            .phone(v-if="ad.member.mobile")
              img(src="../../assets/images/icon/Phone-999999.svg")
        .ad
          .price
            .title {{$t('order.order_offer')}}
            .text {{ad.current_price | $fixDecimalAuto(ad.targetCurrency)}} {{ad.target_currency.toUpperCase() + '/' + ad.currency.toUpperCase()}}
          .limit
            .title {{$t('order.order_trade_limit')}}
            .text {{ad.min_limit | $fixDecimalAuto(ad.targetCurrency)}} - {{ad.order_limit | $fixDecimalAuto(ad.targetCurrency)}}
          .payment
            .title {{$t('order.order_order_payment')}}
            .text {{$t('public.' + ad.pay_kind)}}
          .remark
            .title {{$t('ad.ad_remark')}}
            .text {{ad.remark}}
        .inputDiv
          .title
            mt-field(type="number" :label="adType === 0 ? $t('ad.ad_buy_money_amount'): $t('ad.ad_sell_money_amount')" :placeholder="adType === 0 ? $t('order.order_buy_money_amount'): $t('order.order_sell_money_amount')" v-model="form.amount" :state="formState.amount" @input="checkState('amount')")
              .currency {{targetCurrency.toUpperCase()}}
            mt-field(type="number" :label="adType === 0 ? $t('order.order_buy_number_title'): $t('order.order_sell_number_title')" :placeholder="adType === 0 ? $t('order.order_buy_number'): $t('order.order_sell_number')" v-model="form.number" :state="formState.number" @input="checkState('number')")
              .currency {{currency.toUpperCase()}}
        .footer
          mt-button(class="submitButton" type='primary' @click="submit") {{adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm')}}
    transition(name="slide-right" mode="out-in")
      .popup(class="popup-right" v-if="popupFlag")
        slot
          Policy(@close="popupFlag = false")
</template>
<script type="es6">
import Policy from '../policy/policy'
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Header, Loadmore, Button, Field} from 'mint-ui'
import Vue from 'vue'
import {$dividedBy, $multipliedBy, $fixDecimalAuto} from '../../utils'

// const configure = require('../../../configure')

Vue.component(Loadmore.name, Loadmore)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'adDetail',
  components: {
    Policy,
    Avatar,
    EmptyList
  },
  data () {
    return {
      ad: {
        member: {
          stat: {}
        }
      },
      form: {
        amount: '',
        number: ''
      },
      formState: {
        amount: '',
        number: ''
      },
      formMessage: {
        amount: '',
        number: ''
      },
      isSelfOrder: false,
      popupFlag: false,
      showRulesFlag: false
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    adType () {
      return this.ad.op_type === 'sell' ? 0 : 1
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    id () {
      return this.$route.query.id
    },
    backLink () {
      return {
        path: this.adType === 0 ? '/buy' : '/sell',
        query: {
          currency: this.currency
        }
      }
    },
    currency () {
      return this.ad.currency || ''
    },
    targetCurrency () {
      return this.ad.targetCurrency || ''
    },
    isLegalTrade () {
      return this.$store.state.code.payable.indexOf(this.targetCurrency) > -1
    },
    balanceObj () {
      let obj = {}
      for (let i = 0; i < this.userInfo.valid_account.length; i++) {
        obj[this.userInfo.valid_account[i].currency] = +this.userInfo.valid_account[i].balance
      }
      return obj
    },
    balanceFlag () {
      if (this.isLegalTrade) {
        if (this.adType !== 1) {
          return true
        } else {
          return this.balanceObj[this.currency] >= this.currencyLimit
        }
      } else {
        if (this.adType !== 1) {
          if (this.balanceObj[this.targetCurrency] >= 0) {
            return +this.balanceObj[this.targetCurrency] >= this.currencyLimit
          } else {
            return true
          }
        } else {
          return this.balanceObj[this.currency] >= this.limitCurrencyPrice
        }
      }
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
      if (value === 'amount') {
        this.formState.oldPassword = this.form.oldPassword ? 'success' : ''
      } else if (value === 'number') {
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
    changeAmount () {
      if (+this.form.amount >= 0) {
        const tempNumber = $dividedBy(+this.form.amount, +this.ad.current_price)
        this.form.number = $fixDecimalAuto(tempNumber, this.ad.currency)
      }
    },
    changeNumber () {
      if (+this.form.number >= 0) {
        const tempAmount = $multipliedBy(+this.form.number, +this.ad.current_price)
        this.form.amount = $fixDecimalAuto(tempAmount, this.ad.target_currency)
      }
    },
    getAd () {
      this.$store.dispatch('axios_get_ad', {
        id: this.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.ad = res.data.info
          if (this.ad.member.id === this.userInfo.id) {
            this.$message.error(this.$t('order.order_join_own_otc_ad'))
            this.$router.push(this.backLink)
          } else if (res.data.info.status === 'closed') {
            this.$message.error(this.$t('order.order_closed'))
            this.$router.push(this.backLink)
          }
        } else if (+res.data.error === 100021) {
          this.$router.push(this.backLink)
        }
      }).catch(() => {
        this.$message.error(this.$t('public.url_request_fail'))
      })
    },
    submit (id) {
    },
    init () {
      this.$loading.close()
      this.getAd()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .adDetail {
    background-color: #fafafa;
    .user {
      height 12.88vh
      width 100vw
      padding ($mintHeaderHeight + 1) $mintContentPaddingWidth 1vh
      border-top 1px solid #EEEEEE
      .wrapper{
        display flex
        align-items center
        .name {
          margin-left 2.5vw
        }
      }
    }
  }
</style>

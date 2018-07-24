<template lang="pug">
  .adDetail
    Header(fixed :leftLink="backLink" :rightText="$t('order.order_trade_notice')" @rightClick="popupFlag = true" :title="(adType === 0 ? $t('public.buy') : $t('public.sell')) + currency.toUpperCase()")
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
        .title
        .text
      .limit
        .title
        .text
      .payment
        .title
        .text
      .remark
        .title
        .text
    .inputDiv
      .title
        el-input(class="input" v-model="form.amount" @change="changeAmount" :placeholder="adType === 0 ? $t('order.order_buy_money_amount'): $t('order.order_sell_money_amount')")
          slot {{targetCurrency.toUpperCase()}}
        .icon
        el-input(class="input" v-model="form.number" @change="changeNumber" :placeholder="adType === 0 ? $t('order.order_buy_number'): $t('order.order_sell_number')")
          slot {{currency.toUpperCase()}}
    .footer
      el-button(class="submitButton" type='primary' @click="submit") {{adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm')}}
    transition(name="slide-right" mode="out-in")
      .popup(class="popup-right" v-if="popupFlag")
        slot
          Policy(@close="popupFlag = false")
</template>
<script type="es6">
import Policy from '../policy/policy'
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import Header from '../common/header'
import {Loadmore} from 'mint-ui'
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import {$dividedBy, $multipliedBy, $fixDecimalAuto} from '../../utils'

const configure = require('../../../configure')

Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  name: 'adDetail',
  components: {
    Header,
    Policy,
    Avatar,
    EmptyList
  },
  data () {
    const validateNumberLimitCheck = (rule, value, callback) => {
      if (+this.ad.min_limit > +this.ad.order_limit) {
        callback(new Error(this.$i18n.translate('ad.ad_ceiling_number_notValid')))
      } else if (+value < this.ad.min_limit) {
        callback(new Error(this.$i18n.translate('ad.ad_min_number_required', {
          '0': this.ad.min_limit
        })))
      } else if (+value > this.ad.order_limit) {
        callback(new Error(this.$i18n.translate('ad.ad_ceiling_limit', {
          '0': this.ad.order_limit
        })))
      } else {
        callback()
      }
    }
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
      isSelfOrder: false,
      popupFlag: false
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
    }
  },
  methods: {
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
            this.$message.error(this.$i18n.translate('order.order_join_own_otc_ad'))
            this.$router.push(this.backLink)
          } else if (res.data.info.status === 'closed') {
            this.$message.error(this.$i18n.translate('order.order_closed'))
            this.$router.push(this.backLink)
          }
        } else if (+res.data.error === 100021) {
          this.$router.push(this.backLink)
        }
      }).catch(() => {
        this.$message.error(this.$i18n.translate('public.url_request_fail'))
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

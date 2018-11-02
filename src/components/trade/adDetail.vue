<template lang="pug">
  .adDetail
    mt-header(:title="(adType === 0 ? $t('public.buy') : $t('public.sell')) + currency.toUpperCase()" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .wrapper(v-if="ad.id")
      .content
        .user
          .image
            Avatar(class="avatar" :status='ad.member.online' :statusType="1" :size="6")
            .name {{ad.member.nickname}}
          .info
            .text
              .infoItem {{$t('order.order_trade_count', {'0': ad.member.stat.trade_count})}}
              .infoItem {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
            .icon
              .infoItem
                img(src="../../assets/images/icon/Email-999999.svg")
              .infoItem(v-if="ad.member.mobile")
                img(src="../../assets/images/icon/Phone-999999.svg")
        .ad
          .labelList
            .label {{$t('order.order_offer')}}:
            .label {{$t('order.order_trade_limit')}}:
            .label {{$t('order.order_order_payment')}}:
            .label {{$t('ad.ad_remark')}}:
          .textList
            .text {{ad.current_price | $fixDecimalAuto(targetCurrency)}} {{targetCurrency.toUpperCase() + '/' + currency.toUpperCase()}}
            .text {{ad.min_limit | $fixDecimalAuto(targetCurrency)}}&nbsp;-&nbsp;{{ad.order_limit | $fixDecimalAuto(targetCurrency)}}&nbsp;{{targetCurrency.toUpperCase()}}
            .text {{ad.pay_kind ? $t('public.' + ad.pay_kind) : ''}}
            .textArea {{ad.remark}}
        .border
        .adForm
          .label {{adType === 0 ? $t('order.order_buy_title', {'0': currency.toUpperCase()}): $t('order.order_sell_title', {'0': currency.toUpperCase()})}}
          mt-field(ref="amount" class="submitFormItem" type="number" :tabIndex="1" :label="adType === 0 ? $t('ad.ad_buy_money_amount'): $t('ad.ad_sell_money_amount')" :placeholder="adType === 0 ? $t('order.order_buy_money_amount'): $t('order.order_sell_money_amount')" v-model="form.amount" :state="formState.amount" @input="(value) => {formInput(value, 'amount')}" @blur.native.capture="inputBlur('amount')" @keydown.native="(event) => {doInputNumberKeyDown(event, 'amount')}" @keyup.native.stop="(event) => {doInputNumberKeyUp(event, 'amount')}")
            .currency {{targetCurrency.toUpperCase()}}
          mt-field(ref="number" class="submitFormItem" type="number" :tabIndex="2" :label="adType === 0 ? $t('order.order_buy_number_title'): $t('order.order_sell_number_title')" :placeholder="adType === 0 ? $t('order.order_buy_number'): $t('order.order_sell_number')" v-model="form.number" :state="formState.number" @input="(value) => {formInput(value, 'number')}" @blur.native.capture="inputBlur('number')" @keydown.native="(event) => {doInputNumberKeyDown(event, 'number')}" @keyup.native.stop="(event) => {doInputNumberKeyUp(event, 'number')}")
            .currency {{currency.toUpperCase()}}
      .footer(class="mintSubmit")
        mt-button(class="submitButton" type='primary' @click="submit" :disabled="!formStateAll || isSelfOrder") {{isSelfOrder ? $t('order.order_join_own_otc_ad') : (adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm'))}}
    transition-group(tag="div" name="slide-right")
      .popup(class="popup-right" v-if="showConfirmFlag" :key="1")
        slot
          OrderCreateConfirm(:ad="ad" :form="formCommit" @close="showConfirmFlag = false" @success="createOrder")
      .popup(class="popup-right" v-if="showCompleteFlag" :key="2")
        slot
          AdCompleteConfirm(:ad="ad" :form="formCommit" @close="showCompleteFlag = false" @success="init")
      .popup(class="popup-right" v-if="showRulesFlag" :key="3")
        slot
          Rules(@close="showRulesFlag = false" @success="init")
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import OrderCreateConfirm from './orderCreateConfirm'
import AdCompleteConfirm from './adCompleteConfirm'
import Rules from '../policy/rules'
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import {$dividedBy, $fixDecimalAuto, $fixDecimalMax, $multipliedBy} from '../../utils'
import formMixin from '../../mixins/formMixin'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  mixins: [formMixin],
  name: 'adDetail',
  components: {
    Avatar,
    EmptyList,
    OrderCreateConfirm,
    AdCompleteConfirm,
    Rules
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
      formCommit: {
        amount: 0,
        number: 0
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
      showConfirmFlag: false,
      showCompleteFlag: false,
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
    shareId () {
      return this.$store.state.shareId
    },
    currency () {
      return this.ad.currency || ''
    },
    targetCurrency () {
      return this.ad.target_currency || ''
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
    orderLimitNumber () {
      return $fixDecimalAuto($dividedBy(+this.ad.order_limit, +this.ad.current_price), this.currency)
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    checkState (value) {
      if (value === 'amount') {
        if (this.form.amount) {
          if (!/^[0-9]+.?[0-9]*$/.test(this.form.amount)) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('validate.must_be_number')
          } else if (+this.form.amount < +this.ad.min_limit) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('ad.ad_floor_limit')
          } else if (+this.form.amount > +this.ad.order_limit) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('ad.ad_ceiling_limit')
          } else if (!this.checkBalance(value)) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('public.balance_insufficient')
          } else {
            this.formState.amount = 'success'
            this.formMessage.amount = ''
          }
        } else {
          this.formState.amount = ''
          this.formMessage.amount = ''
        }
      } else if (value === 'number') {
        if (this.form.number) {
          if (!/^[0-9]+.?[0-9]*$/.test(this.form.number)) {
            this.formState.number = 'error'
            this.formMessage.number = this.$t('validate.must_be_number')
          } else if (+this.form.number < 0) {
            this.formState.number = 'error'
            this.formMessage.number = this.$t('public.input_number_required')
          } else if (!this.checkBalance(value)) {
            this.formState.number = 'error'
            this.formMessage.number = this.$t('public.balance_insufficient')
          } else {
            this.formState.number = 'success'
            this.formMessage.number = ''
          }
        } else {
          this.formState.number = ''
          this.formMessage.number = ''
        }
      }
    },
    checkBalance (type) {
      if (type === 'amount') {
        if (this.isLegalTrade || +this.adType === 1) {
          return true
        } else {
          return this.balanceObj[this.targetCurrency] >= this.form.amount
        }
      } else if (type === 'number') {
        if (+this.adType === 0) {
          return true
        } else {
          return this.balanceObj[this.currency] >= this.form.number
        }
      }
    },
    formInput (value, type) {
      if (!value) {
        this.changeInput(value, type)
      }
    },
    changeInput (value, type) {
      let tempValue = ''
      if (type === 'amount') {
        if (+value > +this.ad.order_limit) {
          tempValue = $fixDecimalAuto(this.ad.order_limit, this.targetCurrency)
        } else if (value === '' || value === null || value === undefined) {
          tempValue = ''
        } else if (('' + value).lastIndexOf('.') > -1) {
          tempValue = value
        } else if (+value <= 0) {
          tempValue = 0
        } else {
          tempValue = +value
        }
        this.$nextTick(() => {
          this.form.amount = tempValue
          this.formCommit.amount = +tempValue
          this.formCommit.number = $fixDecimalMax($dividedBy(this.formCommit.amount, +this.ad.current_price))
          this.form.number = $fixDecimalAuto(this.formCommit.number, this.currency)
          this.checkAllState()
        })
      } else if (type === 'number') {
        if (+value > +this.orderLimitNumber) {
          tempValue = this.orderLimitNumber
        } else if (value === '' || value === null || value === undefined) {
          tempValue = ''
        } else if (('' + value).lastIndexOf('.') > -1) {
          tempValue = value
        } else if (+value <= 0) {
          tempValue = 0
        } else {
          tempValue = +value
        }
        this.$nextTick(() => {
          this.form.number = tempValue
          this.formCommit.number = +tempValue
          this.formCommit.amount = $fixDecimalMax($multipliedBy(this.formCommit.number, +this.ad.current_price))
          this.form.amount = $fixDecimalAuto(this.formCommit.amount, this.targetCurrency)
          this.checkAllState()
        })
      }
    },
    doInputNumberKeyUp (event, type) {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', '.'].indexOf(event.key) > -1) {
        this.changeInput(event.target.value, type)
      }
    },
    doInputNumberKeyDown (event, type) { // 仅支持：1234567890.上下左右删除
      const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode
      const key = event.key
      const defaultKeyCodeList = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 37, 38, 39, 40]
      const defaultKeyList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
      for (let i = 0; i < defaultKeyCodeList.length; i++) {
        if (+keyCode === defaultKeyCodeList[i] && key === defaultKeyList[i]) {
          return true
        }
      }
      if (+keyCode === 13) {
        if (type === 'amount') {
          return true
        } else if (type === 'number') {
          this.submit()
        }
      } else if (+keyCode === 190 && key === '.') {
        let bindValue = this.form[type]
        if (('' + bindValue).indexOf('.') > -1) {
          event.preventDefault()
        } else {
          return true
        }
      } else {
        event.preventDefault()
      }
    },
    doInputNumberPaste (event) {
      return true
    },
    inputBlur (type) {
      let value = type === 'amount' ? this.form.amount : (type === 'number' ? this.form.number : '')
      value = ('' + value).replace(/^[.]+(.*?)/, '0.$1').replace(/(.*?)[.]+$/, '$1')
      if (type === 'amount') {
        this.form.amount = +value
      } else if (type === 'number') {
        this.form.number = +value
      }
    },
    doNumberKey (event) {
      const value = +event.target.value
      if (value >= 0) {
        let tempAmount = $multipliedBy(value, +this.ad.current_price)
        tempAmount = $fixDecimalAuto(tempAmount, this.targetCurrency)
        if (+tempAmount > +this.ad.order_limit) {
          tempAmount = this.ad.order_limit
        }
        this.form.amount = tempAmount
        const tempNumber = $dividedBy(+this.form.amount, +this.ad.current_price)
        this.form.number = $fixDecimalAuto(tempNumber, this.currency)
      }
      this.checkAllState()
    },
    getAd () {
      this.$loading.open()
      this.$store.dispatch('axios_get_ad', {
        id: this.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.ad = res.data.info
          this.isSelfOrder = (this.ad.member.id === this.userInfo.id)
          if (this.ad.member.id === this.userInfo.id) {
            this.$message.error(this.$t('order.order_join_own_otc_ad'))
          } else if (res.data.info.status === 'closed') {
            this.$message.error(this.$t('order.order_closed'))
            this.goBack()
          }
        } else if (+res.data.error === 100021) {
          this.goBack()
        }
      }).catch(() => {
        // this.$message.error(this.$t('public.url_request_fail'))
      })
    },
    submit () {
      if (this.formMessageAll) {
        this.$message.error(this.formMessageAll)
      } else {
        this.showConfirmFlag = true
      }
    },
    createOrder () {
      this.$loading.open()
      this.$store.dispatch('axios_order_buy', {
        id: this.id,
        price: +this.ad.current_price,
        price_sum: +this.formCommit.amount,
        share_id: this.shareId
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          if (this.isLegalTrade) {
            this.$router.push({
              path: '/order',
              query: {
                id: res.data.order_id
              }
            })
          } else {
            this.showCompleteFlag = true
          }
        } else if (res.data && +res.data.error === 100052) {
          this.goBack()
        } else if (res.data && +res.data.error === 100055) {
          this.init()
        }
      }).catch(() => {
        // this.$message.error(this.$t('order.order_deal_request_fail'))
      })
    },
    init () {
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
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
    .content {
      flex 1
      @extend .scrollPage
      top $mintHeaderHeight
      height 100 - @top - $footerHeight
      -webkit-overflow-scrolling touch
      .user {
        display flex
        flex-direction column
        background #FFFFFF
        height 14vh
        width 100vw
        margin 1vh 0
        padding 0 6vw
        border-top 1px solid #EEEEEE
        border-bottom 1px solid #EEEEEE
        .image {
          margin-top 1vh
          flex 1
          display flex
          align-items center
          .name {
            margin-left 5vw
            font-size 1.2rem
            font-weight normal
            color #333333
            text-overflow ellipsis
            overflow hidden
            white-space nowrap
          }
        }
        .info {
          flex 1
          display flex
          align-items center
          .text {
            flex 1
            display flex
            align-items center
            .infoItem {
              font-size 0.85rem
              font-weight normal
              color #333333
            }
            .infoItem:nth-child(2) {
              margin-left 5vw
            }
          }
          .icon {
            display flex
            align-items center
            .infoItem {
              margin-left 5vw
            }
          }
        }
      }
      .ad {
        display flex
        background #FFFFFF
        width 100vw
        padding 1vh 6vw 5vh
        border-top 1px solid #EEEEEE
        .labelList {
          .label {
            font-size 0.85rem
            font-weight normal
            color #333333
            margin 2.5vh 5vw 0 0
          }
        }
        .textList {
          flex 1
          .text {
            font-size 0.85rem
            font-weight normal
            color #333333
            margin-top 2.5vh
          }
          .textArea {
            font-size 0.85rem
            font-weight normal
            color #333333
            margin-top 2.5vh
          }
        }
      }
      .border {
        margin-left 6vw
        height 1px
        background #EEEEEE
        width 88vw
      }
      .adForm {
        display flex
        flex-direction column
        background #FFFFFF
        width 100vw
        padding 2.5vh 6vw 5vh
        border-bottom 1px solid #EEEEEE
        .label {
          font-size 0.85rem
          font-weight normal
          color #333333
          padding 0 3vw
        }
      }
    }
  }
  .footer {
    position fixed
    width 100vw
    bottom 0
    height $footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
    background #fafafa
  }
  /deep/ .currency {
    font-weight normal
    margin-left 1vw
  }

  /deep/ .mint-field-core {
    font-weight normal
  }
</style>

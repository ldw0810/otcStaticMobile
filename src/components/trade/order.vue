<template lang="pug">
  .order
    mt-header(:title="$t('order.order_detail')" fixed)
      router-link(to="/orderList" slot="left")
        mt-button(icon="back")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .wrapper(v-if="order.id")
      .content
        .info
          .labelList
            .label {{$t('order.order_id')}}:
            .label {{$t('order.order_money_amount')}}:
            .label {{$t('order.order_order_price')}}:
            .label {{orderType === 0 ? $t("order.order_buy_number_title") : $t("order.order_sell_number_title")}}
            .label {{$t('order.order_order_payment')}}:
          .textList
            .text {{ad.current_price | $fixDecimalAuto(targetCurrency)}} {{targetCurrency.toUpperCase() + '/' + currency.toUpperCase()}}
            .text {{ad.min_limit | $fixDecimalAuto(targetCurrency)}} - {{ad.order_limit | $fixDecimalAuto(targetCurrency)}}
            .text {{ad.pay_kind ? $t('public.' + ad.pay_kind) : ''}}
            .textArea {{ad.remark}}
        .border
        .remark
          .label {{$t('ad.ad_remark')}}
          .text {{order.remark}}
        .oper
          .tip {{stepTip}}
          .input
            mt-button(class="submitButton" type='primary' @click="submit" :disabled="!formStateAll || isSelfOrder") {{isSelfOrder ? $t('order.order_join_own_otc_ad') : (adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm'))}}
            mt-button(class="submitButton" type='primary' @click="submit" :disabled="!formStateAll || isSelfOrder") {{isSelfOrder ? $t('order.order_join_own_otc_ad') : (adType === 0 ? $t('order.order_buy_confirm') : $t('order.order_sell_confirm'))}}
        .chat
    transition(name="slide-right" mode="out-in")
      .popPage
        .popup(class="popup-right" v-if="showConfirmFlag")
          slot
            OrderCreateConfirm(:ad="ad" :form="form" @close="showConfirmFlag = false" @success="createOrder")
        .popup(class="popup-right" v-if="showCompleteFlag")
          slot
            OrderCompleteConfirm(:ad="ad" :form="form" @close="showCompleteFlag = false" @success="init()")
        .popup(class="popup-right" v-if="showRulesFlag")
          slot
            Rules(@close="showRulesFlag = false" @success="init()")
</template>
<script type="es6">
import Policy from '../policy/policy'
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import OrderCreateConfirm from './orderCreateConfirm'
import OrderCompleteConfirm from './adCompleteConfirm'
import Rules from '../policy/rules'
import {Button, Field, Header, Loadmore} from 'mint-ui'
import Vue from 'vue'
import {$dividedBy, $fixDecimalAuto, $multipliedBy} from '../../utils'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'order',
  components: {
    Policy,
    Avatar,
    EmptyList,
    OrderCreateConfirm,
    OrderCompleteConfirm,
    Rules
  },
  data () {
    return {
      stepList: [],
      stepTip: '',
      order: {},
      chat: [],
      confirmFlag: {
        pay: false,
        release: false,
        cancel: false,
        complete: false
      },
      showRulesFlag: false,
      evaluate: '0',
      cancelFlag: true,
      authFlag: false,
      chatFlag: false,
      chatMessage: '',
      remainTime: 0,
      timer: 0
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    orderType () {
      return this.order.op_type === 'buy' ? 0 : 1
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
      console.log(this.formMessageAll)
    },
    checkState (value) {
      if (value === 'amount') {
        if (this.form.amount) {
          if (!/^[0-9]+.?[0-9]*$/.test(this.form.amount)) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('validate.must_be_number')
          } else if (this.form.amount < this.ad.min_limit) {
            this.formState.amount = 'error'
            this.formMessage.amount = this.$t('ad.ad_floor_limit')
          } else if (this.form.amount > this.ad.order_limit) {
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
          } else if (this.form.number < 0) {
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
        if (this.isLegalTrade || +this.adType === 0) {
          return true
        } else {
          return this.balanceObj[this.currency] >= this.form.number
        }
      }
    },
    changeInput (value) {
      if (value === 'amount') {
        if (+this.form.amount >= 0) {
          if (+this.form.amount > this.ad.order_limit) {
            this.form.amount = this.ad.order_limit
          }
          const tempNumber = $dividedBy(+this.form.amount, +this.ad.current_price)
          this.form.number = $fixDecimalAuto(tempNumber, this.currency)
        }
      } else if (value === 'number') {
        if (+this.form.number >= 0) {
          const tempAmount = $multipliedBy(+this.form.number, +this.ad.current_price)
          this.form.amount = $fixDecimalAuto(tempAmount, this.targetCurrency)
          if (+this.form.amount > this.ad.order_limit) {
            this.form.amount = this.ad.order_limit
          }
          const tempNumber = $dividedBy(+this.form.amount, +this.ad.current_price)
          this.form.number = $fixDecimalAuto(tempNumber, this.currency)
        }
      }
      this.checkAllState()
    },
    showTip () {
      this.timer && clearTimeout(this.timer)
      if (this.order.status === 'fresh') {
        if (this.remainTime) {
          if (this.remainTime < 0) {
            this.stepTip = this.$t('order.order_info_timeout')
          } else {
            let hour = Math.floor(this.remainTime / 3600)
            let minute = Math.floor((this.remainTime % 3600) / 60)
            let second = Math.floor((this.remainTime % 3600) % 60)
            hour = hour / 10 < 1 ? '0' + hour : hour
            minute = minute / 10 < 1 ? '0' + minute : minute
            second = second / 10 < 1 ? '0' + second : second
            this.stepTip = this.$t('order.order_info_timer', {'0': `<a style="cursor: text;">${+hour > 0 ? (hour + ':') : ''}${minute}:${second}</a>`})
            this.remainTime--
          }
        } else {
          this.stepTip = ''
        }
        this.timer = setTimeout(this.showTip, 1000)
      } else {
        this.stepTip = ''
      }
    },
    getOrder () {
      this.$loading.open()
      this.$store.dispatch('axios_order_info', {
        id: this.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.order = res.data.info
          this.chat = res.data.chat
          this.remainTime = +(res.data.info.remainTime || 0)
          this.showTip()
          this.showStep()
        }
      }).catch(() => {
        this.$message.error(this.$t('order.order_info_request_fail'))
      })
    },
    orderOper (operStr) {
      if (operStr === 'pay') {
        this.confirmPayFlag = true
      } else if (operStr === 'release') {
        this.confirmReleaseFlag = true
      } else if (operStr === 'evaluate') {
        if (+this.evaluate) {
          this.$store.dispatch('axios_order_evaluate', {
            order_id: this.id,
            good: +this.evaluate
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('order.order_pay_evaluate_success'))
              this.getOrder()
            }
          }).catch(() => {
            this.$message.error(this.$t('order.order_pay_evaluate_fail'))
          })
        } else {
          this.$message.error(this.$t('order.order_pay_evaluate_required'))
        }
      } else if (operStr === 'complete') {
        this.confirmCompleteFlag = true
      } else if (operStr === 'cancel') {
        this.confirmCancelFlag = true
      } else {
      }
    },
    doOper (operStr, authJson) {
      if (operStr === 'pay') {
        this.$store.dispatch('axios_order_pay', {
          order_id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.confirmFlag.pay = false
            this.$refs.chat.inputText = this.remarkForm.remark
            this.$refs.chat.sendInfo()
            this.$message.success(this.$t('order.order_pay_complete_success'))
            this.getOrder()
          }
        }).catch(() => {
          this.$message.error(this.$t('order.order_pay_complete_fail'))
        })
      } else if (operStr === 'release') {
        let requestData = {
          order_id: this.id,
          password: this.form.password
        }
        if (authJson) {
          requestData = Object.assign(authJson, requestData)
        }
        this.$store.dispatch('axios_order_release', requestData).then(res => {
          if (res.data && res.data.error === 0) {
            this.confirmFlag.release = false
            this.$message.success(this.$t('order.order_pay_release_success'))
            this.getOrder()
          } else {
            if (res.data.sms || res.data.app) {
              this.confirmFlag.release = false
              this.$store.commit('loginInfo_setter', {
                mobile: res.data.mobile
              })
              this.authFlag = true
            }
          }
        }).catch(() => {
          this.$message.error(this.$t('order.order_pay_release_fail'))
        })
      } else if (operStr === 'complete') {
        this.confirmFlag = {
          pay: false,
          release: false,
          cancel: false,
          complete: false
        }
      } else if (operStr === 'cancel') {
        if (this.cancelFlag) {
          this.$store.dispatch('axios_order_cancel', {
            order_id: this.id
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.cancelFlag = false
              this.confirmFlag.cancel = false
              this.$Message.success(
                this.$t('order.order_pay_cancel_success')
              )
              this.getOrderInfo()
            } else {
              this.cancelFlag = false
              // this.$Message.error(this.$t("order.order_pay_cancel_fail"));
            }
          }).catch(() => {
            this.cancelFlag = false
            // this.$Message.error(this.$t("order.order_pay_cancel_fail"));
          })
        }
      }
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
        price_sum: +this.form.amount
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
          this.$router.push(this.backLink)
        } else {
          this.init()
        }
      }).catch(() => {
        this.$message.error(this.$t('order.order_deal_request_fail'))
        this.init()
      })
    },
    init () {
      this.getOrder()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .order {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
    .content {
      flex 1
      margin-top $mintHeaderHeight
      height 100 - $footerHeight - $mintHeaderHeight
      overflow-y scroll
      .user {
        display flex
        flex-direction column
        background #FFFFFF
        height 14vh
        width 100vw
        margin 1vh 0
        padding 0 6vw
        border-top 1px solid #EEEEEE
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
            font-size 1rem
            font-weight normal
            color #333333
            margin 2.5vh 5vw 0 0
          }
        }
        .textList {
          flex 1
          .text {
            font-size 1rem
            font-weight normal
            color #333333
            margin-top 2.5vh
          }
          .textArea {
            font-size 1rem
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
        padding 2.5vh 0 5vh
        border-bottom 1px solid #EEEEEE
        .label {
          font-size 1rem
          font-weight normal
          color #333333
          padding 0 3vw 2.5vh 3vw
        }
      }
    }
  }

  .footer {
    height $footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }

  /deep/ .currency {
    font-weight normal
    margin-left 1vw
  }

  /deep/ .mint-field-core {
    font-weight normal
  }
</style>

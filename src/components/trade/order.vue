<template lang="pug">
  .order
    mt-header(:title="$t('order.order_detail')" fixed)
      router-link(to="/orderList" slot="left")
        mt-button(icon="back")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .wrapper(v-if="order.id")
      .content
        .info(v-if="triggerInfoFlag")
          .list
            .labelList
              .label {{$t('order.order_id')}}:
              .label {{$t('order.order_money_amount')}}:
              .label {{$t('order.order_order_price')}}:
              .label {{orderType === 0 ? $t("order.order_buy_number_title") : $t("order.order_sell_number_title")}}:
              .label {{$t('order.order_order_payment')}}:
            .textList
              .text {{order.id}}
              .text {{order.amount | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
              .text {{order.price | $fixDecimalAuto(order.currency)}} {{order.target_currency.toUpperCase() + '/' + order.currency.toUpperCase()}}
              .text {{order.price_sum | $fixDecimalAuto(order.currency)}} {{order.currency.toUpperCase()}}
              .text {{order.pay_kind ? $t('public.' + order.pay_kind) : ''}}
            .btn(@click="triggerInfo") {{$t('order.order_hide_detail')}}
          .border
          .remark
            .label {{$t('ad.ad_remark')}}:
            .text {{order.remark}}
        .info(v-else)
          .list
            .labelList
              .label {{$t('order.order_id')}}:
              .label {{$t('order.order_money_amount')}}:
            .textList
              .text {{order.id}}
              .text {{order.amount | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
            .btn(@click="triggerInfo") {{$t('order.order_show_detail')}}
        .oper
          .tip {{stepTip}}
          .submit(class="mintSubmit" v-if="order.status === 'timeout'")
            mt-button(disabled) {{$t('order.order_deal_timeout')}}
          .submit(class="mintSubmit" v-else-if="['cancel', 'judge_seller'].indexOf(order.status) > -1")
            mt-button(disabled) {{$t('order.order_deal_cancel')}}
          .submit(class="mintSubmit" v-else-if="order.status === 'over'")
            mt-button(disabled) {{$t('order.order_deal_complete')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'fresh' && !orderType")
            mt-button(@click="orderOper('pay')") {{$t('order.order_pay_complete')}}
            mt-button(@click="orderOper('cancel')") {{$t('order.order_pay_cancel')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'pay' && !orderType")
            mt-button(disabled) {{$t('order.order_pay_completed')}}
            mt-button(disabled) {{$t('order.order_pay_cancel')}}
          .submit(class="mintSubmit" v-else-if="['fresh', 'pay'].indexOf(order.status) > -1 && orderType")
            mt-button(@click="orderOper('release')") {{$t('order.order_pay_release')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'release' || (order.status === 'sell_eval' && !orderType) || (order.status === 'buy_eval' && orderType)")
            .radio(class="radio" :class="{'radioChecked': radioIndex === 0}" @click="radioIndex = 0") {{$t("order.order_pay_evaluate_good")}}
            .radio(class="radio" :class="{'radioChecked': radioIndex === 1}" @click="radioIndex = 1") {{$t("order.order_pay_evaluate_bad")}}
            mt-button(@click="orderOper('evaluate')") {{$t('order.order_eval')}}
          .submit(class="mintSubmit" v-else)
            mt-button(disabled) {{$t('order.order_status_over')}}
    transition(name="slide-right" mode="out-in")
      .popPage
        .popup(class="popup-right" v-if="confirmFlag.pay")
          slot
            OrderCreateConfirm(:ad="ad" :form="form" @close="confirmFlag.pay = false" @success="init()")
        .popup(class="popup-right" v-if="confirmFlag.release")
          slot
            OrderCompleteConfirm(:ad="ad" :form="form" @close="confirmFlag.release = false" @success="init()")
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
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'

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
      triggerInfoFlag: true,
      showRulesFlag: false,
      evaluate: '0',
      cancelFlag: true,
      authFlag: false,
      chatFlag: false,
      chatMessage: '',
      remainTime: 0,
      timer: 0,
      radioIndex: -1
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
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    triggerInfo () {
      this.triggerInfoFlag = !this.triggerInfoFlag
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
        }
      }).catch(() => {
        this.$message.error(this.$t('order.order_info_request_fail'))
      })
    },
    orderOper (operStr) {
      if (operStr === 'pay') {
        this.confirmFlag.pay = true
      } else if (operStr === 'release') {
        this.confirmFlag.release = true
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
        this.confirmFlag.complete = true
      } else if (operStr === 'cancel') {
        this.confirmFlag.cancel = true
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
              this.getOrder()
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
      .info {
        display flex
        flex-direction column
        margin-top 1vh
        padding 0 6vw 2.5vh
        background #FFFFFF
        border-top 1px solid #EEEEEE
        border-bottom 1px solid #EEEEEE
        .list {
          display flex
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
          }
          .btn {
            margin-top 2.5vh
            color #2EA2F8
            font-size 1rem
          }
        }
        .border {
          align-self center
          margin 2.5vh 0
          height 1px
          width 88vw
          background #EEEEEE
        }
        .remark {
          padding-bottom 2.5vh
          .label {
            font-size 1rem
            font-weight normal
            color #333333
          }
          .text {
            font-size 1rem
            font-weight normal
            color #333333
          }
        }
      }
      .oper {
        display flex
        flex-direction column
        margin-top 1vh
        padding 2.5vh 0
        background #FFFFFF
        border-top 1px solid #EEEEEE
        border-bottom 1px solid #EEEEEE
        .tip {

        }
        .input {

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

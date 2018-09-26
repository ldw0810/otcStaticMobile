<template lang="pug">
  .order
    mt-header(:title="$t('order.order_detail')" fixed)
      router-link(to="/orderList" slot="left")
        mt-button(icon="back")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .wrapper(v-if="order.id")
      .content
        .info(ref="showInfo" class="showInfo")
          .list
            .labelList
              .label {{$t('order.order_id')}}:
              .label {{$t('order.order_money_amount')}}:
              .label(v-if="triggerInfoFlag") {{$t('order.order_order_price')}}:
              .label(v-if="triggerInfoFlag") {{orderType === 0 ? $t('order.order_buy_number_title') : $t('order.order_sell_number_title')}}:
              .label(v-if="triggerInfoFlag") {{$t('order.order_order_payment')}}:
            .textList
              .text {{order.id}}
              .text {{order.price_sum | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
              .text(v-if="triggerInfoFlag") {{order.price | $fixDecimalAuto(order.currency)}} {{order.target_currency.toUpperCase() + '/' + order.currency.toUpperCase()}}
              .text(v-if="triggerInfoFlag") {{order.amount | $fixDecimalAuto(order.currency)}} {{order.currency.toUpperCase()}}
              .text(v-if="triggerInfoFlag") {{order.pay_kind ? $t('public.' + order.pay_kind) : ''}}
            .btn(@click="triggerInfo") {{$t('order.order_hide_detail')}}
          .border
          .remark
            .label {{$t('ad.ad_remark')}}:
            .text {{order.remark}}
        .oper
          .tip(v-if="stepTip" v-html="stepTip")
          .submit(class="mintSubmit" v-if="order.status === 'timeout'")
            mt-button(disabled) {{$t('order.order_deal_timeout')}}
          .submit(class="mintSubmit" v-else-if="['cancel', 'judge_seller'].indexOf(order.status) > -1")
            mt-button(disabled) {{$t('order.order_deal_cancel')}}
          .submit(class="mintSubmit" v-else-if="order.status === 'over'")
            mt-button(disabled) {{$t('order.order_deal_complete')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'fresh' && !orderType")
            mt-button(class="orderSubmitBtn" @click="orderOper('pay')") {{$t('order.order_pay_complete')}}
            mt-button(class="orderCancelBtn" @click="orderOper('cancel')") {{$t('order.order_pay_cancel')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'pay' && !orderType")
            mt-button(class="orderSubmitBtn" disabled) {{$t('order.order_pay_completed')}}
            mt-button(class="orderCancelBtn" disabled) {{$t('order.order_pay_cancel')}}
          .submit(class="mintSubmit" v-else-if="order.status === 'fresh' && orderType")
            mt-button(@click="orderOper('release')" disabled) {{$t('order.order_pay_release')}}
          .submit(class="mintSubmit" v-else-if="order.status === 'pay' && orderType")
            mt-button(@click="orderOper('release')") {{$t('order.order_pay_release')}}
          .submit(class="orderSubmit" v-else-if="order.status === 'release' || (order.status === 'sell_eval' && !orderType) || (order.status === 'buy_eval' && orderType)")
            .radioDiv
              .radio(:class="{'radioChecked': evaluateIndex === 0}" @click="evaluateIndex = 0")
              .radioText {{$t('order.order_pay_evaluate_good')}}
              .radio(class="rightRadio" :class="{'radioChecked': evaluateIndex === 1}" @click="evaluateIndex = 1")
              .radioText  {{$t('order.order_pay_evaluate_bad')}}
            mt-button(class="orderSubmitBtn" @click="orderOper('evaluate')") {{$t('order.order_eval')}}
          .submit(class="mintSubmit" v-else)
            mt-button(disabled) {{$t('order.order_status_over')}}
        .chat
          Chat(ref="chat" :contact="{id: order.member.member_id, name: order.member.nickname}" :order="order" :chatList="chatList" :msg="chatMessage" :chatFlag="chatFlag" @refresh="getOrder" @sendSuccess="inputValue = ''")
      .footer
        mt-field(class="footerInput" type="textarea" :placeholder="$t('order.order_chat_placeholder')" v-model="inputValue" @keyup.enter.native.capture="sendInfo")
    transition(name="slide-right" mode="out-in")
      .popPage
        .popup(class="popup-right" v-if="confirmFlag.cancel")
          slot
            OrderCancelConfirm(@close="confirmFlag.cancel = false" @success="doOper('cancel')")
        .popup(class="popup-right" v-if="confirmFlag.pay")
          slot
            OrderPayConfirm(@close="confirmFlag.pay = false" @success="doPay")
        .popup(class="popup-right" v-if="confirmFlag.release")
          slot
            OrderReleaseConfirm(:order="order" @close="confirmFlag.release = false" @success="doRelease")
        .popup(class="popup-right" v-if="confirmFlag.complete")
          slot
            OrderCompleteConfirm(:order="order" @close="confirmFlag.complete = false" @success="doOper('complete')")
        .popup(class="popup-right" v-if="showRulesFlag")
          slot
            Rules(@close="showRulesFlag = false" @success="init")
        .popup(class="popup-right" v-if="confirmFlag.authPhone")
          slot
            ValidPhone(:needAuth="false" @close="confirmFlag.authPhone = false" @success="doAuthClose" @change="changeValidate(0)")
        .popup(class="popup-right" v-if="confirmFlag.authGoogle")
          slot
            ValidGoogle(:needAuth="false" @close="confirmFlag.authGoogle = false" @success="doAuthClose" @change="changeValidate(1)")
</template>
<script type="es6">
import Policy from '../policy/policy'
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import Rules from '../policy/rules'
import {Button, Field, Header} from 'mint-ui'
import Vue from 'vue'
import OrderPayConfirm from './orderPayConfirm'
import OrderReleaseConfirm from './orderReleaseConfrim'
import OrderCancelConfirm from './orderCancelConfirm'
import OrderCompleteConfirm from './orderCompleteConfrim'
import Chat from './chat'
import ValidPhone from '../common/validPhone'
import ValidGoogle from '../common/validGoogle'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'order',
  components: {
    OrderCompleteConfirm,
    OrderCancelConfirm,
    OrderReleaseConfirm,
    OrderPayConfirm,
    Policy,
    Avatar,
    EmptyList,
    Rules,
    Chat,
    ValidPhone,
    ValidGoogle
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
        complete: false,
        authGoogle: false,
        authPhone: false
      },
      triggerInfoFlag: true,
      triggerInfoTimer: 0,
      triggerInfoHeight: 0,
      triggerInfoMinHeight: 10,
      showRulesFlag: false,
      evaluateIndex: -1,
      chatFlag: false,
      chatMessage: '',
      remainTime: 0,
      timer: 0,
      remark: '',
      password: '',
      inputValue: ''
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    orderType () {
      return this.order.op_type === 'buy' ? 0 : 1
    },
    id () {
      return this.$route.query.id
    },
    chatList () {
      let tempList = []
      let tempTime = 0
      if (this.chat.length) {
        for (let i = this.chat.length - 1; i >= 0; i--) {
          let timeFlag = +this.chat[i].from === 0 ? false : +this.chat[i].created_at * 1000 - tempTime > 3 * 60 * 1000
          tempTime = timeFlag ? +this.chat[i].created_at * 1000 : tempTime
          tempList[this.chat.length - (i + 1)] = {
            type: +this.chat[i].from === 0 ? 9 : this.chat[i].to === this.order.member.member_id ? 0 : 1,
            data: this.chat[i].msg,
            time: +this.chat[i].created_at * 1000,
            compareTime: tempTime,
            timeFlag: timeFlag
          }
        }
      }
      return tempList
    }
  },
  methods: {
    triggerInfo () {
      this.triggerInfoFlag = !this.triggerInfoFlag
    },
    changeValidate (value) {
      if (+value === 0) {
        this.confirmFlag.authPhone = false
        this.confirmFlag.authGoogle = true
      } else {
        this.confirmFlag.authGoogle = false
        this.confirmFlag.authPhone = true
      }
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
            this.stepTip = this.$t('order.order_info_timer', {'0': `<span class="tipTime">${+hour > 0 ? (hour + ':') : ''}${minute}:${second}</span>`})
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
    showAuth () {
      if (this.userInfo.mobile) {
        this.confirmFlag.authPhone = true
      } else if (this.userInfo.app_two_factor) {
        this.confirmFlag.authGoogle = true
      }
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    getOrder () {
      this.$loading.open()
      this.$store.dispatch('axios_order_info', {
        id: this.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.order = res.data.info
          this.chat = res.data.chat
          this.remainTime = +(res.data.info.remain_time || 0)
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
        if (+this.evaluateIndex >= 0) {
          this.$loading.open()
          this.$store.dispatch('axios_order_evaluate', {
            order_id: this.id,
            good: +this.evaluateIndex
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
    doPay (value) {
      this.remark = value
      this.doOper('pay')
    },
    doRelease (value) {
      this.password = value
      this.doOper('release')
    },
    doAuthClose (value) {
      this.doOper('release', value)
    },
    doOper (operStr, authJson) {
      if (operStr === 'pay') {
        this.$loading.open()
        this.$store.dispatch('axios_order_pay', {
          order_id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.confirmFlag.pay = false
            if (this.remark && this.remark.trim()) {
              this.$refs.chat.sendInfo(this.remark)
            }
            this.$message.success(this.$t('order.order_pay_complete_success'))
            this.getOrder()
          }
        }).catch(() => {
          this.$message.error(this.$t('order.order_pay_complete_fail'))
        })
      } else if (operStr === 'release') {
        let requestData = {
          order_id: this.id,
          password: this.password
        }
        if (authJson) {
          requestData = Object.assign(authJson, requestData)
        }
        this.$loading.open()
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
              this.showAuth()
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
        this.$loading.open()
        this.$store.dispatch('axios_order_cancel', {
          order_id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.confirmFlag.cancel = false
            this.$message.success(this.$t('order.order_pay_cancel_success'))
            this.getOrder()
          }
        }).catch(() => {
          this.$message.error(this.$t('order.order_pay_cancel_fail'))
        })
      }
    },
    sendInfo (event) {
      event && event.preventDefault()
      this.$refs.chat.sendInfo(this.inputValue)
    },
    init () {
      this.getMe()
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
      @extend .scrollPage
      flex 1
      margin-top $mintHeaderHeight
      height 100 - $chatFooterHeight - $mintHeaderHeight
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
            position absolute
            right 6vw
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
          font-size 0.85rem
          font-weight normal
          color #333333
          padding 0 6vw 1.5vh
        }
        .input {

        }
      }
      .chat {
        overflow-y scroll
      }
    }
    .footer {
      position fixed
      bottom 0
      width 100vw
      height $chatFooterHeight
      background #fafafa
      display flex
      align-items center
      justify-content center
      border-top 1px solid #EEEEEE
      .footerInput {
        border 1px solid #EEEEEE
        height $chatFooterHeight - 3
        width 88vw
        font-size 0.85rem
        font-weight normal
        color #999999
        text-indent 2vw
        &:active, &:focus, &:hover {
          outline none
        }
      }

      .footerInput::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #CCCCCC;
        opacity 0.7
        text-indent 2vw
      }

      .footerInput:-moz-placeholder {
        /* WebKit browsers */
        color: #CCCCCC;
        opacity 0.7
        text-indent 2vw
      }

      .footerInput::-moz-placeholder {
        /* WebKit browsers */
        color: #CCCCCC;
        opacity 0.7
        text-indent 2vw
      }

      .footerInput::-ms-input-placeholder {
        /* WebKit browsers */
        color: #CCCCCC;
        opacity 0.7
        text-indent 2vw
      }
    }
  }

  .orderSubmit {
    display flex
    align-items center
    justify-content space-around
    .radioDiv {
      display flex
      align-items center
      .radio {
        box-sizing: border-box;
        display: inline-block;
        background-color: #fff;
        border-radius: 100%;
        border: 1px solid #ccc;
        position: relative;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        &:after {
          content: " ";
          border-radius: 100%;
          top: 5px;
          left: 5px;
          position: absolute;
          width: 8px;
          height: 8px;
          -webkit-transition: -webkit-transform .2s;
          transition: -webkit-transform .2s;
          transition: transform .2s;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      .rightRadio {
        margin-left 6vw
      }
      .radioChecked {
        background-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
        border-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
        &:after {
          background-color: #fff;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
      .radioText {
        margin-left 1vw
        font-size 1rem
        font-weight normal
        color #333333
      }
    }
  }

  .showInfo
    animation top

  /deep/ .footerInput {
    width 88vw
  }

  /deep/ .tipTime {
    font-size 1rem
    font-weight normal
    color: #ED1C24;
    text-align center
  }

  /deep/ .orderSubmitBtn {
    width 36vw
    color #FFFFFF
    background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
    box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
    border-radius: 2px;
    .mint-button-text {
      font-size 1rem
    }
  }

  /deep/ .orderCancelBtn {
    width 36vw
    color #333333
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.10);
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
    border-radius: 2px;
    .mint-button-text {
      font-size 1rem
    }
  }

  /deep/ .mint-button.is-disabled {
    background: #C8D4E0;
  }

  /deep/ .currency {
    font-weight normal
    margin-left 1vw
  }

  /deep/ .mint-field-core {
    font-weight normal
  }
</style>

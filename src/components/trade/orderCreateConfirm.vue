<template lang="pug">
  .orderCreateConfirm(v-if="ad.id")
    mt-header(:title="$t('order.order_place_order_confirm')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .info
          .labelList
            .label {{ad.op_type === 'sell' ? $t('ad.ad_buy_price') : $t('ad.ad_sell_price')}}
            .label {{ad.op_type === 'sell' ? $t('ad.ad_buy_money_amount') : $t('ad.ad_sell_money_amount')}}
            .label {{ad.op_type === 'sell' ? $t('order.order_buy_number_title') : $t('order.order_sell_number_title')}}
          .textList
            .text {{ad.current_price | $fixDecimalAuto(ad.target_currency)}} {{ad.target_currency.toUpperCase() + '/' + ad.currency.toUpperCase()}}
            .text {{form.amount | $fixDecimalAuto(ad.target_currency)}} {{ad.target_currency.toUpperCase()}}
            .text {{form.number | $fixDecimalAuto(ad.currency)}} {{ad.currency.toUpperCase()}}
        .tip(v-if="isLegalTrade")
          .text(v-if="ad.op_type === 'sell'") {{$t("order.order_place_order_buy_warn", {'0': ad.currency.toUpperCase()})}}
          .text(v-else) {{$t("order.order_place_order_sell_warn", {'0': ad.currency.toUpperCase()})}}
        .tip(v-else)
          .text(v-if="ad.op_type === 'sell'") {{$t("order.order_confirm_complete_buy_warn", {'0': form.amount, '1': ad.target_currency.toUpperCase(), '2': form.number, '3': ad.currency.toUpperCase()})}}
          .text(v-else) {{$t("order.order_confirm_complete_sell_warn", {'0': form.number, '1': ad.currency.toUpperCase(), '2': form.amount, '3': ad.target_currency.toUpperCase()})}}
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success") {{$t('public.confirm')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Header, Button} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

export default {
  name: 'orderCreateConfirm',
  props: {
    ad: {},
    form: {
      amount: '',
      number: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isLegalTrade () {
      return this.$store.state.code.payable.indexOf(this.ad.target_currency) > -1
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    success () {
      this.$emit('close', 1)
      this.$emit('success', 1)
    },
    init () {
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .orderCreateConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      margin-top $mintHeaderHeight + 1
      background #FFFFFF
      display flex
      padding 5vh 6vw
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .info {
        display flex
        .labelList {
          .label {
            font-size 0.85rem
            font-weight normal
            color #333333
            margin 0 5vw 2.5vh 0
          }
        }
        .textList {
          flex 1
          .text {
            font-size 0.85rem
            font-weight normal
            color #333333
            margin-bottom 2.5vh
          }
        }
      }
      .tip {
        margin-top 2.5vh
        .text {
          font-weight normal
          font-size 0.85rem
          color #ED1C24
        }
      }
    }
    .submit {
      display flex
      flex-direction column
      align-items center
      justify-content center
      height buttonHeight
      margin-top 5vh
      .submitBtn {
        margin-bottom 2.5vh
      }
    }
  }
</style>

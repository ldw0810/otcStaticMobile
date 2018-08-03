<template lang="pug">
  .orderCompleteConfirm
    mt-header(:title="$t('order.order_complete')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .info
          .text(v-html="$t('order.order_complete_info', {'0': $fixDecimalAuto(order.price_sum, order.target_currency), '1': order.target_currency.toUpperCase()})")
        .tip
          .text(@click="$router.push('/orderList')") {{$t("order.order_show_order")}}
          .text(@click="goAsset") {{$t("order.order_show_asset")}}
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Header, Button, Field} from 'mint-ui'
import Vue from 'vue'
import {$fixDecimalAuto} from '../../utils'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'orderCompleteConfirm',
  props: {
    order: {}
  },
  data () {
    return {
    }
  },
  methods: {
    $fixDecimalAuto (value, currency) {
      return $fixDecimalAuto(value, currency)
    },
    goBack () {
      this.$emit('close', 1)
    },
    goAsset () {
      this.$router.push({
        path: '/asset',
        query: {
          currency: this.order.op_type === 'sell' ? this.order.currency : this.order.traget_currency
        }
      })
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
  .orderCompleteConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      position absolute
      left 0
      top $mintHeaderHeight + 1
      width 100vw
      height 100 - @top
      overflow-y scroll
      -webkit-overflow-scrolling touch
      background #FFFFFF
      display flex
      padding 5vh 6vw
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .info {
        .text {
          font-size 1rem
          font-weight normal
          color #333333
          margin-bottom 2.5vh
          line-height 1.5
        }
      }
      .tip {
        display flex
        align-items center
        justify-content space-around
        margin-top 2.5vh
        .text {
          font-weight normal
          font-size 0.85rem
          color #2EA2F8
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

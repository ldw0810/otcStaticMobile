<template lang="pug">
  .adCompleteConfirm
    mt-header(:title="$t('order.order_complete')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .info
          .text(v-if="ad.op_type === 'sell'" v-html="$t('order.order_complete_info', {'0': form.number, '1': ad.currency.toUpperCase()})")
          .text(v-else v-html="$t('order.order_complete_info', {'0': form.amount, '1': ad.target_currency.toUpperCase()})")
        .tip
          .text(@click="$router.push('/orderList')") {{$t("order.order_show_order")}}
          .text(@click="goAsset") {{$t("order.order_show_asset")}}
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
  name: 'adCompleteConfirm',
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
    goAsset () {
      this.$router.push({
        path: '/asset',
        query: {
          currency: this.ad.op_type === 'sell' ? this.ad.currency : this.ad.traget_currency
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
  .adCompleteConfirm {
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

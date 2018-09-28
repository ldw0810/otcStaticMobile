<template lang="pug">
  .adCompleteConfirm
    mt-header(:title="$t('order.order_complete')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .img
          img(src="../../assets/images/trade/Icon-Ok.png")
        .info
          .text(v-if="ad.op_type === 'sell'" v-html="$t('order.order_complete_info', {'0': form.number, '1': ad.currency.toUpperCase()})")
          .text(v-else v-html="$t('order.order_complete_info', {'0': form.amount, '1': ad.target_currency.toUpperCase()})")
      .submit
        .mintCancel
          mt-button(class="cancelBtn" @click="goOrderList") {{$t('order.order_show_order')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goAsset") {{$t("order.order_show_asset")}}
        .mintSubmit
          mt-button(class="submitBtn" @click="success") {{$t('public.confirm')}}
</template>
<script type="es6">
import {Button, Header} from 'mint-ui'
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
    return {}
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
    goOrderList () {
      this.$router.push('/orderList')
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
      margin-top $mintHeaderHeight - 1
      overflow-y scroll
      -webkit-overflow-scrolling touch
      background #FFFFFF
      display flex
      padding 5vh 6vw
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      align-items center
      .img {
        width 12vh
        height 12vh
        img {
          width 100%
          height 100%
          object-position 0 0
          object-fit cover
        }
      }
      .info {
        margin-top 5vh
        .text {
          font-size 0.85rem
          font-weight normal
          color #333333
          margin-bottom 2.5vh
          line-height 1.5
        }
      }
    }
    .submit {
      display flex
      flex-direction column
      align-items center
      justify-content center
      margin-top 5vh
      .mintCancel {
        height 8.5vh
      }
      .mintSubmit {
        height 8.5vh
        .submitBtn {
          margin-bottom 0 !important
        }
      }
    }
  }
</style>

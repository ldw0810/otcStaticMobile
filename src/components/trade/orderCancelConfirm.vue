<template lang="pug">
  .orderCancelConfirm
    mt-header(:title="$t('order.order_cancel_order_title')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .tip {{$t("order.order_cancel_order_tip")}}
        .warn {{$t("order.order_cancel_order_warn")}}
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success") {{$t('order.order_pay_cancel')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Header, Button, Field} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'orderCancelConfirm',
  data () {
    return {
    }
  },
  computed: {
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
  .orderCancelConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      margin-top $mintHeaderHeight + 1
      overflow-y scroll
      -webkit-overflow-scrolling touch
      background #FFFFFF
      display flex
      padding 5vh 6vw
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .tip {
        font-weight normal
        font-size 0.85rem
        color #333333
      }
      .remark {
        margin 2.5vh 0
        border 1px solid #EEEEEE
      }
      .warn {
        margin-top 2.5vh
        font-weight normal
        font-size 0.85rem
        color #ED1C24
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

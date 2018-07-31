<template lang="pug">
  .agreement
    .content(v-html="$t('order.order_trade_notice_content')")
    .footer
      el-button(class="submitButton" type='primary' @click="submit") {{$t('public.confirm')}}
</template>
<script type="es6">
import {$getLanguage} from '../../utils'
import {Button} from 'element-ui'
import Vue from 'vue'

Vue.component(Button.name, Button)

export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    submit () {
      this.$emit('close', 1)
    }
  },
  created () {
    this.text = language[$getLanguage()]
  }
}
</script>

<style lang="stylus" scoped>
  .agreement {
    line-height 1.5
    .content {
      height 88vh
      width 100vw
      padding 5vh 8vw
      overflow: scroll;
      overflow-scrolling touch
      -webkit-overflow-scrolling : touch;
      /deep/ .underline{
        border-bottom 1px solid #000000
      }
      /deep/ .title {
        text-align center
        margin-bottom 2vh
      }
      /deep/ .sub-title {
        font-size: 1.2rem
        margin-bottom: 1.5vh;
        margin-top: 2vh
        font-weight: 600;
      }
      /deep/ p {
        margin-bottom 1vh
      }
    }
    .footer{
      height 12vh
      width 100vw
      display flex
      align-items center
      justify-content center
      background-image: linear-gradient(45deg, #0BBFD5 0%, #6DD788 100%);
      background-size: cover;
    }
  }
</style>

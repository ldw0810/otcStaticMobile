<template lang="pug">
  .rules
    mt-header(:title="$t('user.agreement')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="close")
    .content
      .text(v-html="$t('order.order_trade_notice_content')")
      .footer(class="mintCancel")
        mt-button(@click="goComplaint") {{$t('order.order_trade_complaint')}}
</template>
<script type="es6">
import {Button} from 'element-ui'
import Vue from 'vue'
import configure from '../../../configure'
import {$getAxiosLanguage} from '../../utils'

Vue.component(Button.name, Button)

export default {
  data () {
    return {
      text: '',
      domain: `${configure.ZENDESK_DOMAIN_URL}/hc/${$getAxiosLanguage().toLowerCase()}`
    }
  },
  computed: {
    appealUrl () {
      return this.domain + '/requests/new'
    }
  },
  methods: {
    close () {
      this.$emit('close', 1)
    },
    goComplaint () {
      if (this.$store.state.userToken) {
        this.$store.dispatch('axios_zendesk').then(res => {
          if (res.data && +res.data.error === 0) {
            const returnUrl = encodeURI(this.appealUrl)
            window.location.href = `${configure.ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${returnUrl}`
          } else {
            window.location.href = this.appealUrl
          }
        }).catch(() => {
          window.location.href = this.appealUrl
        })
      } else {
        window.location.href = this.appealUrl
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .rules {
    line-height 1.5
    .content {
      margin-top $mintHeaderHeight
      height 100 - $mintHeaderHeight
      width 100vw
      overflow-y: scroll;
      overflow-scrolling touch
      -webkit-overflow-scrolling : touch;
      .text {
        padding 5vh 6vw
      }
      .underline{
        border-bottom 1px solid #000000
      }
      .title {
        text-align center
        margin-bottom 2vh
      }
      .sub-title {
        font-size: 1.2rem
        margin-bottom: 1.5vh;
        margin-top: 2vh
        font-weight: 600;
      }
      p {
        margin-bottom 1vh
      }
    }
    .footer{
      height $footerHeight
      width 100vw
      display flex
      align-items center
      justify-content center
    }
  }
</style>

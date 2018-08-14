<template lang="pug">
  .adShare(v-if="id")
    mt-header(:title="$t('ad.ad_share')" fixed)
      router-link(to="/myAd" slot="left")
        mt-button(icon="back")
    .wrapper
      .content
        qrcode-vue(v-if="qrCodeFlag" ref="qrCode" class="pop-qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
        .image(ref="image")
        mt-button(@click="success") {{$t('public.invite_image_info_text')}}
</template>
<script type="es6">
import {Header, Button, Field} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'adShare',
  data () {
    return {
    }
  },
  computed: {
    id () {
      return this.$route.query.id || ''
    },
    link () {
      return this.$t('public.invite_content') + '\n' + this.linkUrl
    },
    linkUrl () {
      return window.location.href.replace('adShare', 'ad')
    },
    qrCodeConfig () {
      return {
        value: location.protocol + '//' + location.host + '/ad?id=' + this.id + 'shareId=' + this.id,
        imagePath: require('../../assets/images/trade/QC-Code-BG.png'),
        filter: 'canvas',
        size: 245
      }
    }
  },
  methods: {
    success () {
      this.$emit('close', 1)
      this.$emit('success', 1)
    },
    init () {
      this.$loading.close()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .adShare {
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

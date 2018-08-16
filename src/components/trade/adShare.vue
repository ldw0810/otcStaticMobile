<template lang="pug">
  .adShare(v-if="id")
    mt-header(:title="$t('ad.ad_share')" fixed class="headerDiv" :class="{'showHeader': headerFlag}")
      router-link(to="/myAd" slot="left")
        mt-button(icon="back")
    .wrapper(@click="headerFlag = !headerFlag")
      .content(:class="{'contentCn': language === 'cn', 'contentEn': language === 'en'}")
        qrcode-vue(ref="qrCode" class="qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
</template>
<script type="es6">
import {Header, Button, Field} from 'mint-ui'
import Vue from 'vue'
import QrcodeVue from 'qrcode.vue'
import {$getAxiosLanguage} from '../../utils'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

const configure = require('../../../configure')

export default {
  name: 'adShare',
  components: {
    QrcodeVue
  },
  data () {
    return {
      headerFlag: true
    }
  },
  computed: {
    language () {
      return $getAxiosLanguage().toLowerCase().indexOf('cn') > -1 ? 'cn' : 'en'
    },
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
        value: location.protocol + '//' + location.host + '/ad?id=' + this.id + '&shareId=' + this.id,
        imagePath: require('../../assets/images/trade/QC-Code-BG.png'),
        filter: 'canvas',
        size: configure.qrCode_adShare.size * document.body.clientHeight / 667
      }
    }
  },
  methods: {
    init () {
      this.$loading.close()
      this.headerFlag = false
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
    .headerDiv {
      position fixed
      top 0 - $headerHeight
      transition: 0.5s;
    }
    .showHeader {
      top 0
    }
    .content {
      position absolute
      left 0
      top 0
      width 100vw
      height 100vh
      overflow-y scroll
      background #FFFFFF
      display flex
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .qrCode {
        margin-top 59.5vh
        display flex
        align-items center
        justify-content center
      }
    }
    .contentCn {
      background url('../../assets/images/trade/adShare_cn.png')
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
    .contentEn {
      background url('../../assets/images/trade/adShare_en.png')
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
</style>

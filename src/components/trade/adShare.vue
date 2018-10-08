<template lang="pug">
  .adShare(v-if="id")
    mt-header(:title="$t('ad.ad_share')" fixed class="headerDiv" :class="{'showHeader': headerFlag}")
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper(@click="headerFlag = !headerFlag")
      .content(id="adShareContent")
        qrcode-vue(ref="qrCode" class="qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
        .image(ref="image")
        <!--mt-button(class="popDownload" @click="success") {{$t('public.invite_image_info_text')}}-->
</template>
<script type="es6">
import {Button, Field, Header} from 'mint-ui'
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
  props: {
    id: ''
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
    shareImg () {
      return require(`../../assets/images/trade/adShare_${this.language}.png`)
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
    goBack () {
      this.$emit('close', 1)
    },
    success () {
      this.$emit('close', 1)
      this.$emit('success', 1)
    },
    getClientSize (num) {
      return +num * configure.qrCode_adShare.multiple * document.body.clientWidth / 375
    },
    convertCanvasToImage (canvas) {
      let image = new Image()
      image.src = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      return image.src
    },
    createImage () {
      let qrCodeImg = this.convertCanvasToImage(this.$refs.qrCode.$el.children[0])
      let imgArr = [this.shareImg, qrCodeImg]
      let c = document.createElement('canvas')
      let ctx = c.getContext('2d')
      c.width = document.body.clientWidth * configure.qrCode_adShare.multiple
      c.height = document.body.clientWidth * configure.qrCode_adShare.multiple * 16 / 9
      ctx.rect(0, 0, c.width, c.height)
      ctx.fillStyle = '#ccc'
      ctx.fill()
      const drawing = (number) => {
        let index = +number || 0
        if (index < imgArr.length) {
          let img = new Image()
          img.src = imgArr[index]
          img.onload = () => {
            if (index === 1) {
              ctx.drawImage(img, this.getClientSize(configure.qrCode_adShare.left), this.getClientSize(configure.qrCode_adShare.top), this.getClientSize(configure.qrCode_adShare.size), this.getClientSize(configure.qrCode_adShare.size))
              drawing(++index)
            } else {
              ctx.drawImage(img, 0, 0, c.width, c.height)
              drawing(++index)
            }
          }
        } else {
          this.imageData = c.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          this.$refs.image.innerHTML = '<img width=\'' + this.clientHeight * 0.45 +
              '\' height=\'' + this.clientHeight * 0.8 + '\' src=\'' + this.imageData + '\'>'
          document.getElementById('adShareContent').style.alignItems = 'center'
          document.getElementById('adShareContent').style.justifyContent = 'center'
        }
      }
      drawing()
    },
    init () {
      this.$loading.close()
      this.createImage()
      setTimeout(() => {
        this.headerFlag = false
      }, 1000)
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
        position: absolute;
        top: -100vh;
        left: -100vw;
        visibility: hidden;
      }
      .image {
        width 100vw
        height 100vw * 1334 / 750
        /deep/ img {
          object-fit: cover;
          object-position: 0 0;
          width: 100%;
          height: 100%;
        }
      }
    }
    .center {
      align-items center
      justify-content center
    }
  }
</style>

<template lang="pug">
  .adShare(v-if="id")
    mt-header(:title="$t('ad.ad_share')" fixed)
      router-link(to="/myAd" slot="left")
        mt-button(icon="back")
    .wrapper
      .content
        qrcode-vue(ref="qrCode" class="qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
        .image(ref="image")
        <!--mt-button(class="popDownload" @click="success") {{$t('public.invite_image_info_text')}}-->
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
    }
  },
  computed: {
    language () {
      return $getAxiosLanguage()
    },
    shareImg () {
      return require(`../../assets/images/me/invite-${this.language}.jpg`)
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
        size: 90
      }
    }
  },
  methods: {
    success () {
      this.$emit('close', 1)
      this.$emit('success', 1)
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
      c.width = 750
      c.height = 1334
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
              ctx.drawImage(img, configure.qrCode_adShare.left, configure.qrCode_adShare.top, configure.qrCode_adShare.size, configure.qrCode_adShare.size)
              drawing(++index)
            } else {
              ctx.drawImage(img, 0, 0, c.width, c.height)
              drawing(++index)
            }
          }
        } else {
          this.imageData = c.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          this.$refs.image.innerHTML = "<img width='" + this.clientHeight * 0.45 +
            "' height='" + this.clientHeight * 0.8 + "' src='" + this.imageData + "'>"
        }
      }
      drawing()
    },
    downloadImage () {
      if (this.imageData) {
        let a = document.createElement('a')
        a.href = this.imageData
        a.download = 'img.png'
        this.$refs.popImage.appendChild(a)
        a.click()
        a.remove()
      }
    },
    init () {
      this.$loading.close()
      this.createImage()
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
      background #FFFFFF
      display flex
      padding 0 6vw 5vh
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
        display: flex;
        align-items: center;
        width 88vw
        height 156.6vw
        /deep/ img {
          object-fit: cover;
          object-position: 0 0;
          width: 100%;
          height: 100%;
        }
      }
      .popDownload {
        margin-top 2.5vh
        min-width: 36vw;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.10);
        box-shadow: 0 1vw 1vw 0 rgba(0, 0, 0, 0.03);
        border-radius: 2px;
        font-family: SFUIDisplay-Light, sans-serif;
        font-size: 0.85rem;
        color: #333333;
        text-align: center;
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

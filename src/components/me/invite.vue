<template lang="pug">
  .invite
    mt-header(:title="$t('user.user_invite_friends')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .content
      .banner(:class="{'link': bannerLink}" :style="{backgroundImage: 'url('+ bannerImg +')'}" @click="goBanner(bannerLink)")
      .wrapper
        .target
          .desc {{$t('public.invite_title')}}
          .copy
            .area
              .input(v-html="link")
              .wrapper
                mt-button(type="primary" class="copyBtn" v-clipboard:copy="link" v-clipboard:success="copySuccess") {{$t('public.invite_copy')}}
            .image
              .input(@click="showPopImage" v-html="$t('public.invite_image_content')")
              .wrapper
                mt-button(type="primary" class="copyBtn" @click="showPopImage") {{$t("public.invite_image_show_text")}}
          .question(@click="goArticle") {{$t('public.invite_question')}}
          .scoreCards
            .item {{$t('public.invite_invited')}}: {{inviteCount}}
            .item {{$t('public.invite_omt')}}: {{inviteAmount}}
        .rules
          .rulesTitle {{$t("public.invite_rules")}}
          .rulesContent(v-html='$t("public.invite_rules_content")')
      transition(name="fade" mode="out-in")
        .popupImage(v-show="popImageFlag" id="popupImage" @click="closePopImage")
          QrCode(v-if="qrCodeFlag" ref="qrCode" class="qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
          .image(ref="popImage")
          .footer
            mt-button(class="popDownload") {{$t('public.invite_image_info_text')}}
</template>
<script type="es6">
import {$getAxiosLanguage, $getLanguage} from '../../utils'
import QrCode from 'qrcode.vue'
import {Button, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

const configure = require('../../../configure')
const language = $getLanguage()
const axiosLanguage = $getAxiosLanguage()
const domain = `${configure.ZENDESK_DOMAIN_URL}/hc/${(language.replace('HK', 'TW').toLowerCase())}`
const CONF_INVITE_IMAGE = require(`../../assets/images/me/invite-${axiosLanguage}.jpg`)
export default {
  name: 'invite',
  components: {
    QrCode
  },
  data () {
    return {
      articlesLink: `${domain}/articles/360001929553`,
      inviteAmount: 0,
      inviteCount: 0,
      qrCodeFlag: true,
      popImageFlag: false,
      imageData: '',
      clientHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
  },
  computed: {
    bannerLink () {
      if (this.$store.state.inviteBannerList.length) {
        return this.$store.state.inviteBannerList[0].jump_to
      } else {
        return ''
      }
    },
    bannerImg () {
      const language = $getLanguage()
      if (this.$store.state.inviteBannerList.length) {
        if (language === 'zh-CN') {
          return this.$store.state.inviteBannerList[0].zh_img_src || ''
        } else if (['zh-HK', 'zh-TW'].indexOf(language) > -1) {
          return this.$store.state.inviteBannerList[0].tw_img_src || ''
        } else {
          return this.$store.state.inviteBannerList[0].en_img_src || ''
        }
      } else {
        if (['zh-CN', 'zh-HK', 'zh-TW'].indexOf(language) > -1) {
          return require('../../assets/images/me/Invite-Banner-Cn.jpg')
        } else {
          return require('../../assets/images/me/Invite-Banner-En.jpg')
        }
      }
    },
    link () {
      return this.$t('public.invite_content') + '\n' + this.linkUrl
    },
    linkUrl () {
      if (location.href.indexOf('/me/invite') > -1) {
        return location.href.split('/me/invite')[0] + '/register?inviteCode=' + this.$store.state.userInfo.invite
      } else {
        return location.href.split('/invite')[0] + '/register?inviteCode=' + this.$store.state.userInfo.invite
      }
    },
    qrCodeConfig () {
      return {
        value: this.linkUrl,
        imagePath: require('../../assets/images/me/QC-Code-BG.png'),
        filter: 'canvas',
        size: configure.QRCODE_SIZE
      }
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('public.invite_copy_success'))
    },
    getInviteDetail () {
      this.$store.dispatch('axios_invited_detail').then(res => {
        if (res.data && +res.data.error === 0) {
          this.inviteAmount = +res.data.amount || 0
          this.inviteCount = +res.data.count || 0
        }
      }).catch(() => {
      })
    },
    goArticle () {
      if (this.$store.state.userToken) {
        this.$store.dispatch('axios_zendesk').then(res => {
          if (res.data && +res.data.error === 0) {
            location.href = `${configure.ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${encodeURI(this.articlesLink)}`
          } else {
            location.href = `${domain}/categories/360001929553`
          }
        }).catch(() => {
          location.href = `${domain}/categories/360001929553`
        })
      } else {
        location.href = this.articlesLink
      }
    },
    goBanner (url) {
      if (url && url.length) {
        location.href = url
      }
    },
    convertCanvasToImage (canvas) {
      let image = new Image()
      image.src = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      return image.src
    },
    createImage () {
      let qrCodeImg = this.convertCanvasToImage(this.$refs.qrCode.$el.children[0])
      let imgArr = [CONF_INVITE_IMAGE, qrCodeImg]
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
              ctx.drawImage(img, configure.QRCODE_POSITION_LEFT, configure.QRCODE_POSITION_TOP, configure.QRCODE_SIZE, configure.QRCODE_SIZE)
              drawing(++index)
            } else {
              ctx.drawImage(img, 0, 0, c.width, c.height)
              drawing(++index)
            }
          }
        } else {
          this.qrCodeFlag = false
          this.imageData = c.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          this.$refs.popImage.innerHTML = "<img width='" + this.clientHeight * 0.45 + "' height='" + this.clientHeight * 0.8 + "' src='" + this.imageData + "'>"
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
    showPopImage (val) {
      this.popImageFlag = true
      if (this.qrCodeFlag) {
        this.createImage()
      }
    },
    closePopImage (event) {
      if (event.target.id === 'popupImage') {
        this.popImageFlag = false
      }
    },
    getBanner () {
      this.$store.dispatch('axios_banner', {
        activity_type: 1,
        device_type: 'mobile'
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('inviteBannerList_setter', res.data.list)
        }
      }).catch(() => {
      })
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    init () {
      this.getInviteDetail()
      this.getBanner()
      this.getMe()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .invite {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
  }

  .content {
    flex 1
    margin-top $mintHeaderHeight
    overflow-y scroll
  }

  img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
  }

  .banner {
    height 48.8vw
    width: 100vw;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .banner.link {
    cursor: pointer;
  }

  .invite {
    .wrapper {
      width: 100vw;
    }
    .target {
      background-color: #fff;
      border-radius: 0.2vw;
      padding: 2vh 5vw 2vh 5vw;
      .desc {
        font-size: 0.8rem;
        color: #ED1C24;
        margin: 2vh 0 2vh 0;
        .sub {
          color: #2EA2F8;
        }
      }
      .area {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 2vh 0 0 0;
        .input {
          font-family: SFUIDisplay-Light sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 20vw;
          width: 100%;
          border: 1px solid #CCCCCC;
          border-radius: 2px;
          font-size: 0.8rem;
          word-break: break-all;
          cursor: text;
          padding: 0 2vw 0 2vw;
        }
      }
      .wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 10vh;
        background: #FFFFFF;
      }
      .copyBtn {
        width: 36vw;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.10);
        box-shadow: 0 1vw 1vw 0 rgba(0, 0, 0, 0.03);
        border-radius: 2px;
        font-family: SFUIDisplay-Light sans-serif;
        font-size: 0.85rem;
        color: #333333;
        text-align: center;
      }
      .image {
        padding: 2vh 0 2vh 0;
        margin-left -1vw
        .input {
          font-family: SFUIDisplay-Light sans-serif;
          width: 92vw;
          height: 20vw;
          background: #FFFFFF url(../../assets/images/me/Invite-pic-bg.png) no-repeat center;
          background-size: 100%;
          color: #ffffff;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          padding: 0 2vw 0 2vw;
        }
      }
    }
    .question {
      display flex
      align-items center
      justify-content center
      color: #2EA2F8;
      margin 2.5vh 0
    }
    .scoreCards {
      width: 90vw;
      display: flex;
      justify-content: space-around;
      background-image: linear-gradient(-180deg, #E43636 0%, #E83E3E 70%);
      padding: 0;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: normal;
        flex: 1;
        height: 10vh;
        font-size: 1rem;
        color: #FFFFFF;
      }
    }
    .rules {
      width: 100vw;
      background: #FFFFFF;
      border-radius: 2px;
      padding: 5vh 10vw 5vh 10vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFangSC-Light sans-serif;
      .rulesTitle {
        color #333333
        font-weight: normal;
        font-size: 1.25rem;
        margin-bottom: 2.5vh;
      }
      .rulesContent {
        border-top: 1px solid #eee;
        padding-top: 4vh;
        font-size: 0.85rem;
        letter-spacing: 0;
        line-height: 2rem;
      }
    }
  }
  .popupImage {
    position: fixed;
    z-index $zIndexPopup + 1
    left 0
    top 0
    width 100%
    height 100%
    overflow hidden
    background-color rgba(55, 55, 55, 0.6)
    display: flex;
    justify-content: center;
    flex-direction column
    align-items: center;
    .qrCode {
      position: absolute;
      top: -100vh;
      left: -100vw;
      visibility: hidden;
    }
    .image {
      margin-bottom 2.5vh;
    }
    .popDownload {
      min-width: 36vw;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.10);
      box-shadow: 0 1vw 1vw 0 rgba(0, 0, 0, 0.03);
      border-radius: 2px;
      font-family: SFUIDisplay-Light sans-serif;
      font-size: 0.85rem;
      color: #333333;
      text-align: center;
    }
  }

  .imgCursor {
    cursor: pointer;
  }
</style>

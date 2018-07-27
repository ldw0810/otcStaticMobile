<template lang="pug">
  .invite
    .banner(:class="{'.link': bannerList[0] && bannerList[0].jump_to}" :style="{backgroundImage: 'url('+getImg(bannerList[0])+')'}" @click.stop="goBanner(bannerList[0] && bannerList[0].jump_to)")
    .container
      .target
        .scoreCards
          .item {{$t('public.invite_invited')}}: {{inviteCount}}
          .item {{$t("public.invite_omt")}}: {{inviteAmount}}
        .desc {{$t('public.invite_title')}}
          a(class='invite-target-desc-sub' @click="goArticle") {{$t('public.invite_question')}}
        .copy
          .area
            .input(v-html="link")
            .wrapper
              mt-button(type="primary" class="copyBtn" v-clipboard:copy="link" v-clipboard:success="copySuccess") {{$t("public.invite_copy")}}
          .image
            .input(@click="showImage" v-html="$t('public.invite_image_content')")
            .wrapper
              mt-button(type="primary" class="copyBtn" @click="showImage" v-clipboard:copy="link" v-clipboard:success="copySuccess") {{$t("public.invite_image_show_text")}}
      .rules
        .title {{$t("public.invite_rules")}}
        .content(v-html='$t("public.invite_rules_content")')
    .popupBg(v-if="popImageFlag" @click="popImageFlag = false")
    transition(name="fade" mode="out-in")
      .popup
        QrCode(v-if="qrCodeFlag" ref="qrCode" class="pop-qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
        .img(ref="popImage")
        .footer
          mt-button(class="popDownload") {{$t('public.invite_image_info_text')}}
</template>
<script type="es6">
import {$getLanguage} from '../../utils'
import QrCode from 'qrcode.vue'

const configure = require('../../../configure')

const domain = `${configure.ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem('language') || 'zh-TW').replace('HK', 'TW').toLowerCase()}`

export default {
  name: '',
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
    bannerList () {
      return this.$store.state.inviteBannerList
    },
    link () {
      return this.$t('public.invite_content') + '\n' + this.linkUrl
    },
    linkUrl () {
      return window.location.href.replace('invite', 'user/register?invitationCode=' + this.$store.state.userInfo.invite)
    },
    qrCodeConfig () {
      return {
        value: window.location.href.replace('invite', 'user/register?invitationCode=' + this.$store.state.userInfo.invite),
        imagePath: require('../../assets/images/me/QC-Code-BG.png'),
        filter: 'canvas',
        size: 245
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
      this.$store.dispatch('ajax_invited_detail').then(res => {
        if (res.data && +res.data.error === 0) {
          this.inviteAmount = +res.data.amount || 0
          this.inviteCount = +res.data.count || 0
        } else {
        }
      }).catch(() => {
      })
    },
    getInvitedActivity () {
      this.$store.dispatch('ajax_invited_activity').then(res => {
        if (res.data && +res.data.error === 0) {
          for (let i = 0; i < this.inviteTopArray.length; i++) {
            this.$set(this.inviteTopArray, i, Object.assign(this.inviteTopArray[i], res.data.list[i]))
          }
        } else {
        }
      }).catch(() => {
      })
    },
    getImg (item) {
      const language = $getLanguage()
      if (!item) {
        return ''
      } else if (language === 'zh-CN') {
        return item.zh_img_src || ''
      } else if (language === 'zh-HK' || language === 'zh-TW') {
        return item.tw_img_src || ''
      } else {
        return item.en_img_src || ''
      }
    },
    goArticle () {
      if (this.$store.state.userToken) {
        this.$store.dispatch('ajax_zendesk').then(res => {
          if (res.data && +res.data.error === 0) {
            window.location.href = `${configure.ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${encodeURI(this.articlesLink)}`
          } else {
            window.location.href = `${domain}/categories/360001929553`
          }
        }).catch(() => {
          window.location.href = `${domain}/categories/360001929553`
        })
      } else {
        window.location.href = this.articlesLink
      }
    },
    showImage () {
      this.popImageFlag = true
    },
    goBanner (url) {
      if (url && url.length) {
        window.location.href = url
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
              ctx.drawImage(img, 246, 955, 245, 245)
              drawing(++index)
            } else {
              ctx.drawImage(img, 0, 0, c.width, c.height)
              drawing(++index)
            }
          }
        } else {
          this.qrCodeFlag = false
          this.imageData = c.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          this.$refs.popImage.innerHTML = "<img width='" + this.clientHeight * 0.45 +
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
    popImageTrigger (val) {
      if (!val) {
        this.popImageFlag = false
      } else {
        if (this.qrCodeFlag) {
          this.createImage()
        }
      }
    },
    getBanner () {
      this.$store.dispatch('axios_banner', {
        activity_type: 1,
        device_type: 'mobile'
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('inviteBannerList_setter', res.data.list)
        } else {
        }
      }).catch(() => {
      })
    },
    init () {
      this.getInviteDetail()
      this.getBanner()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
  }

  .banner {
    height: 20vh;
    width: 100vw;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .banner.link {
    cursor: pointer;
  }

  .invite {
    .container {
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
      }
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
        .input {
          font-family: SFUIDisplay-Light sans-serif;
          width: 90vw;
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
      .title {
        font-weight: normal;
        font-size: 1.25rem;
        margin-bottom: 2.5vh;
      }
      .content {
        border-top: 1px solid #eee;
        padding-top: 4vh;
        font-size: 0.85rem;
        letter-spacing: 0;
        line-height: 2rem;
      }
    }
    .top {
      width: 90vw;
      min-height: 40vh;
      margin-top: 2vh;
      background: #FFFFFF;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        width: 90vw;
        height: 25.5vw;
        background-image: url("../../assets/images/me/toptittle-phone.svg");
        background-size: cover;
        color: white;
        font-family: PingFangSC-Regular sans-serif;
        font-size: 1.5rem;
        text-align: center;
        line-height: 25.5vw;
      }
      .content {
        width: 90vw;
        display: flex;
        justify-content: space-around;
        .item {
          margin-top: 2.5vh;
          padding-bottom: 2.5vh;
          width: 25vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          .icon {
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          .name {
            margin-top: 1.5vh;
            word-break: break-all;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 0.8rem;
            color: #000000;
            .second {
              margin-top: 2.45vh;
            }
          }
          .number {
            margin-top: 0.5vh;
            font-family: PingFangSC-Regular sans-serif;
            font-size: 0.85rem;
            color: #999999;
          }
        }
      }
    }
  }

  .pop {
    .qrCode {
      position: absolute;
      top: -100vh;
      left: -100vw;
      visibility: hidden;
    }
    .image {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 2.5vh;
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

<template lang="pug">
  .myAd(:style="{'-webkit-overflow-scrolling': scrollMode}")
    mt-loadmore(:autoFill="false" :top-method="loadTop" :topPullText="$t('public.loadMore_topPullText')" :topDropText="$t('public.loadMore_dropText')" :topLoadingText="$t('public.loadMore_loadingText')" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText="$t('public.loadMore_bottomPullText')" :bottomDropText="$t('public.loadMore_dropText')" :bottomLoadingText="$t('public.loadMore_loadingText')" ref="loadmore")
      .itemList(v-if="myAds.list.length")
        .item(v-for="(ad, index) in myAds.list" :key="index")
          .wrapper(v-if="ad.id")
            .content
              .info
                .infoItem
                  .text(class="bolder") {{$t('ad.ad_type')}}:
                  .value(class="bolder") {{ad.op_type === 'buy' ? $t("public.buy") : $t("public.sell")}} {{ad.currency.toUpperCase()}}
                .infoItem
                  .text {{$t("ad.ad_time")}}:
                  .value {{+ad.created_at * 1000 | $getDateStr()}}
                .infoItem
                  .text {{$t("public.price")}}:
                  .value {{+ad.current_price | $fixDecimalAuto(ad.target_currency)}} {{ad.target_currency.toUpperCase()}}
                .infoItem
                  .text {{$t("order.order_limit")}}:
                  .value {{+ad.min_limit | $fixDecimalAuto(ad.target_currency)}}&nbsp;-&nbsp;{{+ad.order_limit | $fixDecimalAuto(ad.target_currency)}}&nbsp;{{ad.target_currency.toUpperCase()}}
                .infoItem
                  .text {{$t("ad.ad_premium")}}:
                  .value {{+ad.margin + '%'}}
                .infoItem
                  .text {{$t("ad.ad_payment")}}:
                  .value(v-if="!ad.pay_kind") {{$t("public.currencyExchange")}}
                  .value(v-else-if="ad.pay_kind === 'alipay'") {{$t("public.alipay")}}
                  .value(v-else-if="ad.pay_kind === 'bank'") {{$t("public.bank")}}
                  .value(v-else-if="ad.pay_kind === 'local'") {{$t("public.local")}}
              .button
                mt-button(v-if="ad.status === 'ongoing'" class="operation" type='primary' v-clipboard:copy="shareLink" v-clipboard:success="copySuccess" @click="doShare(ad)") {{$t('public.share')}}
                mt-button(v-if="ad.status === 'closed'" class="operation" type='primary' @click="openAd(ad)") {{$t('ad.ad_open')}}
                mt-button(v-else class="operation" type='primary' @click="closeAd(ad)") {{$t('ad.ad_close')}}
                mt-button(v-if="+ad.locked > 0" class="operation operationCancel" type='primary' disabled) {{$t('ad.ad_trading')}}
            .border
            .status(class="ongoing" v-if="ad.status === 'ongoing'") {{$t("ad.ad_ongoing")}}
            .status(class="closed" v-else) {{$t("ad.ad_closed")}}
      EmptyList(class="emptyDiv" :text="$t('public.no_ad')" :loading="myAdsLoading" v-else)
      transition-group(tag="div" name="fade")
        .popup(class="sharePop" v-if="shareFlag" :key="1" @click="shareFlag = false")
          .close(@click="shareFlag = false") +
          .content(@click.stop="shareFlag=true")
            a(class="link" v-clipboard:copy="shareLink" v-clipboard:success="copySuccess") {{shareLink}}
            qrcode-vue(ref="qrCode" class="qrCode" :value='qrCodeConfig.value' :size='qrCodeConfig.size')
            mt-button(class="operation download" type='primary' @click="shareImageFlag = true") {{$t('ad.ad_share_download')}}
        .popup(class="shareImagePop" v-if="shareImageFlag && shareAd.id" :key="2")
          slot
            adShareImage(id="shareAd.id" @close="closeShareImage" @success="closeShareImage")
</template>
<script type="es6">
import EmptyList from '../common/emptyList'
import {Button, Loadmore} from 'mint-ui'
import Vue from 'vue'
import unionBy from 'lodash/unionBy'
import mShare from '../../utils/mshare'
import adShareImage from './adShare'
import QrcodeVue from 'qrcode.vue'
import configure from '../../../configure'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)

export default {
  name: 'myAd',
  components: {
    EmptyList,
    adShareImage,
    QrcodeVue
  },
  data () {
    return {
      myAdsLoading: false,
      scrollMode: 'auto',
      allLoaded: false,
      bottomPageIndex: 1,
      shareAd: {},
      shareFlag: false,
      shareImageFlag: false
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    myAds () {
      return this.$store.state.myAds || {list: []}
    },
    shareLink () {
      return location.protocol + '//' + location.host + '/adDetail?id=' + this.shareAd.id + '&shareId=' + this.shareAd.id
    },
    qrCodeConfig () {
      return {
        value: this.shareLink,
        imagePath: require('../../assets/images/trade/QC-Code-BG.png'),
        filter: 'canvas',
        size: configure.qrCode_adShare.size * document.body.clientHeight / 667
      }
    }
  },
  methods: {
    loadTop () {
      this.getMyAds(1).then(() => {
        this.$refs.loadmore.onTopLoaded()
      })
    },
    loadBottom () {
      this.bottomPageIndex++
      this.getMyAds(2).then(() => {
        this.$refs.loadmore.onBottomLoaded()
      })
    },
    getMyAds (type) {
      return new Promise((resolve, reject) => {
        if (!type) {
          this.$loading.open()
        }
        this.myAdsLoading = true
        const requestData = {
          limit: configure.LIST_NUMBER_PER_PAGE,
          page: +type === 2 ? this.bottomPageIndex : 1
        }
        this.$store.dispatch('axios_ads_my', requestData).then(res => {
          this.myAdsLoading = false
          if (res.data && +res.data.error === 0) {
            let tempData = res.data
            if (type === 1) {
              tempData.list = unionBy(tempData.list, this.myAds.list, 'id')
            } else if (type === 2) {
              tempData.list = unionBy(this.myAds.list, tempData.list, 'id')
            }
            if (tempData.total_pages < this.bottomPageIndex + 1) {
              this.allLoaded = true
            }
            this.$store.commit('myAds_setter', tempData)
            this.$nextTick(() => {
              this.scrollMode = 'touch'
            })
          }
          resolve()
        }).catch(() => {
          this.myAdsLoading = false
          // this.$message.error(this.$t('ad.ad_data_request_fail'))
          resolve()
        })
      })
    },
    closeAd (ad) {
      if (ad && ad.id) {
        this.$loading.open()
        this.$store.dispatch('axios_update_ad_status', {
          id: ad.id,
          status: 'closed'
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('ad.ad_close_success'))
            this.$loading.open()
            this.init(1)
          }
        }).catch(() => {
          // this.$message.error(this.$t('ad.ad_close_fail'))
        })
      }
    },
    openAd (ad) {
      if (ad && ad.id) {
        this.$loading.open()
        this.$store.dispatch('axios_update_ad_status', {
          id: ad.id,
          status: 'ongoing'
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('ad.ad_open_success'))
            this.$loading.open()
            this.init(1)
          }
        }).catch(() => {
          // this.$message.error(this.$t('ad.ad_open_fail'))
        })
      }
    },
    doShare (ad) {
      if (ad && ad.id) {
        if (!this.doBrowserShare()) {
          this.shareAd = ad
          // this.shareFlag = true
        }
      }
    },
    doBrowserShare (type) {
      return mShare({
        type: type,
        url: this.shareLink,
        title: this.$t('ad.ad_share_title', {'0': this.shareAd.target_currency ? this.shareAd.target_currency.toUpperCase() : ''}),
        desc: this.$t('ad.ad_share_desc')
      })
    },
    closeShare (event) {
      if ([].indexOf(event.target.className) > -1) {
        this.shareFlag = false
      }
    },
    closeShareImage () {
      this.shareImageFlag = false
    },
    copySuccess () {
      this.$message.success(this.$t('public.invite_copy_success'))
    },
    init () {
      this.getMyAds()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  myAdItemHeight = 26vh
  myAdItemContentHeight = 21.5vh
  .myAd {
    @extend .scrollPage
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
    .itemList {
      margin-bottom 1vh
      .item {
        margin-top 1vh
        border-top: 1px solid #EEEEEE
        border-bottom: 1px solid #EEEEEE
        background #FFFFFF
        .wrapper {
          display flex
          flex-direction column
          align-items center
          height myAdItemHeight
          .content {
            flex 1
            display flex
            width 100vw
            height myAdItemContentHeight
            padding 0 6vw
            .info {
              flex 1
              display flex
              justify-content center
              flex-direction column
              height myAdItemContentHeight
              font-size 0.85rem
              .name {
                font-weight normal
                font-size 0.85rem
                color #333333
              }
              .infoItem {
                display flex
                .text {
                  min-width 18vw
                  font-size 0.85rem
                  color #2A2A2A
                }
                .value {
                  margin-left 2.5vw
                  font-size 0.85rem
                  color #2A2A2A
                }
              }
            }
            .button {
              position absolute
              right 6vw
            }
          }
          .border {
            height 1px
            display flex
            align-items center
            justify-content center
            width 88vw
            background #EEEEEE
          }
          .status {
            height myAdItemHeight - myAdItemContentHeight
            display flex
            align-items center
            justify-content center
            font-size 0.9rem
          }
          .ongoing {
            color #999999
          }
          .closed {
            color #1BB934
          }
        }
      }
    }
  }
  .bolder {
    font-weight bolder
  }
  .emptyDiv {
    width 100vw
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
  }
  .popup {
    .content {
      @extend .flex-vertical-center
      background #fff
    }
  }
  .sharePop {
    z-index 9
    background rgba(0, 0, 0 , 0.7)
    display flex
    flex-direction column
    justify-content center
  }
  .shareImagePop {
    z-index 10
    background rgba(0, 0, 0 , 0.7)
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    color: #fff;
    transform: rotate(45deg);
    font-size: 30px;
    cursor: pointer;
  }
  .link {
    margin 2.5vh 0
    text-align center
    color -webkit-link
    cursor pointer
  }
  .operation {
    display flex
    align-items center
    justify-content center
    min-width 18vw
    height 3.5vh
    color #FFFFFF
    font-size 0.85rem
    background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
    box-shadow: 0 0.5vh 0.5vh 0 rgba(102, 187, 191, 0.14);
    border-radius: 0.25vh;
    margin-top 2.5vh
    /deep/ span {
      margin-top -0.85vh
    }
  }
  .operationCancel {
    background: #C8D4E0;
  }
  .download {
    margin-bottom 2.5vh
  }
</style>

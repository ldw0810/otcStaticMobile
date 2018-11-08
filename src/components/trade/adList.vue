<template lang="pug">
  .adList(:style="{'-webkit-overflow-scrolling': scrollMode}")
    mt-loadmore(:autoFill="false" :top-method="loadTop" :topPullText="$t('public.loadMore_topPullText')" :topDropText="$t('public.loadMore_dropText')" :topLoadingText="$t('public.loadMore_loadingText')" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText="$t('public.loadMore_bottomPullText')" :bottomDropText="$t('public.loadMore_dropText')" :bottomLoadingText="$t('public.loadMore_loadingText')" ref="loadmore")
      .itemList(v-if="adsData.list.length")
        .item(v-for="(ad, index) in adsData.list" :key="index")
          .wrapper
            .content
              Avatar(class="avatar" :status='ad.member.online' :statusType="1")
              .info
                .name {{ad.member.nickname}}
                .pack
                  .tradeNumber {{$t("order.order_trade_count", {'0': ad.member.stat.trade_count})}}
                  .border |
                  .goodRate {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
                  .pay(v-if="ad.pay_kind === 'local'")
                    .border |
                    .text {{$t('public.local')}}
                  .icon(v-else)
                    img(src="../../assets/images/trade/C-Alipay.png" v-if="ad.pay_kind === 'alipay'")
                    img(src="../../assets/images/trade/C-Card.png" v-else-if="ad.pay_kind === 'bank'")
              el-button(class="operation" :class="{'sell': adType === 1}" type='primary' @click="submit(ad.id)") {{adType === 0 ? $t('public.buy') : $t('public.sell')}}
            .contentDown
              .price
                .number {{ad.current_price | $fixDecimalAuto(ad.target_currency)}}
                .text {{$t('order.order_unit_price', {'0': ad.target_currency.toUpperCase()})}}
              .border
              .limit
                .number {{ad.min_limit | $fixDecimalAuto(ad.target_currency)}}&nbsp;-&nbsp;{{ad.order_limit | $fixDecimalAuto(ad.target_currency)}}
                .text {{$t('order.order_limit') + '(' + ad.target_currency.toUpperCase() + ')'}}
      EmptyList(class="emptyDiv" :text='emptyMessage' :loading="adsLoading" v-else)
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Loadmore} from 'mint-ui'
import {Button} from 'element-ui'
import Vue from 'vue'
import unionBy from 'lodash/unionBy'
import configure from '../../../configure'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)

export default {
  name: 'adList',
  components: {
    Avatar,
    EmptyList
  },
  data () {
    return {
      adsLoading: false,
      scrollMode: 'auto',
      allLoaded: false,
      bottomPageIndex: 1,
      adsData: {list: []}
    }
  },
  watch: {
    $route: function () {
      this.doInit()
    },
    '$store.state.ads': {
      handle: () => {
        this.getAds()
      },
      deep: true
    }
  },
  computed: {
    adType () {
      return !this.$route.meta.navbarIndex ? 0 : 1
    },
    emptyMessage () {
      if (+this.adType === 0) {
        return this.$t('public.no_buy_ad', {
          '0': this.currency.toUpperCase()
        })
      } else if (+this.adType === 1) {
        return this.$t('public.no_sell_ad', {
          '0': this.currency.toUpperCase()
        })
      }
    },
    currencyList () {
      return this.$store.state.code.sellable
    },
    currency () {
      return this.$route.query.currency || this.currencyList[0] || configure.CONF_DIGITAL_CURRENCY_LIST[0].currency
    },
    targetCurrency () {
      for (let i = 0; i < configure.CONF_DIGITAL_CURRENCY_LIST.length; i++) {
        if (configure.CONF_DIGITAL_CURRENCY_LIST[i].currency === this.currency) {
          return configure.CONF_DIGITAL_CURRENCY_LIST[i].targetCurrency
        }
      }
    }
  },
  methods: {
    loadTop () {
      this.getAdsData(1).then(() => {
        this.$refs.loadmore.onTopLoaded()
      })
    },
    loadBottom () {
      this.bottomPageIndex++
      this.getAdsData(2).then(() => {
        this.$refs.loadmore.onBottomLoaded()
      })
    },
    getAds () {
      this.adsData = this.$store.state.ads[this.currency + '_' + this.targetCurrency + '_' + this.adType] || {list: []}
    },
    getAdsData (type) {
      return new Promise((resolve, reject) => {
        if (!type) {
          this.$loading.open()
        }
        this.adsLoading = true
        this.$store.dispatch('axios_ads', {
          limit: configure.LIST_NUMBER_PER_PAGE,
          page: +type === 2 ? this.bottomPageIndex : 1,
          op_type: +this.adType === 0 ? 'sell' : 'buy',
          currency: this.currency
        }).then(res => {
          this.adsLoading = false
          if (res.data && +res.data.error === 0) {
            let tempData = res.data
            if (type === 1) {
              tempData.list = unionBy(tempData.list, this.adsData.list, 'id')
            } else if (type === 2) {
              tempData.list = unionBy(this.adsData.list, tempData.list, 'id')
            }
            if (tempData.total_pages < this.bottomPageIndex + 1) {
              this.allLoaded = true
            }
            this.$store.commit('ads_setter', {
              key: this.currency + '_' + this.targetCurrency + '_' + this.adType,
              value: tempData
            })
            this.$nextTick(() => {
              this.scrollMode = 'touch'
            })
          }
          resolve()
        }).catch(() => {
          this.adsLoading = false
          // this.$message.error(this.$t('public.url_request_fail'))
          resolve()
        })
      })
    },
    submit (id) {
      if (!this.$store.state.userToken) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath
          }
        })
      } else if (!this.$store.state.userInfo.activated) {
        this.$message.error(this.$t('user.email_not_activated'))
      } else {
        this.$router.push({
          path: '/adDetail',
          query: {
            id: id
          }
        })
      }
    },
    doInit () {
      this.getAds()
      this.getAdsData().then(() => {
        this.getAds()
      })
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang='stylus' scoped>
  .adList {
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
          height 16.88vh
          .content {
            flex 1
            display flex
            align-items center
            width 100vw
            margin-left 2.5vw
            .avatar {
            }
            .info {
              flex 1
              margin-left 2.5vw
              .name {
                font-size 0.85rem
                font-weight normal
                color #333333
              }
              .pack {
                display flex
                align-items center
                font-size 0.85rem
                color #999999
                .tradeNumber {
                }
                .border {
                  margin 0 2vw
                }
                .goodRate {

                }
                .pay {
                  display flex
                  align-items center
                  .text {
                    font-size 0.85rem
                    color #CCC
                  }
                }
                .icon {
                  width 2.5vh
                  height 2.5vh
                  margin-left 2.5vw
                  img {
                    object-fit: cover;
                    object-position: 0 0;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .operation {
              position absolute
              right 6vw
              display flex
              align-items center
              justify-content center
              min-width 18vw
              height 2vh
              color #FFFFFF
              background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
              box-shadow: 0 0.5vh 0.5vh 0 rgba(102,187,191,0.14);
              border-radius: 0.25vh;
              /deep/ span {
                margin-top -0.85vh
              }
            }
          }
          .contentDown {
            flex 1
            display flex
            align-items center
            width 100vw
            font-weight normal
            .price {
              flex 2
              padding-left 5vw
              .number {
                font-weight normal
                font-size 1rem
              }
              .text {
                font-size 0.85rem
                color #CCCCCC
              }
            }
            .border {
              display flex
              align-items center
              width 1px
              height 4vh
              background #EEEEEE
            }
            .limit {
              flex 3
              padding-left 5vw
              font-weight normal
              .number {
                font-weight normal
                font-size 0.95rem
              }
              .text {
                font-size 0.85rem
                color #CCCCCC
              }
            }
          }
        }
      }
    }
  }
  .emptyDiv {
    width 100vw
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
  }
</style>

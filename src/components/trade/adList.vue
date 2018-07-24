<template lang="pug">
  .adList(:style="{'-webkit-overflow-scrolling': scrollMode}")
    mt-loadmore(:top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore")
    .itemList(v-if="ads.list.length")
      .item(v-for="(ad, index) in ads.list" :key="index")
        .wrapper
          .content
            Avatar(class="avatar" :status='ad.member.online')
            .info
              .name {{ad.member.nickname}}
              .pack
                .tradeNumber {{$t("order.order_trade_count", {'0': ad.member.stat.trade_count})}}
                .border |
                .goodRate {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
                .icon
                  img(src="../../assets/images/trade/C-Alipay.png" v-if="!ad.member.bank")
                  img(src="../../assets/images/trade/C-Card.png" v-else-if="ad.member.bank")
            el-button(class="operation" :class="{'sell': adType === 1}" type='primary' @click="submit(ad.id)") {{adType === 0 ? $t('public.buy') : $t('public.sell')}}
          .contentDown
            .price
              .number {{ad.current_price | fixDecimalAuto(ad.target_currency)}}
              .text {{$t('order.order_unit_price', {'0': currency.toUpperCase()})}}
            .border
            .limit
              .number {{ad.min_limit | fixDecimalAuto(ad.target_currency)}}&nbsp;-&nbsp;{{ad.order_limit | fixDecimalAuto( ad.target_currency)}}
              .text {{$t('order.order_limit')}}
        .wrapper
          .content
            Avatar(class="avatar" :status='ad.member.online')
            .info
              .name {{ad.member.nickname}}
              .pack
                .tradeNumber {{$t("order.order_trade_count", {'0': ad.member.stat.trade_count})}}
                .border |
                .goodRate {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
                .icon
                  img(src="../../assets/images/trade/C-Alipay.png" v-if="!ad.member.bank")
                  img(src="../../assets/images/trade/C-Card.png" v-else-if="ad.member.bank")
            el-button(class="operation" :class="{'sell': adType === 1}" type='primary' @click="submit(ad.id)") {{adType === 0 ? $t('public.buy') : $t('public.sell')}}
          .contentDown
            .price
              .number {{ad.current_price | fixDecimalAuto(ad.target_currency)}}
              .text {{$t('order.order_unit_price', {'0': currency.toUpperCase()})}}
            .border
            .limit
              .number {{ad.min_limit | fixDecimalAuto(ad.target_currency)}}&nbsp;-&nbsp;{{ad.order_limit | fixDecimalAuto( ad.target_currency)}}
              .text {{$t('order.order_limit')}}
    EmptyList(class="emptyDiv" :text='emptyMessage' :loading="adsLoading" v-else)
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Loadmore} from 'mint-ui'
import {Button} from 'element-ui'
import Vue from 'vue'

const configure = require('../../../configure')

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
      scrollMode: 'auto',
      allLoaded: false,
      ads: {
        list: [],
        page: 1,
        per_page: 10,
        total_count: 0,
        total_pages: 1
      },
      adsLoading: false,
      pageIndex: 1
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    adType () {
      return !this.$route.meta.navbarIndex ? 0 : 1
    },
    emptyMessage () {
      if (+this.adType === 0) {
        return this.$i18n.translate('public.no_buy_ad', {
          '0': this.currency.toUpperCase()
        })
      } else if (+this.adType === 1) {
        return this.$i18n.translate('public.no_sell_ad', {
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
      console.log('loadTop')
      this.getAdList()
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      console.log('loadBottom')
      this.getAdListMore()
      this.$refs.loadmore.onBottomLoaded()
    },
    getAdList () {
      this.$loading.open()
      this.adsLoading = true
      this.ads.list = []
      this.$store.dispatch('axios_ads', {
        limit: +this.ads.per_page,
        page: +this.pageIndex,
        op_type: +this.adType === 0 ? 'sell' : 'buy',
        currency: this.currency
      }).then(res => {
        this.adsLoading = false
        if (res.data && +res.data.error === 0) {
          this.ads = res.data
        }
      }).catch(() => {
        this.adsLoading = false
      })
    },
    getAdListMore () {
      this.pageIndex = this.ads.page + 1
      if (this.pageIndex > this.ads.total_pages) {
        this.allLoaded = true
        this.pageIndex = this.ads.page
      } else {
        const currentAdsList = this.ads.list
        this.adsLoading = true
        this.$store.dispatch('axios_ads', {
          limit: +this.ads.per_page,
          page: +this.pageIndex,
          op_type: +this.adType === 0 ? 'sell' : 'buy',
          currency: this.currency
        }).then(res => {
          this.adsLoading = false
          if (res.data && +res.data.error === 0) {
            this.ads = {
              list: currentAdsList.concat(res.data.list),
              page: res.data.page,
              per_page: res.data.per_page,
              total_count: res.data.total_count,
              total_pages: res.data.total_pages
            }
            this.$nextTick(() => {
              this.scrollMode = 'touch'
            })
          }
        }).catch(() => {
          this.adsLoading = false
        })
      }
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
        this.$store.commit('showAuthEmail_setter', 1)
      } else {
        this.$router.push({
          path: '/detail',
          query: {
            id: id
          }
        })
      }
    },
    init () {
      this.getAdList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .adList {
    background-color: #fafafa;
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
                font-size 0.8rem
                font-weight normal
                color #333333
              }
              .pack {
                display flex
                align-items center
                font-size 0.8rem
                color #999999
                .tradeNumber {

                }
                .border {
                  margin 0 2vw
                }
                .goodRate {

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
              display flex
              align-items center
              justify-content center
              min-width 18vw
              height 2vh
              margin-right 5vw
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
                font-size 0.9rem
              }
              .text {
                font-size 0.8rem
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
                font-size 0.9rem
              }
              .text {
                font-size 0.8rem
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

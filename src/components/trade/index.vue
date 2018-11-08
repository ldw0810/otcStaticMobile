<template lang="pug">
  .trade
    .header
      .currency(@click="currencyListFlag = !currencyListFlag")
        .logo(v-if="currencyImageList[currency]")
          img(v-lazy="currencyImageList[currency]" :key="currencyImageList[currency]")
        .text {{currency.toUpperCase()}}
        .icon(:class="{'show': currencyListFlag}")
          img(src="../../assets/images/icon/PullDown-999999.svg")
      .balance
        .number {{+tradePrice | $fixDecimalAuto(targetCurrency)}}
        .targetCurrency {{targetCurrency.toUpperCase()}}
    mt-navbar(v-model="navbarIndex" class="navbar" fixed)
      LinkBarItem(:class="'navbarItem_' + index" v-for="(item, index) in navList" :id="index" :route="getNavbarRoute(index)" :key="index")
        i(class="text" :class="{'focus': +navbarIndex === index}") {{item.name}}
        mt-badge(type="error" size="small" v-if="index === navList.length - 1 && notice > 0") {{notice}}
    .page
      transition(name="fade" mode="out-in")
        router-view
    .popupBg(v-if="currencyListFlag" @click="currencyListFlag = false")
    transition(name="top" mode="out-in")
      .popupDiv(v-if="currencyListFlag")
        .content
          .item(v-for="(item, index) in currencyList" :value="item" :key="index" @click="changeCurrency(item)")
            .logo(v-if="currencyImageList[item]")
              img(v-lazy="currencyImageList[item]")
            .text(@click="currencyListFlag = true") {{item.toUpperCase()}}
</template>
<script type="es6">
import Vue from 'vue'
import {Navbar, Badge} from 'mint-ui'
import LinkBarItem from '../common/linkBarItem'
import configure from '../../../configure'

Vue.component(Navbar.name, Navbar)
Vue.component(Badge.name, Badge)

export default {
  name: 'trade',
  components: {
    LinkBarItem
  },
  data () {
    return {
      navList: [
        {
          name: this.$t('public.buy'),
          path: '/buy'
        },
        {
          name: this.$t('public.sell'),
          path: '/sell'
        },
        {
          name: this.$t('public.myAd'),
          path: '/myAd'
        },
        {
          name: this.$t('public.order'),
          path: '/orderList'
        }
      ],
      currencyImageList: configure.CONF_CURRENCY_IMAGE_LIST,
      navbarIndex: this.$route.meta.navbarIndex || 0,
      tradePrice: 0,
      tradePriceTimer: 0,
      tradeFee: 0,
      currencyListFlag: false
    }
  },
  computed: {
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
    },
    notice () {
      return +this.$store.state.userInfo.notice
    }
  },
  watch: {
    $route: function () {
      this.doInit()
    },
    '$store.state.tradePriceData': {
      handle: () => {
        this.getTradePrice()
      },
      deep: true
    }
  },
  methods: {
    getNavbarRoute (index) {
      return {
        path: this.navList[index].path,
        query: this.$route.query
      }
    },
    getTradePrice () {
      this.tradePrice = this.$store.state.tradePriceData[this.currency + '_' + this.targetCurrency] || 0
    },
    changeCurrency (tempCurrency) {
      if (tempCurrency && tempCurrency !== this.currency) {
        this.$router.push({
          path: this.$route.path,
          query: {
            currency: tempCurrency
          }
        })
      }
      this.currencyListFlag = false
    },
    getCurrencyCode () {
      this.$store.dispatch('axios_currency_code')
    },
    getTradePriceData () {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('axios_trade_price', {
          symbol: this.currency,
          target: this.targetCurrency
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('tradePriceData_setter', {
              key: this.currency + '_' + this.targetCurrency,
              value: res.data.price || 0
            })
            this.tradeFee = res.data.otc_fee || 0
          } else {
            this.$message.error(this.$t('ad.ad_reference_price_request_fail'))
          }
          resolve()
        }).catch(() => {
          resolve()
          // this.$message.error(this.$t('ad.ad_reference_price_request_fail'))
        }).finally(() => {
          this.tradePriceTimer && clearTimeout(this.tradePriceTimer)
          this.tradePriceTimer = setTimeout(this.getTradePriceData, 1000 * 60 * 10)
        })
      })
    },
    getNotice () {
      this.$store.dispatch('axios_notice').then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('userInfo_notice_setter', +res.data.notice)
        }
      }).catch(() => {
      })
    },
    doInit () {
      this.navbarIndex = this.$route.meta.navbarIndex || 0
      this.$store.commit('tradePath_setter', this.$route.fullPath)
      this.getCurrencyCode()
      this.getTradePrice()
      this.getTradePriceData().then(() => {
        this.getTradePrice()
      })
      if (this.$store.state.userToken) {
        this.getNotice()
      }
    }
  },
  destroyed () {
    this.tradePriceTimer && clearTimeout(this.tradePriceTimer)
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang="stylus" scoped>
  getNavColor(row) {
    if row == 0 {
      return #1BB934
    } else if row == 1 {
      return #ED1C24
    } else {
      return #000000
    }
  }

  .trade {
    .header {
      position fixed
      z-index $zIndexPopup + 1
      top 0
      left 0
      right 0
      width 100vw
      height $currencyHeaderHeight
      color: #000000;
      background #FFFFFF
      border-bottom 1px solid #EEEEEE
      display flex
      align-items center
      .currency {
        display flex
        align-items center
        .logo {
          height 8vw
          width 8vw
          margin-left 5vw
          img {
            object-fit: cover;
            object-position: 0 0;
            width: 100%;
            height: 100%;
          }
        }
        .text {
          margin-left 5vw
          font-weight normal
          font-size 1.2rem
        }
        .icon {
          margin-left 5vw
          transition .5s
        }
        .show {
          transform rotate(180deg)
        }
      }
      .balance {
        flex 1
        display flex
        justify-content flex-end
        font-size 1rem
        margin-right 5vw
        color #ED1C24
        .number {
          font-weight normal
        }
        .targetCurrency {
          align-self flex-end
          margin-left 1vw
          font-size 0.8rem
        }
      }
    }
    .navbar {
      display flex
      align-items center
      position fixed
      left 0
      top $currencyHeaderHeight
      width 100vw
      height $navbarHeaderHeight
      background: #FFFFFF;
      border-bottom 1px solid #EEEEEE
    }
    .page {
      position absolute
      left 0
      top $currencyHeaderHeight + $navbarHeaderHeight
      width 100vw
      height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
      overflow-y scroll
      -webkit-overflow-scrolling touch
    }
    .popupBg {
      position: fixed;
      z-index $zIndexPopup - 1
      width 100%
      height 100%
      background-color rgba(55, 55, 55, 0.6)
    }
    for row in 0 1 2 3 {
      .navbarItem_{row} {
        /deep/ .mint-tab-item-label {
          font-size 0.9rem
          color getNavColor(row)
          .text {
            font-weight normal
            display flex
            align-items center
            height $navbarHeaderTextHeight
          }
          .focus {
            font-size 1rem
            border-bottom 0.3vh solid
            border-color getNavColor(row)
          }
        }
      }
    }
    /deep/ .popupDiv {
      position: absolute;
      z-index $zIndexPopup
      left 0
      top 8vh
      width 100%
      overflow: scroll;
      overflow-scrolling touch
      -webkit-overflow-scrolling: touch;
      background: #fff;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transition: .2s ease-out;
      transition: .2s ease-out;
      .content {
        width 100vw
        .item {
          background #FFFFFF
          width 100vw
          height 9vh
          display flex
          align-items center
          justify-content center
          border-top 1px solid #EEEEEE
          border-bottom 1px solid #EEEEEE
          &:active, &:hover, &:focus {
            background #DDDDDD
          }
          .logo {
            height 6vw
            width 6vw
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          .text {
            margin-left 4vw
            font-weight normal
            font-size 1rem
          }
        }
      }
    }
  }
</style>

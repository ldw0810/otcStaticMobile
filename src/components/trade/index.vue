<template lang="pug">
  .trade
    .header
      .currency(@click="currencyListFlag = !currencyListFlag")
        .logo(v-if="currencyDefaultData[currency]")
          img(v-lazy="currencyDefaultData[currency]['img']" :key="currencyDefaultData[currency]['img']")
        .text {{currency.toUpperCase()}}
        .icon(:class="{'show': currencyListFlag}")
          img(src="../../assets/images/icon/PullDown-999999.svg")
      .balance {{tradePrice}}
    mt-navbar(v-model="navbarIndex" class="navbar")
      LinkBarItem(id="0" class="navbarItem" route="/buy") {{$t('public.buy')}}
      LinkBarItem(id="1" class="navbarItem" route="/sell") {{$t('public.sell')}}
      LinkBarItem(id="2" class="navbarItem" route="/order") {{$t('public.order')}}
    .page
      transition(name="fade" mode="out-in")
        router-view
    .popupBg(v-if="currencyListFlag" @click="currencyListFlag = false")
    transition(name="top" mode="out-in")
      .popupDiv(v-if="currencyListFlag")
        .content
          .item(v-for="(item, index) in currencyList" :value="item" :key="index" @click="changeCurrency(item)")
            .logo(v-if="currencyDefaultData[item]")
              img(v-lazy="currencyDefaultData[item]['img']")
            .text(@click="currencyListFlag = true") {{item.toUpperCase()}}
</template>
<script type="es6">
import Vue from 'vue'
import {Navbar} from 'mint-ui'
import LinkBarItem from '../common/linkBarItem'

const configure = require('../../../configure')

Vue.component(Navbar.name, Navbar)

export default {
  components: {
    LinkBarItem
  },
  data () {
    return {
      currencyDefaultData: {
        'dai': {
          img: require('../../assets/images/trade/CoinLogo-DAI.png')
        },
        'eth': {
          img: require('../../assets/images/trade/CoinLogo-ETH.png')
        },
        'omt': {
          img: require('../../assets/images/trade/CoinLogo-OMT.svg')
        },
        'ck': {
          img: require('../../assets/images/trade/CoinLogo-CAT.png')
        }
      },
      navbarIndex: 0,
      tarbarIndex: 0,
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
      return this.$route.query.currency || (this.currencyList.length && this.currencyList[0]) || configure.CONF_DIGITAL_CURRENCY_LIST[0].currency
    },
    targetCurrency () {
      for (let i = 0; i < configure.CONF_DIGITAL_CURRENCY_LIST.length; i++) {
        if (configure.CONF_DIGITAL_CURRENCY_LIST[i].currency === this.currency) {
          return configure.CONF_DIGITAL_CURRENCY_LIST[i].targetCurrency
        }
      }
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  methods: {
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
    getTradePrice () {
      this.$store.dispatch('axios_trade_price', {
        symbol: this.currency,
        target: this.targetCurrency
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.tradePrice = res.data.price || 0
          this.tradeFee = res.data.otc_fee || 0
        } else {
          this.$message.error(this.$i18n.translate('ad.ad_reference_price_request_fail'))
        }
      }).catch(() => {
        this.$message.error(this.$i18n.translate('ad.ad_reference_price_request_fail'))
      })
      this.tradePriceTimer && clearTimeout(this.tradePriceTimer)
      this.tradePriceTimer = setTimeout(this.getTradePrice, 1000 * 60 * 10)
    },
    init () {
      this.getTradePrice()
    }
  },
  destroyed () {
    this.tradePriceTimer && clearTimeout(this.tradePriceTimer)
  },
  mounted () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('axios_currency_code')
    })
  }
}
</script>
<style lang="stylus" scoped>
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
      }
    }
    .navbar {
      display flex
      align-items center
      position absolute
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
    }
    .popupBg {
      position: fixed;
      z-index $zIndexPopup - 1
      width 100%
      height 100%
      background-color rgba(55, 55, 55, 0.6)
    }
    /deep/ .navbarItem{
      .mint-tab-item-label {
        font-size 0.9rem
      }
      &:nth-child(1) {
        .mint-tab-item-label {
          color #1BB934
        }
      }
      &:nth-child(2) {
        .mint-tab-item-label {
          color #ED1C24
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

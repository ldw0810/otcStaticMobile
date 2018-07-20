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
    mt-navbar(class="navbar" v-model="navbarIndex")
      mt-tab-item(id="1" class="navbarItem") {{$t('public.buy')}}
      mt-tab-item(id="2" class="navbarItem") {{$t('public.sell')}}
      mt-tab-item(id="3" class="navbarItem") {{$t('public.order')}}
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
import {Header, Navbar, TabItem} from 'mint-ui'

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)

export default {
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(to)
      vm.$loading.open()
    })
  },
  destroyed () {
    this.tradePriceTimer && clearTimeout(this.tradePriceTimer)
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="stylus" scoped>
  .trade {
    .header {
      position fixed
      z-index 101
      top 0
      left 0
      right 0
      width 100vw
      height 8vh
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
      position fixed
      left 0
      top 8vh
      width 100vw
      height 5vh
      background: #FFFFFF;
      border-bottom 1px solid #EEEEEE
      .navbarItem {
      }
    }
    .popupBg {
      position: fixed;
      z-index 99
      width 100%
      height 100%
      background-color rgba(55, 55, 55, 0.6)
    }
    /deep/ .popupDiv {
      position: absolute;
      z-index 100
      left 0
      top 8vh
      width 100%
      overflow: scroll;
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

  /deep/ .mint-tab-item-label {
    :nth-child(1) {
      color: red
    }
  }
</style>

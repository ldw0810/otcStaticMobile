<template lang="pug">
  .adList
    mt-loadmore(:top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore")
    .itemList(v-if="ads.list.length")
      .item(v-for="(ad, index) in ads.list" :key="index")
        .wrapper
          .content
            Avatar(class="avatar" :status='ad.member.online')
            .info
              .name {{ad.member.nickname}}
              .pack
                .tradeNumber {{$t("order.order_trade_count", {'0': ad.member.stat.trade_count})}}
                .goodRate {{$t("order.order_praise_rate")}}: {{ad.member.stat.good_rate}}%
                .icon
                  img(src="../../assets/images/trade/C-Alipay.png" v-if="!ad.member.bank")
                  img(src="../../assets/images/trade/C-Card.png" v-else-if="ad.member.bank")
            el-button(class="operation" :class="{'sell': adType === 1}" type='primary' @click="submit")
              i(v-if="adType === 0") {{$t('public.buy')}}
              i(v-if="adType === 1") {{$t('public.sell')}}
          .price
            .number {{ad.current_price | fixDecimalAuto(ad.target_currency)}}
            .text
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
      allLoaded: false,
      adType: !this.$route.meta.navbarIndex ? 0 : 1,
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
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
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
      this.adType = this.$route.meta.adType || 0
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
      }
    }
  }
  .emptyDiv {
    width 100vw
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
  }
</style>

<template lang="pug">
  .asset
    mt-header(:title="$t('public.asset')" fixed)
    .wrapper(v-if="userInfo.id")
      .content
        .item(v-for="(item, index) in userInfo.valid_account" :key="index" @click="goAsset(index)")
          .wrapper
            .currency
              .logo(v-if="currencyDefaultData[userInfo.valid_account[index].currency]")
                img(v-lazy="currencyDefaultData[userInfo.valid_account[index].currency]['img']" :key="currencyDefaultData[userInfo.valid_account[index].currency]['img']")
              .text {{userInfo.valid_account[index].currency.toUpperCase()}}
            .amount {{item.amount}}
          .border
          .wrapper
            .balance
              .number {{item.balance}}
              .text {{$t('public.balance')}}
            .locked
              .number {{item.locked}}
              .text {{$t('public.locked')}}
</template>
<script type="es6">
import {Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)

export default {
  name: 'asset',
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
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    goAsset (index) {
      this.$router.push({
        path: '/assetDetail',
        query: {
          currency: this.userInfo.valid_account[index].currency
        }
      })
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    init () {
      this.getMe()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="stylus" scoped>
  .asset {
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
    height 100 - $mintHeaderHeight - $tabbarFooterHeight
    overflow-y scroll
    .item {
      display flex
      flex-direction column
      align-items center
      margin-top 1vh
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      background #FFFFFF
      .wrapper {
        flex 1
        height 10vh
        width 100vw
        display flex
        align-items center
        .currency {
          flex 1
          display flex
          align-items center
          justify-content flex-start
          .logo {
            margin-left 10vw
            height 8vw
            width 8vw
            img {
              object-fit: cover;
              object-position: 0 0;
              width: 100%;
              height: 100%;
            }
          }
          .text {
            margin-left 5vw
            font-size 1.2rem
            font-weight normal
          }
        }
        .amount {
          flex 1
          display flex
          align-items center
          justify-content center
          font-size 1.2rem
          font-weight normal
        }
        .balance {
          flex 1
          display flex
          align-items center
          flex-direction column
          justify-content center
          .number {
            color #666666
            font-size 1rem
          }
          .text {
            color #CCCCCC
            font-size 0.85rem
          }
        }
        .locked {
          flex 1
          display flex
          align-items center
          flex-direction column
          justify-content center
          .number {
            color #666666
            font-size 1rem
          }
          .text {
            color #CCCCCC
            font-size 0.85rem
          }
        }
      }
      .border {
        display flex
        align-items center
        height 1px
        width 80vw
        background #EEEEEE
      }
    }
  }
</style>

<template lang="pug">
  .assetDetail
    mt-header(:title="$t('public.asset') + ' - ' + currency.toUpperCase()" fixed)
      router-link(to="/asset" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id && userInfo.valid_account[currencyIndex]")
      .content
        .asset
          .banner
            .currency
              .logo(v-if="currencyDefaultData[currency]")
                img(v-lazy="currencyDefaultData[currency]['img']" :key="currencyDefaultData[currency]['img']")
              .text {{currency.toUpperCase()}}
            .amount {{userInfo.valid_account[currencyIndex].amount}}
          .border
          .banner
            .balance
              .number {{userInfo.valid_account[currencyIndex].balance}}
              .text {{$t('public.balance')}}
            .locked
              .number {{userInfo.valid_account[currencyIndex].locked}}
              .text {{$t('public.locked')}}
        .oper
          .operDiv
            .btn(@click="goOper(0)")
              .text(:class="{'focus': assetOperIndex === 0}") {{$t('public.recharge')}}
            .btn(@click="goOper(1)")
              .text(:class="{'focus': assetOperIndex === 1}") {{$t('public.withdraw')}}
          .border
          .operContent
            mt-tab-container(v-model="assetOperIndex" swipeable)
              mt-tab-container-item(:id="0")
                .page(v-if="deposit.account.length && deposit.account[0].deposit_address")
                  .text {{deposit.account[0].deposit_address}}
                .noAddressPage(v-else)
                  .tip {{$t("asset.asset_recharge_address_get_tip")}}
                  mt-button(class="addressButton" @click.native.prevent="getAddress") {{$t("asset.asset_recharge_address_get")}}
              mt-tab-container-item(:id="1")
                span 22222
      .footer(class="mintSubmit")
        mt-button(@click="submit") {{$t('asset.asset_withdraw_and_recharge_history')}}
</template>
<script type="es6">
import {Button, CellSwipe, Field, Header, MessageBox, TabContainer, TabContainerItem} from 'mint-ui'
import Vue from 'vue'

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Field.name, Field)
Vue.component(CellSwipe.name, CellSwipe)
Vue.component(MessageBox.name, MessageBox)

export default {
  name: 'assetDetail',
  data () {
    return {
      assetOperIndex: this.$route.query.oper === 'deposit' ? 0 : 1,
      defaultCollectionIndex: -1,
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
      deposit: {
        account: [],
        deposit_channels: {},
        deposits_history: [],
        page: 1,
        per_page: 20,
        total_count: 0,
        total_pages: 1
      },
      withdraw: {
        default_source_id: '',
        fund_sources: [],
        withdraw_channels: {},
        withdraws: [],
        page: 1,
        per_page: 20,
        total_count: 0,
        total_pages: 1
      }
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    currency () {
      return this.$route.query.currency || (this.userInfo.valid_account.length && this.userInfo.valid_account[0].currency) || configure.CONF_DIGITAL_CURRENCY_LIST[0].currency
    },
    currencyIndex () {
      if (this.userInfo.valid_account.length) {
        for (let i = 0; i < this.userInfo.valid_account.length; i++) {
          if (this.currency === this.userInfo.valid_account[i].currency) {
            return i
          }
        }
      } else {
        return -1
      }
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    goOper (index) {
      this.$router.push({
        path: this.$route.path,
        query: {
          currency: this.currency,
          oper: index === 0 ? 'deposit' : 'withdraw'
        }
      })
    },
    getAddress () {
      this.$loading.open()
      this.$store.dispatch('axios_gen_address', {
        currency: this.currency
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.getData()
        }
      }).catch(() => {
        this.$message.error(this.$t('asset.asset_address_request_fail'))
      })
    },
    getData () {
      if (this.assetOperIndex === 0) {
        this.$store.dispatch('axios_get_deposit', {
          currency: this.currency,
          limit: this.deposit.per_page,
          page: +this.pageIndex || this.deposit.page
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.deposit = res.data
          }
        }).catch(() => {
        })
      } else {

      }
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    submit () {
      this.$router.push('/assetHistory')
    },
    init () {
      this.getMe()
      this.assetOperIndex = this.$route.query.oper === 'deposit' ? 0 : 1
      this.getData()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  footerHeight = 12vh
  .assetDetail {
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
    height 100 - $mintHeaderHeight - footerHeight
    overflow-y scroll
    .asset {
      display flex
      flex-direction column
      align-items center
      margin-top 1vh
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      background #FFFFFF
      .banner {
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
    .oper {
      display flex
      flex-direction column
      align-items center
      margin-top 1vh
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      background #FFFFFF
      .operDiv {
        display flex
        align-items center
        justify-content center
        width 100vw
        height 5vh
        .btn {
          flex 1
          display flex
          align-items center
          justify-content center
          .text {
            color #999999
            font-size 0.85rem
            font-weight lighter
          }
          .focus {
            color #333333
            font-size 1rem
            font-weight normal
            border-bottom 0.3vh solid
            border-color #333333
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
      .operContent {
        width 100vw
        .page {

        }
        .noAddressPage {
          display flex
          align-items center
          flex-direction column
          width 100vw
          margin 15vh 0
          .tip {
            color #333333
            font-weight normal
            font-size 0.9rem
            margin-bottom 2.5vh
          }
          .addressButton {
            min-width 32vw
            color #FFFFFF
            background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
            box-shadow: 0 5px 5px 0 rgba(102,187,191,0.14);
            margin-top: 1vh;
            font-size: 0.85rem;
            line-height 1.2
            text-align: center;
            border-radius: 6px;
            display flex
            align-items center
            justify-content center
          }
        }
      }
    }
  }

  .footer {
    height footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }
</style>

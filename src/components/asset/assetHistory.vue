<template lang="pug">
  .assetHistory
    mt-header(:title="$t('asset.asset_withdraw_and_recharge_history_currency', {'0': currency.toUpperCase()})" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .page
      .content
        .operDiv
          .btn(@click="goOper(0)")
            .text(:class="{'focus': assetHistoryIndex === 0}") {{$t('asset.asset_recharge_history')}}
          .btn(@click="goOper(1)")
            .text(:class="{'focus': assetHistoryIndex === 1}") {{$t('asset.asset_withdraw_history')}}
        .border
        .operContent
          mt-tab-container(v-model="assetHistoryIndex")
            mt-tab-container-item(:id="0")
              .wrapper(v-if="deposit.deposit_channels.id")
                mt-loadmore(:autoFill="false" :top-method="loadTop" :top-all-loaded="allLoaded" :topPullText="$t('public.loadMore_topPullText')" :topDropText="$t('public.loadMore_dropText')" :topLoadingText="$t('public.loadMore_loadingText')" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText="$t('public.loadMore_bottomPullText')" :bottomDropText="$t('public.loadMore_dropText')" :bottomLoadingText="$t('public.loadMore_loadingText')" ref="loadmore")
                  .historyPage(v-if="deposit.deposits_history.length")
                    .item(v-for="(item, index) in deposit.deposits_history" :key="index")
                      .info
                        .time {{item.created_at | $getDateStr()}}
                        .state
                          .text {{$t('asset[\'asset_recharge_status_' + item.aasm_state + '\']')}}
                          .button {{item.confirmations < (deposit.deposit_channels ? +deposit.deposit_channels.max_confirm : 0) ? '&nbsp;&nbsp;' + item.confirmations + '/' + (deposit.deposit_channels ? + deposit.deposit_channels.max_confirm : 0): ''}}
                      .numberDiv
                        .tip {{$t('asset.asset_number') + ': '}}
                        .number {{(item.amount || 0) | $fixDecimalsAsset()}}
                      .txidDiv
                        .tip {{'Txid: '}}
                        .txid(@click="goBlockUrl(item)") {{item.txid}}
                  .noDataPage(v-else)
                    EmptyList(class="emptyDiv" :text="$t('public.no_asset_recharge')")
          mt-tab-container(v-model="assetHistoryIndex")
            mt-tab-container-item(:id="1")
              .wrapper(v-if="withdraw.withdraw_channels.id")
                mt-loadmore(:autoFill="false" :top-method="loadTop" :top-all-loaded="allLoaded" :topPullText="$t('public.loadMore_topPullText')" :topDropText="$t('public.loadMore_dropText')" :topLoadingText="$t('public.loadMore_loadingText')" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText="$t('public.loadMore_bottomPullText')" :bottomDropText="$t('public.loadMore_dropText')" :bottomLoadingText="$t('public.loadMore_loadingText')" ref="loadmore")
                  .historyPage(v-if="withdraw.withdraws.length")
                    .item(v-for="(item, index) in withdraw.withdraws" :key="index")
                      .info
                        .time {{item.created_at | $getDateStr()}}
                        .state(v-if="['submitting'].indexOf(item.aasm_state) > -1")
                          .button(@click="resendWithdraw(item, index)") {{$t('asset.asset_resend_email')}}
                          .button(@click="cancelWithdraw(item, index)") {{$t('public.cancel')}}
                        .state(v-else-if="['submitted', 'accepted'].indexOf(item.aasm_state) > -1")
                          .button(@click="cancelWithdraw(item, index)") {{$t('public.cancel')}}
                        .state(v-else-if="['suspect', 'processing', 'almost_done', 'failed'].indexOf(item.aasm_state) > -1")
                          .text {{$t('asset.asset_withdraw_status_underway')}}
                        .state(v-else)
                          .text {{$t("asset.asset_withdraw_status_" + item["aasm_state"])}}
                      .numberDiv
                        .tip {{$t('asset.asset_number') + ': '}}
                        .number {{(item.amount || 0) | $fixDecimalsAsset()}}
                      .txidDiv
                        .tip {{'Txid: '}}
                        .txid(@click="goBlockUrl(item)") {{item.fund_uid}}
                  .noDataPage(v-else)
                    EmptyList(class="emptyDiv" :text="$t('piublic.no_asset_withdraw')")
    transition(name="slide-right" mode="out-in")
      .popup(class="popup-right" v-if="withdrawEmailFlag")
        slot
          WithdrawEmail(:withdraw_id="selectWithdraw.id" :currency="currency" @close="withdrawEmailFlag = false")
</template>
<script type="es6">
import {Button, Header, TabContainer, TabContainerItem, Loadmore} from 'mint-ui'
import Vue from 'vue'
import EmptyList from '../common/emptyList'
import WithdrawEmail from './withdrawEmail'

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Loadmore.name, Loadmore)

export default {
  name: 'assetHistory',
  components: {
    WithdrawEmail,
    EmptyList
  },
  data () {
    return {
      assetHistoryIndex: this.$route.query.oper === 'deposit' ? 0 : 1,
      withdrawEmailFlag: false,
      selectWithdraw: {},
      allLoaded: false
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    deposit () {
      return this.$store.state.deposit
    },
    withdraw () {
      return this.$store.state.withdraw
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    currency () {
      return this.$route.query.currency || (this.userInfo.valid_account.length && this.userInfo.valid_account[0].currency) || configure.CONF_DIGITAL_CURRENCY_LIST[0].currency
    }
  },
  methods: {
    loadTop () {
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded()
      }, 2000)
    },
    loadBottom () {
      console.log(2)
      this.$refs.loadmore.onBottomLoaded()
    },
    goBack () {
      this.$router.push({
        path: '/assetDetail',
        query: {
          currency: this.currency
        }
      })
    },
    goOper (index) {
      this.$router.push({
        path: this.$route.path,
        query: {
          currency: this.currency,
          oper: index === 0 ? 'deposit' : 'withdraw'
        }
      })
    },
    goBlockUrl (item) {
      item.blockchain_url && window.open(item.blockchain_url)
    },
    getData () {
      if (this.assetHistoryIndex === 0) {
        this.$store.dispatch('axios_get_deposit', {
          currency: this.currency,
          limit: this.deposit.per_page,
          page: this.deposit.page
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('deposit_setter', res.data)
          }
        }).catch(() => {
        })
      } else {
        this.$store.dispatch('axios_get_withdraw', {
          currency: this.currency,
          limit: this.withdraw.per_page,
          page: this.withdraw.page
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('withdraw_setter', res.data)
            this.checkAllState()
            this.get_address_id()
          }
        }).catch(() => {
        })
      }
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    resendWithdraw (item, index) {
      this.selectWithdraw = item
      this.withdrawEmailFlag = true
    },
    cancelWithdraw (item, index) {
      this.$loading.open()
      this.$store.dispatch('axios_withdraw_cancel', {
        id: item.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.init()
        }
      }).catch(() => {
      })
    },
    init () {
      if (!this.$route.query.currency) {
        this.getMe()
      }
      this.assetHistoryIndex = this.$route.query.oper === 'withdraw' ? 1 : 0
      this.getData()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .assetHistory {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
    .page {
      .content {
        flex 1
        margin-top $mintHeaderHeight
        .operDiv {
          display flex
          align-items center
          justify-content center
          width 100vw
          height $subTitleHeaderHeight
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
        .wrapper {
          overflow-y scroll
          .historyPage {
            display flex
            flex-direction column
            align-items center
            background #FFFFFF
            width 100vw
            .item {
              display flex
              flex-direction column
              justify-content center
              padding 2.5vh 6vw
              border-top 1px solid #EEEEEE
              border-bottom 1px solid #EEEEEE
              .info {
                display flex
                align-items center
                .time {
                  flex 1
                  font-size 0.9rem
                  color #999999
                }
                .state {
                  display flex
                  align-items center
                  .button {
                    font-size 0.9rem
                    font-weight normal
                    color #2EA2F8
                    padding-left 5vw
                  }
                  .text {
                    font-size 0.9rem
                    font-weight normal
                    color #333333
                  }
                }
              }
              .numberDiv {
                display flex
                align-items center
                padding-top 1vh
                .tip {
                  font-size 0.9rem
                  font-weight normal
                  color #333333
                }
                .number {
                  font-size 0.9rem
                  font-weight normal
                  color #333333
                  margin-left 2.5vw
                }
              }
              .txidDiv {
                display flex
                align-items center
                padding-top 1vh
                .tip {
                  font-size 0.9rem
                  font-weight normal
                  color #333333
                }
                .txid {
                  font-size 0.9rem
                  font-weight normal
                  color #2EA2F8
                  margin-left 2.5vw
                  word-break break-all
                }
              }
            }
          }
          .noDataPage {
            display flex
            align-items center
            justify-content center
            background #FFFFFF
            width 100vw
            height 100 - $subTitleHeaderHeight - $mintHeaderHeight
          }
        }
      }
    }
  }
</style>

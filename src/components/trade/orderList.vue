<template lang="pug">
  .order(v-if="+orders.error === 0" :style="{'-webkit-overflow-scrolling': scrollMode}")
    mt-loadmore(:autoFill="false" :top-method="loadTop" :topPullText="$t('public.loadMore_topPullText')" :topDropText="$t('public.loadMore_dropText')" :topLoadingText="$t('public.loadMore_loadingText')" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText="$t('public.loadMore_bottomPullText')" :bottomDropText="$t('public.loadMore_dropText')" :bottomLoadingText="$t('public.loadMore_loadingText')" ref="loadmore")
      .itemList(v-if="orders.list.length")
        .item(v-for="(order, index) in orders.list" :key="index" @click="goOrder(order)")
          .notice(:class="{'noticeShow': order.notice_order !== 0}")
          .wrapper
            .content
              Avatar(class="avatar" :status="order.member.online" :statusType="1" :size="6")
              .info
                .packDiv
                  .pack
                    .infoItem
                      .name {{order.member.nickname}}
                    .infoItem
                      .text {{$t("order.order_id")}}:
                      .value {{order.id}}
                  mt-button(class="operation" :class="{'buyBtn': order.op_type === 'buy', 'sellBtn': order.op_type === 'sell'}" type='primary') {{$t('public.' + order.op_type) + order.currency.toUpperCase()}}
                .infoItem
                  .text {{$t("order.order_time")}}:
                  .value {{+order.created_at * 1000 | $getDateStr()}}
                .infoItem
                  .text {{$t("order.order_number")}}:
                  .value {{order.amount | $fixDecimalAuto(order.currency)}} {{order.currency.toUpperCase()}}
                .infoItem
                  .text {{$t("order.order_money_amount")}}:
                  .value {{order.price_sum | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
            .border
            .status(class="ongoing" v-if="(['fresh', 'pay', 'release'].indexOf(order.status) > -1) || (order.status === 'sell_eval' && order.op_type === 'buy') || (order.status === 'buy_eval' && order.op_type === 'sell')") {{$t("order.order_status_" + order.status)}}
            .status(class="cancel" v-else-if="['judge_seller', 'timeout', 'cancel'].indexOf(order.status) > -1") {{$t("order.order_status_" + order.status)}}
            .status(class="complete" v-else) {{$t("order.order_status_" + order.status)}}
      EmptyList(class="emptyDiv" :text="$t('public.no_order_list')" :loading="ordersLoading" v-else)
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Loadmore, Button} from 'mint-ui'
import Vue from 'vue'
import unionBy from 'lodash/unionBy'
import configure from '../../../configure'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
export default {
  name: 'order',
  components: {
    Avatar,
    EmptyList
  },
  data () {
    return {
      ordersLoading: false,
      scrollMode: 'auto',
      allLoaded: false,
      bottomPageIndex: 1
    }
  },
  computed: {
    orders () {
      return this.$store.state.orders || {list: []}
    }
  },
  watch: {
    $route: function () {
      this.doInit()
    }
  },
  methods: {
    loadTop () {
      this.getOrders(1).then(() => {
        this.$refs.loadmore.onTopLoaded()
      })
    },
    loadBottom () {
      this.bottomPageIndex++
      this.getOrders(2).then(() => {
        this.$refs.loadmore.onBottomLoaded()
      })
    },
    getOrders (type) {
      return new Promise((resolve, reject) => {
        if (!type) {
          this.$loading.open()
        }
        this.ordersLoading = true
        this.$store.dispatch('axios_order_list', {
          limit: configure.LIST_NUMBER_PER_PAGE,
          page: +type === 2 ? this.bottomPageIndex : 1
        }).then(res => {
          this.ordersLoading = false
          if (res.data && +res.data.error === 0) {
            let tempData = res.data
            if (type === 1) {
              tempData.list = unionBy(tempData.list, this.orders.list, 'id')
            } else if (type === 2) {
              tempData.list = unionBy(this.orders.list, tempData.list, 'id')
            }
            if (tempData.total_pages < this.bottomPageIndex + 1) {
              this.allLoaded = true
            }
            this.$store.commit('orders_setter', tempData)
            this.$nextTick(() => {
              this.scrollMode = 'touch'
            })
          }
          resolve()
        }).catch(() => {
          this.ordersLoading = false
          // this.$message.error(this.$t('order.order_data_request_fail'))
          resolve()
        })
      })
    },
    goOrder (item) {
      this.$router.push({
        path: '/order',
        query: {
          id: item.id
        }
      })
    },
    doInit () {
      this.getOrders()
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang="stylus" scoped>
  itemHeight = 23vh
  itemContentHeight = 18vh
  noticeWidth = 1vw
  .order {
    @extend .scrollPage
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
    .itemList {
      margin-bottom 1vh
      .item {
        height itemHeight
        display flex
        margin-top 1vh
        border-top: 1px solid #EEEEEE
        border-bottom: 1px solid #EEEEEE
        background #FFFFFF
        .notice {
          width noticeWidth
          height itemHeight
          background #FFFFFF
        }
        .noticeShow {
          background #F36066
        }
        .wrapper {
          display flex
          flex-direction column
          align-items center
          .content {
            flex 1
            width 100 - noticeWidth
            height itemContentHeight
            align-self flex-start
            display flex
            align-items flex-start
            padding-top 1.5vh
            .avatar {
              margin 0 2.5vw
            }
            .info {
              flex 1
              height itemContentHeight - 2vh
              display flex
              flex-direction column
              font-size 0.85rem
              .packDiv {
                display flex
                align-items center
              }
              .pack {
                flex 1
                display flex
                align-items flex-start
                flex-direction column
              }
              .name {
                font-weight normal
                font-size 0.85rem
                color #333333
              }
              .operation {
                position absolute
                right 0
                font-size 0.8rem
                margin-right 5vw
                height 5vh
              }
              .infoItem {
                display flex
                .text {
                  min-width 15vw
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
            .buyBtn {
              background #1BB934
            }
            .sellBtn {
              background #ED1C24
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
            height itemHeight - itemContentHeight
            display flex
            align-items center
            justify-content center
            font-size 0.9rem
          }
          .ongoing {
            color #999999
          }
          .cancel {
            color #999999
          }
          .complete {
            color #1BB934
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

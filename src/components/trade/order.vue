<template lang="pug">
  .order(v-if="+orders.error === 0")
    <!--mt-loadmore(:top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore")-->
    .itemList(v-if="orders.list.length")
      .item(v-for="(order, index) in orders.list" :key="index")
        .notice(:class="{'noticeShow': order.notice_order !== 0}")
        .wrapper
          .content
            Avatar(class="avatar" :status="order.member.online" :statusType="1" :size="6")
            .info
              .name {{order.member.nickname}}
              .infoItem
                .text {{$t("order.order_id")}}:
                .value {{order.id}}
              .infoItem
                .text {{$t("order.order_time")}}:
                .value {{+order.created_at * 1000 | $getDateStr()}}
              .infoItem
                .text {{$t("order.order_number")}}:
                .value {{order.amount | $fixDecimalAuto(order.currency)}} {{order.currency.toUpperCase()}}
              .infoItem
                .text {{$t("order.order_money_amount")}}:
                .value {{order.price_sum | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
            mt-button(class="operation" :class="{'buyBtn': order.op_type === 'buy', 'sellBtn': order.op_type === 'sell'}" type='primary' disabled) {{$t('public.' + order.op_type) + order.currency.toUpperCase()}}
          .border
          .status(:class="{'complete': ['over', 'complete'].indexOf(order.status) > -1}") {{$t("order.order_status_" + order.status)}}
    EmptyList(:text='emptyMessage' v-else)
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Loadmore, Button} from 'mint-ui'
import Vue from 'vue'

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
      allLoaded: false,
      pageIndex: 1
    }
  },
  computed: {
    orders () {
      return this.$store.state.orders
    }
  },
  methods: {
    loadTop () {
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.$refs.loadmore.onBottomLoaded()
    },
    showOrders () {
      this.$loading.open()
      this.$store.dispatch('axios_order_list', {
        limit: +this.orders.per_page,
        page: +this.pageIndex || +this.orders.page
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('orders_setter', res.data)
        }
      }).catch(() => {
        this.$message.error(this.$t('order.order_data_request_fail'))
      })
    },
    submit () {
    },
    init () {
      this.showOrders()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="stylus" scoped>
  itemHeight = 22vh
  noticeWidth = 1vw
  .order {
    width 100vw
    height 100 - $currencyHeaderHeight - $navbarHeaderHeight - $tabbarFooterHeight
    background-color: #fafafa;
    overflow-y scroll
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
            align-self flex-start
            display flex
            align-items flex-start
            padding-top 1.5vh
            .avatar {
              margin 0 2.5vw
            }
            .info {
              flex 1
              display flex
              flex-direction column
              font-size 0.85rem
              .name {
                font-weight normal
                font-size 0.85rem
                color #333333
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
            .operation {
              position relative
              align-items center
              justify-content center
              font-size 0.8rem
              margin-right 5vw
              height 5vh
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
            height 4vh
            display flex
            align-items center
            justify-content center
            font-size 0.9rem
            font-weight normal
            color #999999
          }
          .complete {
            color #1BB934
          }
        }
      }
    }
  }
</style>

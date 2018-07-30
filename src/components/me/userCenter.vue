<template lang="pug">
  .userCenter(v-if="userInfo.id")
    .bg
      img(src="../../assets/images/me/usercenter-bg.jpg")
    .img
      Avatar(:size="10")
    .name {{userInfo.nickname}}
    .info
      .tradeNumber {{$t('order.order_trade_count', {'0': userInfo.stat.trade_count})}}
      .border |
      .goodRate {{$t('order.order_praise_rate')}}: {{userInfo.stat.good_rate}}%
    .wrapper
      mt-cell(:title="$t('user.authentication_email')" @click.native.prevent="goLink('email')" :is-link="!userInfo.activated")
        span {{!userInfo.activated ? ($t('user.authentication_wait') + '(' + $t('user.authentication_email_reSend') + ')') : $t('user.authenticated')}}
      mt-cell(:title="$t('user.authentication_phone')" @click.native.prevent="goLink('phone')" :is-link="!userInfo.mobile")
        span {{!userInfo.mobile ? $t('user.unAuthenticated') : ($t('user.authenticated') + '(' + userInfo.phone_number + ')')}}
      mt-cell(:title="$t('user.user_settings')" to="/me/settings" is-link)
      mt-cell(:title="$t('user.user_change_language')" to="/me/changeLanguage" is-link)
      mt-cell(:title="$t('user.user_invite_friends')" to="/invite" is-link)
      mt-cell(:title="$t('public.about')" to="/me/about" is-link)
      mt-cell(class="logout" :title="$t('public.logout')" @click.native.prevent="actionFlag = true")
    mt-actionsheet(v-model="actionFlag" :actions="actions")
</template>
<script type="es6">
import Avatar from '../common/avatar'
import {Cell, Actionsheet} from 'mint-ui'
import Vue from 'vue'

Vue.component(Cell.name, Cell)
Vue.component(Actionsheet.name, Actionsheet)

export default {
  name: 'userCenter',
  components: {
    Avatar
  },
  data () {
    return {
      actionFlag: false,
      actions: [
        {
          name: this.$t('public.confirm'),
          method: () => {
            this.goLink('logout')
          }
        }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    getMe () {
      this.$store.dispatch('axios_me')
    },
    goLink (itemStr) {
      if (itemStr === 'email') {
        if (!this.userInfo.activated) {
          this.$router.push('/me/authEmail')
        }
      } else if (itemStr === 'phone') {
        if (!this.userInfo.mobile) {
          this.$router.push('/me/authPhone')
        }
      } else if (itemStr === 'logout') {
        this.$store.commit('delToken')
        this.$router.push('/login')
      }
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
<style lang='stylus' scoped>
  .userCenter {
    min-height 100 - $tabbarFooterHeight
    background #fafafa
  }

  .bg {
    position absolute
    left: 0
    top: 0
    width 100vw
    img {
      object-fit: cover;
      object-position: 0 0;
      width: 100%;
      height: 100%;
    }
  }

  .img {
    padding-top 14vh
    width 100vw
    .avatar {
      display flex
      align-items center
      justify-content center
    }
  }

  .name {
    width 100vw
    text-align center
    padding-top 1vh
    font-weight normal
    font-size 1.5rem
    color #333333
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
  }

  .info {
    padding 0.5vh 0 2.5vh
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    .tradeNumber {
      flex 1
      display flex
      justify-content center
    }
    .goodRate {
      flex 1
      display flex
      justify-content center
    }
  }
  .wrapper {
    overflow-y scroll
  }
  /deep/ .logout .mint-cell-title {
    display flex
    align-items center
    justify-content center
    .mint-cell-text {
      color #ED1C24
    }
  }
</style>

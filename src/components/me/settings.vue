<template lang="pug">
  .settings(v-if="userInfo.id")
    mt-header(:title="$t('user.user_settings')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="$t('user.default_receivables')" :to="haveDefaultCollection ? '/me/collectionList' : '/me/addCollection'" :value="haveDefaultCollection ? $t('public.modify') : $t('public.add')" is-link)
      mt-cell(:title="$t('user.modify_password')" to="/me/modifyPassword" :value="$t('public.modify')" is-link)
      mt-cell(:title="$t('user.auth_phone')" to="/me/authPhone" :value="userInfo.mobile ? $t('public.disable') : $t('public.enable')" is-link)
      mt-cell(:title="$t('user.auth_google')" to="/me/authGoogle" :value="userInfo.app_two_factor ? $t('public.disable') : $t('public.enable')" is-link)
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'settings',
  data () {
    return {
    }
  },
  computed: {
    haveDefaultCollection () {
      return this.userInfo.default_collection.kind
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    getMe () {
      if (!this.userInfo.id) {
        this.$store.dispatch('axios_me')
      } else {
        this.$loading.close()
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
  .settings {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
  }
  .content {
    flex 1
    margin-top $mintHeaderHeight + 1
  }
  .footer {
    height 5vh
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }
</style>

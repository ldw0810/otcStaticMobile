<template lang="pug">
  .settings
    mt-header(:title="$t('user.user_settings')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .wrapper(v-if="userInfo.id")
      .content
        mt-cell(:title="$t('user.default_receivables')" :to="collectionList.length ? '/me/collectionList' : '/me/addCollection'" :value="collectionList.length ? $t('public.modify') : $t('public.add')" is-link)
        mt-cell(:title="$t('user.modify_password')" to="/me/modifyPassword" :value="$t('public.modify')" is-link)
        <!--mt-cell(:title="$t('user.auth_phone')" to="/me/authPhone" :value="userInfo.mobile ? $t('public.disable') : $t('public.enable')" is-link)-->
        mt-cell(:title="$t('user.auth_phone')" :value="userInfo.mobile ? $t('public.disable') : $t('public.enable')")
        mt-cell(:title="$t('user.auth_google')" :to="userInfo.app_two_factor ? '/me/authGoogle' : '/me/addGoogle'" :value="userInfo.app_two_factor ? $t('public.disable') : $t('public.enable')" is-link)
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
    collectionList () {
      return this.$store.state.collectionList || []
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    getMe () {
      this.$loading.open()
      if (!this.userInfo.id) {
        this.$store.dispatch('axios_me')
      } else {
        this.$loading.close()
      }
    },
    getCollectionList () {
      this.$store.dispatch('axios_get_receiving').then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('collectionList_setter', res.data.list || [])
        }
      }).catch(() => {
        this.$message.error(this.$t('user.receivables_request_fail'))
      })
    },
    init () {
      this.getMe()
      this.getCollectionList()
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
  /deep/ .mint-cell-value {
    margin-right 5vw
  }
</style>

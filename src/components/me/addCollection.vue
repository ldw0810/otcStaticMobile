<template lang="pug">
  .addCollection
    mt-header(:title="$t('user.receivables_add')" fixed)
      router-link(:to="backLink" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="$t('user.alipay_title')" to="/me/addCollection/addAlipay" is-link v-if="!haveAlipay")
      mt-cell(:title="$t('user.bankCard_title_1')" to="/me/addCollection/addBankcard" is-link)
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'addCollection',
  data () {
    return {
    }
  },
  computed: {
    backLink () {
      return this.$route.query.isFromCollectionList ? '/me/collectionList' : '/me/settings'
    },
    collectionList () {
      return this.$store.state.collectionList || []
    },
    haveAlipay () {
      if (this.collectionList.length) {
        for (let i = 0; i < this.collectionList.length; i++) {
          if (!this.collectionList[i].bank) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    getCollectionList () {
      this.$store.dispatch('axios_get_receiving').then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('collectionList_setter', res.data.list || [])
        }
      }).catch(() => {
        // this.$message.error(this.$t('user.receivables_request_fail'))
      })
    },
    doInit () {
      this.getCollectionList()
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang='stylus' scoped>
  .addCollection {
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
</style>

<template lang="pug">
  .addCollection
    mt-header(:title="$t('user.receivables_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="$t('user.alipay_title')" to="/me/addCollection/addAlipay" is-link)
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
  methods: {
    init () {
      this.$loading.close()
    }
  },
  mounted () {
    this.init()
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
  .footer {
    height 5vh
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }
</style>

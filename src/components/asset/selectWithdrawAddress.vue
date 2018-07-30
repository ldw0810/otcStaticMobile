<template lang="pug">
  .selectWithdrawAddress
    mt-header(:title="$t('asset.asset_withdraw_address')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper(v-if="withdraw.fund_sources.length")
      .content
        mt-cell(:title="item.name" @click.native.prevent="goLink(index)" v-for="(item, index) in withdraw.fund_sources" :key="index" is-link)
          span(slot="title" class="title") {{item.extra}}
          span {{item.uid}}
        .mintSubmit
          mt-button(@click.native.prevent="doAdd") {{$t('asset.asset_withdraw_address_add')}}
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'selectWithdrawAddress',
  data () {
    return {
    }
  },
  computed: {
    withdraw () {
      return this.$store.state.withdraw
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    goLink (index) {
      if (this.withdraw.fund_sources[index]) {
        this.$emit('success', this.withdraw.fund_sources[index])
        this.goBack()
      }
    },
    doAdd () {
      this.$emit('add', 1)
      this.goBack()
    },
    init () {
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .selectWithdrawAddress {
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
    overflow-y scroll
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

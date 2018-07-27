<template lang="pug">
  .home
    transition(name="fade" mode="out-in")
      router-view
    mt-tabbar(v-model="tabbarIndex" class="footer" fixed)
      LinkBarItem(id="0" class="linkBarItem" route="/buy" @click.native="goTrade")
        slot(v-if="+tabbarIndex === 0")
          img(slot="icon" src="../../assets/images/trade/navigationbar-trade-activation.svg")
          i(class="focus") {{$t('public.trade')}}
        slot(v-else)
          img(slot="icon" src="../../assets/images/trade/navigationbar-trade-notactive.svg")
          i {{$t('public.trade')}}
      LinkBarItem(id="1" class="linkBarItem" route="/asset")
        slot(v-if="+tabbarIndex === 1")
          img(slot="icon" src="../../assets/images/trade/navigationbar-assets-activation.svg")
          i(class="focus") {{$t('public.asset')}}
        slot(v-else)
          img(slot="icon" src="../../assets/images/trade/navigationbar-assets-notactive.svg")
          i {{$t('public.asset')}}
      LinkBarItem(id="2" class="linkBarItem" route="/me")
        slot(v-if="+tabbarIndex === 2")
          img(slot="icon" src="../../assets/images/trade/navigationbar-me-activation.svg")
          i(class="focus") {{$t('public.me')}}
        slot(v-else)
          img(slot="icon" src="../../assets/images/trade/navigationbar-me-notactive.svg")
          i {{$t('public.me')}}
</template>
<script type="es6">
import {Tabbar} from 'mint-ui'
import Vue from 'vue'
import LinkBarItem from '../common/linkBarItem'

Vue.component(Tabbar.name, Tabbar)

export default {
  name: 'home',
  components: {
    LinkBarItem
  },
  data () {
    return {
      tabbarIndex: this.$route.meta.tabbarIndex || 0

    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  methods: {
    goTrade () {
      this.$router.push(this.$store.state.tradePath)
    },
    init () {
      this.tabbarIndex = this.$route.meta.tabbarIndex || 0
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .footer {
    height $tabbarFooterHeight
  }

  .focus {
    color #00A6AE
  }

  /deep/ .mint-tabbar > .mint-tab-item.is-selected {
    background none
  }
</style>

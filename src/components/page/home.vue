<template lang="pug">
  .home
    transition(name="fade" mode="out-in")
      router-view
    mt-tabbar(v-model="tabbarIndex" class="footer" fixed)
      LinkBarItem(id="0" route="/trade")
        img(slot="icon" src="../../assets/images/trade/navigationbar-trade-activation.svg" v-if="tabbarIndex === 0")
        img(slot="icon" src="../../assets/images/trade/navigationbar-trade-notactive.svg" v-else)
        i {{$t('public.trade')}}
      LinkBarItem(id="1" route="/asset")
        img(slot="icon" src="../../assets/images/trade/navigationbar-assets-activation.svg" v-if="tabbarIndex === 1")
        img(slot="icon" src="../../assets/images/trade/navigationbar-assets-notactive.svg" v-else)
        i {{$t('public.asset')}}
      LinkBarItem(id="2" route="/me")
        img(slot="icon" src="../../assets/images/trade/navigationbar-me-activation.svg" v-if="tabbarIndex === 2")
        img(slot="icon" src="../../assets/images/trade/navigationbar-me-notactive.svg" v-else)
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
  computed: {
  }
}
</script>
<style lang='stylus' scoped>
  .footer{
    height $tabbarFooterHeight
  }
</style>

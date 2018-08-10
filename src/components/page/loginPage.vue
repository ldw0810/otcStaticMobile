<template lang="pug">
  .loginPage
    transition(name="fade" mode="out-in")
      router-view
    .banner(v-if="isFirstLogin && homeCarouselList.length")
      .bg
      mt-swipe(:auto="configure.HOME_CAROUSEL.speed" :defaultIndex="configure.HOME_CAROUSEL.defaultIndex")
        mt-swipe-item(v-for="(item, index) in homeCarouselList" :key="index")
          img(:src="item")
      .button(@click="isFirstLogin = false") {{$t('public.confirm')}}
</template>
<script type="es6">
import Vue from 'vue'
import {Swipe, SwipeItem} from 'mint-ui'

const configure = require('../../../configure')

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)

export default {
  name: 'loginPage',
  data () {
    return {
      configure: configure
    }
  },
  computed: {
    isFirstLogin () {
      return this.$store.state.isFirstLogin
    },
    homeCarouselList () {
      return this.$store.state.homeCarouselList
    }
  },
  methods: {
    getBanner () {
      this.$loading.open()
      this.$store.dispatch('axios_banner', {
        activity_type: 0,
        device_type: 'mobile'
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('homeCarouselList_setter', res.data.list)
        }
      }).catch(() => {
      })
    },
    init () {
      // if (this.isFirstLogin) {
      //   this.getBanner()
      // }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
</style>

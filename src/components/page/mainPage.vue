<template lang="pug">
  .loginPage
    transition(name="fade" mode="out-in")
      router-view
    transition(name="fade" mode="out-in")
      .banner(v-if="isFirstLogin && homeCarouselList.length")
        .bg
        mt-swipe(class="bannerContent" :auto="configure.HOME_CAROUSEL.speed" :defaultIndex="configure.HOME_CAROUSEL.defaultIndex")
          mt-swipe-item(v-for="(item, index) in homeCarouselList" :key="index")
            .img
              img(:src="item.en_img_src" v-if="item.en_img_src && language.toLowerCase().indexOf('en') > -1")
              img(:src="item.tw_img_src" v-else-if="item.tw_img_src && language.toLowerCase().indexOf('zh-tw') > -1")
              img(:src="item.zh_img_src" v-else-if="item.zh_img_src && language.toLowerCase().indexOf('zh-cn') > -1")
        .button(@click="hideBanner") {{$t('public.confirm')}}
</template>
<script type="es6">
import Vue from 'vue'
import {Swipe, SwipeItem} from 'mint-ui'
import configure from '../../../configure'
import {$getAxiosLanguage} from '../../utils'

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
    isFirstLogin: {
      set (val) {
        this.$store.commit('isFirstLogin_setter', val)
      },
      get () {
        return this.$store.getters.isFirstLogin
      }
    },
    homeCarouselList () {
      return this.$store.state.homeCarouselList
    },
    language () {
      return $getAxiosLanguage()
    }
  },
  methods: {
    hideBanner () {
      this.isFirstLogin = 0
    },
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
    getMe () {
      this.$store.dispatch('axios_me')
    },
    init () {
      if (this.isFirstLogin) {
        this.getBanner()
      }
      if (this.$store.state.userToken) {
        this.getMe()
      }
      if (this.$route.query.shareId) {
        this.$store.commit('shareId_setter', this.$route.query.shareId)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .banner {
    width 100vw
    height 100vh
    @extend .flex-vertical-center
    .bg {
      position fixed
      width 100vw
      height 100vh
      background rgba(0, 0, 0, 0.7)
      z-index 100
    }
    .bannerContent {
      width 60vw
      height 60vh
      z-index 101
      margin-top -10vh
      .img {
        width 60vw
        height 60vh
        img {
          width 100%
          height 100%
          object-position 0 0
          object-fit fill
        }
      }
    }
    .button {
      width 36vw
      height 5.5vh
      margin-top 5vh
      z-index 101
      background: #FFFFFF;
      border: 1px solid rgba(0,0,0,0.10);
      box-shadow: 0 5px 5px 0 rgba(0,0,0,0.03);
      border-radius: 2px;
      @extend .flex-center
      &:active, &:focus, &:hover {
        transition .2s button
      }
    }
  }
</style>

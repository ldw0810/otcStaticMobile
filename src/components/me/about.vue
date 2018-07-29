<template lang="pug">
  .about
    mt-header(:title="$t('public.about')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="item.name" @click.native.prevent="goLink(index)" v-for="(item, index) in urlList" :key="index" is-link)
      .link
        .telegram
        .twitter
        .facebook
    .footer {{$t('public.copyright')}}
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'
import {$getAxiosLanguage} from '../../utils'

const configure = require('../../../configure')

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'about',
  data () {
    return {
      domain: `${configure.ZENDESK_DOMAIN_URL}/hc/${$getAxiosLanguage()}`
    }
  },
  computed: {
    urlList () {
      return [
        {
          name: this.$t('public.about_us'),
          url: `${this.domain}/articles/360001934074`
        },
        {
          name: this.$t('public.explain'),
          url: `${this.domain}/articles/360001929453`
        },
        {
          name: this.$t('public.helpCenter'),
          url: `${this.domain}/categories/360000187674`
        }
      ]
    }
  },
  methods: {
    goLink (index) {
      if (this.urlList[index].url) {
        if (this.$store.state.userToken) {
          this.$store.dispatch('axios_zendesk').then(res => {
            if (res.data && +res.data.error === 0) {
              const returnUrl = encodeURI(this.urlList[index].url)
              window.location.href = `${configure.ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${returnUrl}`
            } else {
              window.location.href = `${this.domain}/categories/360000187674`
            }
          }).catch(() => {
            window.location.href = `${this.domain}/categories/360000187674`
          })
        } else if (this.urlList[index].url) {
          window.location.href = this.urlList[index].url
        }
      }
    },
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
  .about {
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

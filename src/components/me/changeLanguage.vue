<template lang="pug">
  .changeLanguage
    mt-header(:title="$t('user.user_change_language')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="item.name" @click.native="goLink(index)" v-for="(item, index) in languageList" :key="index" is-link)
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'
import {$getLanguageIndex, $getAxiosLanguage} from '../../utils'
import languageData from '../../locale'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'changeLanguage',
  data () {
    return {
      languageList: languageData
    }
  },
  methods: {
    isCurrentLanguage (index) {
      return +index === $getLanguageIndex()
    },
    goLink (index) {
      const language = this.languageList[+index] && this.languageList[+index].language
      let ln = language
      if (this.$store.state.userToken) {
        if (ln === 'zh-HK') {
          ln = 'zh-TW'
        } else if (ln !== 'zh-CN') {
          ln = 'en'
        }
        this.$store.dispatch('axios_language', {
          ln: $getAxiosLanguage()
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            localStorage.setItem('language', language)
            this.$i18n.set(language)
          } else {
            return false
          }
        }).catch(() => {
          return false
        })
      } else {
        localStorage.setItem('language', language)
        this.$i18n.set(language)
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

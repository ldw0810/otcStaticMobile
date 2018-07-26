<template lang="pug">
  .changeLanguage
    mt-header(:title="$t('user.user_change_language')" fixed)
      router-link(to="/me" slot="left")
        mt-button(icon="back")
    .content
      mt-cell(:title="item.name" @click.native="changeLanguage(index)" v-for="(item, index) in languageList" :key="index" is-link)
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'
import {$getLanguageIndex} from '../../utils'
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
    changeLanguage (index) {
      this.$loading.open()
      const language = this.languageList[+index] && this.languageList[+index].language
      let ln = language
      if (this.$store.state.userToken) {
        if (ln === 'zh-HK') {
          ln = 'zh-TW'
        } else if (ln !== 'zh-CN') {
          ln = 'en'
        }
        this.$store.dispatch('axios_language', {
          ln: ln
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            localStorage.setItem('language', language)
            this.$i18n.set(language)
            this.$loading.close()
          } else {
            this.$loading.close()
            return false
          }
        }).catch(() => {
          this.$loading.close()
          return false
        })
      } else {
        localStorage.setItem('language', language)
        this.$i18n.set(language)
        this.$loading.close()
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
  .changeLanguage {
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

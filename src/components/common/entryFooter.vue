<template lang="pug">
  .footer
    .copyright {{$t('public.copyright')}}
    .menuBar
      .menu(v-for="(item, index) in footerList" @click="goFooter(index)" :key="index") {{item.name}}
      .language(@click="showAction") {{languageList[languageSelectIndex].name}}
    mt-actionsheet(v-model="actionFlag" :actions="actions")
</template>
<script type="es6">
import Vue from 'vue'
import {Actionsheet} from 'mint-ui'
import languageDataList from '../../locale'
import {$getLanguageIndex} from '../../utils'

Vue.component(Actionsheet.name, Actionsheet)

const configure = require('../../../configure')

const domain = `${configure.ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem('language') || 'zh-TW').replace('HK', 'TW').toLowerCase()}`
export default {
  data () {
    return {
      languageList: languageDataList,
      actionFlag: false,
      languageSelectIndex: $getLanguageIndex()
    }
  },
  computed: {
    footerList () {
      return [{
        name: this.$t('public.about'),
        url: `${domain}/articles/360001934074`
      },
      {
        name: this.$t('public.explain'),
        url: `${domain}/articles/360001929453`
      },
      {
        name: this.$t('public.helpCenter'),
        url: `${domain}/categories/360000187674`
      }]
    },
    actions () {
      return languageDataList.map((item, index) => {
        return {
          name: item.name,
          index: index,
          method: this.changeLanguage
        }
      })
    }
  },
  methods: {
    showAction () {
      this.actionFlag = true
    },
    changeLanguage (item) {
      const index = +item.index || 0
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
            this.languageSelectIndex = index
            localStorage.setItem('language', language)
            this.$i18n.set(language)
            this.actionFlag = false
          } else {
            return false
          }
        }).catch(() => {
          return false
        })
      } else {
        localStorage.setItem('language', language)
        this.$i18n.set(language)
        this.languageSelectIndex = index
        this.actionFlag = false
      }
    },
    goFooter (index) {
      if (this.footerList[index].url) {
        if (this.$store.state.userToken) {
          this.$store.dispatch('axios_zendesk').then(res => {
            if (res.data && +res.data.error === 0) {
              const returnUrl = encodeURI(this.footerList[index].url)
              window.location.href = `${configure.ZENDESK_DOMAIN_URL}/access/jwt?jwt=${res.data.token}&return_to=${returnUrl}`
            } else {
              window.location.href = `${domain}/categories/360000187674`
            }
          }).catch(() => {
            window.location.href = `${domain}/categories/360000187674`
          })
        } else if (this.footerList[index].url) {
          window.location.href = this.footerList[index].url
        }
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
  .footer {
    width: 100vw;
    height $footerHeight
    font-family: SFUIDisplay-Regular sans-serif;
    .copyright {
      height: 6vh;
      display: flex;
      width: 100vw;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      opacity: 0.6;
      color: #FFFFFF;
      text-align: center;
    }
    .menuBar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 6vh;
      font-size: 0.9rem;
      color: #FFFFFF;
      .menu {
        cursor: pointer;
      }
      .language {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        .text {
          color: #FFFFFF;
          &:active {
            color: #333;
          }
        }
        .icon {
          color: #FFFFFF;
        }
      }
    }
  }
</style>

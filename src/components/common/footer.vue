<template lang="pug">
  .footer
    .copyright {{$t('public.copyright')}}
    .menuBar
      .menu(v-for="(footerItem, index) in footerList" @click="goFooter(index)" v-text="footerItem.name" :key="index")
      .language(@click="showAction") {{languageList[languageSelectIndex].name}}
    mt-actionsheet(v-model="actionFlag" :actions="actions")
</template>
<script type="es6">
import Vue from 'vue'
import {Actionsheet} from 'mint-ui'
import languageDataList from '../../locale'
Vue.component(Actionsheet.name, Actionsheet)
const configure = require('../../../configure')

const domain = `${configure.ZENDESK_DOMAIN_URL}/hc/${(window.localStorage.getItem('language') || 'zh-TW').replace('HK', 'TW').toLowerCase()}`
export default{
  data () {
    return {
      footerList: [
        {
          name: this.$i18n.translate('public.about', ''),
          url: `${domain}/articles/360001934074`
        },
        {
          name: this.$i18n.translate('public.explain', ''),
          url: `${domain}/articles/360001929453`
        },
        {
          name: this.$i18n.translate('public.helpCenter', ''),
          url: `${domain}/categories/360000187674`
        }
      ],
      languageList: languageDataList,
      actionFlag: false,
      actions: languageDataList.map((item, index) => {
        return {
          name: item.name,
          method: this.changeLanguage
        }
      })
    }
  },
  computed: {
    languageSelectIndex () {
      let index = 0
      for (let i = 0; i < this.languageList.length; i++) {
        if (this.languageList[i].language === (localStorage.getItem('language') || configure.DEFAULT_LANGUAGE)) {
          index = i
        }
      }
      return index
    }
  },
  methods: {
    showAction () {
      this.actionFlag = true
    },
    changeLanguage (actions, index) {
      if (+index !== this.languageSelectIndex) {
        const language = this.languageList[+index] && this.languageList[+index].language
        let ln = language
        if (this.$store.state.userToken) {
          if (['zh-HK', 'zh-TW'].indexOf(ln) > -1) {
            ln = 'zh-TW'
          } else if (ln !== 'zh-CN') {
            ln = 'en'
          }
          this.$store.dispatch('axios_language', {
            ln: ln
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              window.localStorage.setItem('language', language)
              this.$router.go(0)
            } else {
            }
          }).catch(() => {
          })
        } else {
          localStorage.setItem('language', language)
          this.$i18n.set(language)
          this.$router.go(0)
        }
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

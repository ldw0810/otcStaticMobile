<template lang="pug">
  .selectCountry
    mt-header(:title="$t('user.country_select')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper(v-if="countryList.length")
    .content
      mt-cell(:title="item.name" @click.native="goLink(index)" v-for="(item, index) in countryList" :key="index" is-link)
        span(slot="title" class="title") {{item[0]}}
        span {{item[2]}}
</template>
<script type="es6">
import {Header, Button, Cell} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'selectCountry',
  data () {
    return {
    }
  },
  computed: {
    countryList () {
      return this.$store.state.countryList || []
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    goLink (index) {
      if (this.countryList[index]) {
        this.$emit('success', this.countryList[index])
        this.goBack()
      }
    },
    getCountryList () {
      if (!this.countryList.length) {
        this.$loading.open()
        this.$store.dispatch('axios_national_list').then(res => {
          if (res && +res.data.error === 0) {
            this.$store.commit('countryList_setter', res.data.country)
          }
        }).catch(() => {
          this.$message.error(this.$t('user.country_response_none'))
        })
      }
    },
    init () {
      this.getCountryList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .selectCountry {
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

<template lang="pug">
  .selectBank
    mt-header(:title="$t('user.bankCard_bank_select')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper(v-if="bankList.length")
    .content
      mt-cell(:title="item.name" @click.native="goLink(index)" v-for="(item, index) in bankList" :key="index" is-link)
        span(slot="title" class="title") {{item.name}}
</template>
<script type="es6">
import {Button, Cell, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'selectBank',
  data () {
    return {}
  },
  computed: {
    bankList () {
      return this.$store.state.bankList || []
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    goLink (index) {
      if (this.bankList[index]) {
        this.$emit('success', this.bankList[index])
        this.goBack()
      }
    },
    getBankList () {
      if (!this.bankList.length) {
        this.$loading.open()
        this.$store.dispatch('axios_banks').then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit('bankList_setter', res.data.list)
          }
        }).catch(() => {
          this.$message.error(this.$t('user.banks_request_fail'))
        })
      }
    },
    init () {
      this.getBankList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .selectBank {
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

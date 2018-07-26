<template lang="pug">
  .addAlipay
    mt-header(:title="$t('user.default_receivables')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .content
      mt-cell-swipe(v-for="(item, index) in collectionList" :key="index" :right="getCellSwipeRight(index)")
        .icon
          img(src="../../assets/images/trade/C-Alipay.png" v-if="!item.bank")
          img(src="../../assets/images/trade/C-Card.png" v-else-if="item.bank")
        .info
          .username {{item.name}}
          .account {{(item.bank ? (item.bank_name + '&nbsp;') : '') + item.account}}
        .radio
    .submit(class="mintSubmit")
      mt-button(@click="submit") {{$t('user.add_receivables')}}
</template>
<script type="es6">
import {Button, CellSwipe, Field, Header, MessageBox} from 'mint-ui'
import Vue from 'vue'
import _findIndex from 'lodash/findIndex'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)
Vue.component(CellSwipe.name, CellSwipe)
Vue.component(MessageBox.name, MessageBox)

export default {
  name: 'collectionList',
  data () {
    return {
      defaultCollectionIndex: -1
    }
  },
  computed: {
    collectionList () {
      return this.$store.state.collectionList || []
    }
  },
  methods: {
    getCellSwipeRight (index) {
      return [{
        content: this.$i18n.translate('public.delete'),
        style: {background: 'red', color: '#fff'},
        handler: () => {
          MessageBox.confirm(this.$i18n.translate('public.confirm_delete')).then(() => {
            this.delCollection(index)
          })
        }
      }]
    },
    delCollection (index) {
      this.$store.dispatch('axios_del_receiving', {
        id: this.collectionList[index].id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$message.success(this.$i18n.translate('user.receivables_del_success'))
          let list = this.collectionList
          list.splice(index, 1)
          this.$store.commit('collectionList_setter', list)
        }
      }).catch(() => {
        this.$message.error(this.$i18n.translate('user.receivables_del_fail'))
      })
    },
    setDefaultCollection (index) {
      this.$store.dispatch('axios_default_receiving', {
        id: this.collectionList[index].id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          let list = this.collectionList
          for (let i = 0; i < list.length; i++) {
            if (+index === i) {
              list[i].is_default = 1
            } else {
              list[i].is_default = 0
            }
          }
          this.$store.commit('collectionList_setter', list)
        }
      }).catch(() => {
        this.$message.error(this.$i18n.translate('user.receivables_set_default_fail'))
      })
    },
    getDefaultCollectionIndex (arr) {
      this.defaultCollectionIndex = _findIndex(arr, item => {
        return +item.is_default === 1
      })
    },
    getCollectionList () {
      this.$store.dispatch('axios_get_receiving').then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('collectionList_setter', res.data.list || [])
        }
      }).catch(() => {
        this.$message.error(this.$i18n.translate('user.receivables_request_fail'))
      })
    },
    submit () {
      this.$router.push({
        path: '/me/addCollection',
        query: {
          isFromCollectionList: 1
        }
      })
    },
    init () {
      this.getCollectionList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .addAlipay {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
  }

  .content {
    margin-top $mintHeaderHeight + 1
  }

  .submit {
    margin-top 2.5vh
  }
</style>

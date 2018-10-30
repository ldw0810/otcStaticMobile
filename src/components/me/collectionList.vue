<template lang="pug">
  .collectionList
    mt-header(:title="$t('user.default_receivables')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .wrapper
      .content
        mt-cell-swipe(v-for="(item, index) in collectionList" class="cell" :key="index" :right="getCellSwipeRight(index)")
          span(slot="title" class="title")
            .icon
              img(src="../../assets/images/trade/C-Alipay.png" v-if="!item.bank")
              img(src="../../assets/images/trade/C-Card.png" v-else-if="item.bank")
            .info
              .username {{item.name}}
              .account {{(item.bank ? (item.bank_name + '&nbsp;') : '') + item.account}}
          .radio(class="radio" :class="{'radioChecked': defaultCollectionIndex === index}" @click="setDefaultCollection(index)")
      .footer(class="mintSubmit")
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
  watch: {
    collectionList (val) {
      if (val.length === 0) {
        this.$router.push({
          path: '/me/addCollection'
        })
      }
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
        content: this.$t('public.delete'),
        style: {background: 'red', color: '#fff'},
        handler: () => {
          MessageBox.confirm(this.$t('public.confirm_delete')).then(() => {
            this.delCollection(index)
          })
        }
      }]
    },
    delCollection (index) {
      this.$loading.open()
      this.$store.dispatch('axios_del_receiving', {
        id: this.collectionList[index].id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$message.success(this.$t('user.receivables_del_success'))
          let list = this.collectionList
          list.splice(index, 1)
          this.getDefaultCollectionIndex()
          this.$store.commit('collectionList_setter', list)
          if (list.length === 1) {
            this.setDefaultCollection(0)
          }
        }
      }).catch(() => {
        // this.$message.error(this.$t('user.receivables_del_fail'))
      })
    },
    setDefaultCollection (index) {
      if (this.defaultCollectionIndex !== index) {
        const oldIndex = this.defaultCollectionIndex
        this.defaultCollectionIndex = index
        this.$loading.open()
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
          } else {
            this.defaultCollectionIndex = oldIndex
          }
        }).catch(() => {
          this.defaultCollectionIndex = oldIndex
          // this.$message.error(this.$t('user.receivables_set_default_fail'))
        })
      }
    },
    getDefaultCollectionIndex () {
      this.defaultCollectionIndex = _findIndex(this.collectionList, item => {
        return +item.is_default === 1
      })
    },
    getCollectionList () {
      this.$store.dispatch('axios_get_receiving').then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('collectionList_setter', res.data.list || [])
          if (res.data.list && res.data.list.length) {
            this.getDefaultCollectionIndex()
            if (+res.data.list.length === 1) {
              this.setDefaultCollection(0)
            }
          }
        }
      }).catch(() => {
        // this.$message.error(this.$t('user.receivables_request_fail'))
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
  footerHeight = 12vh
  .collectionList {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
  }

  .content {
    margin-top $mintHeaderHeight + 1
    height 100 - footerHeight - @margin-top
  }

  .cell {
    height 9vh
    margin-top 1vh
    background: #FFFFFF;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
    .title {
      height 9vh
      display flex
      align-items center
      .icon {
        height 6vh
        width 6vh
        margin-left 2.5vw
        img {
          object-fit: cover;
          object-position: 0 0;
          width: 100%;
          height: 100%;
        }
      }
      .info {
        height 8vh
        margin-left 4vw
        display flex
        flex-direction column
        align-items flex-start
        .username {
          display flex
          align-items center
          flex 1
          font-size 0.85rem
          font-weight normal
        }
        .account {
          display flex
          align-items center
          flex 1
          font-size 0.85rem
        }
      }
    }
  }
  .radio {
    box-sizing: border-box;
    display: inline-block;
    background-color: #fff;
    border-radius: 100%;
    border: 1px solid #ccc;
    position: relative;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    &:after {
      content: " ";
      border-radius: 100%;
      top: 5px;
      left: 5px;
      position: absolute;
      width: 8px;
      height: 8px;
      -webkit-transition: -webkit-transform .2s;
      transition: -webkit-transform .2s;
      transition: transform .2s;
      -webkit-transform: scale(0);
      transform: scale(0);
    }
  }
  .radioChecked {
    background-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
    border-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
    &:after {
      background-color: #fff;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  .footer {
    height footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }
</style>

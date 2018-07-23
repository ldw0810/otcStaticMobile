<template lang="pug">
  .adList
    mt-loadmore(:top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore")
    .itemList(v-if="ads.list.length")
      .item(v-for="(item, index) in ads.list" :key="index")
        .notice
        .wrapper
          .content
            Avatar(class="avatar")
            .info
              .name
              .id
              .time
              .number
              .money
            el-button(class="operation" :class="{'sell': adType === 1}" type='primary' @click="submit")
          .state
    EmptyList(:text='emptyMessage' v-else)
</template>
<script type="es6">
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import {Loadmore} from 'mint-ui'
import {Button} from 'element-ui'
import Vue from 'vue'

Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
export default {
  name: 'order',
  components: {
    Avatar,
    EmptyList
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>

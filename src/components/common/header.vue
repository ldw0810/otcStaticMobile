<template lang="pug">
  .headerSlot
    router-link(:to="leftLink" slot="left")
      mt-button(icon="back") {{leftText}}
    mt-button(slot="right" @click="$emit('rightClick', 1)") {{rightText}}
</template>
<script type="es6">
import {Button, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Button.name, Button)
Vue.component(Header.name, Header)

export default {
  name: 'header',
  props: {
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    leftLink: ''
  },
  extends: Header
}
</script>
<style lang="stylus" scoped>

</style>

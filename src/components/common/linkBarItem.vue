<template lang="pug">
  .mint-tab-item(@click="$parent.$emit('input', id)" :class="{ 'is-selected': $parent.value === id }")
    router-link(:to="route" class="link")
      .mint-tab-item-icon
        slot(name="icon")
      .mint-tab-item-label
        slot
</template>

<script type="es6">
import {TabItem} from 'mint-ui'

/**
   * mt-tab-item
   * @module components/tab-item
   * @desc 搭配 tabbar 或 navbar 使用
   * @param {*} id - 选中后的返回值，任意类型
   * @param {slot} [icon] - icon 图标
   * @param {slot} - 文字
   *
   * @example
   * <mt-tab-item>
   *   <img slot="icon" src="http://placehold.it/100x100">
   *   订单
   * </mt-tab-item>
   */
export default {
  name: 'linkBarItem',
  extends: TabItem,
  props: ['id', 'route']
}
</script>
<style lang="stylus" scoped>
  .link {
    width 100%
    height 100%
  }

  .mint-tab-item-label {
    display flex
    align-items center
    justify-content center
    color #000000;
    font-size 0.8rem
  }
</style>

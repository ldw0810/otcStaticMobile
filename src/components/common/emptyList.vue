<template lang="pug">
  .empty
    .textShow(v-if="!loading")
      .asset
        img(src="../../assets/images/icon/advertisement-ccc.svg" width="55" height="48" v-if='iconType === 1')
        img(src="../../assets/images/icon/order-ccc.svg" width="55" height="55" v-if='iconType === 2')
      p(class='text') {{text}}
    .loadingShow(v-else)
</template>
<script type="es6">
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '您没有未完成的订单'
    },
    iconType: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="stylus" scoped>
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    .textShow,.loadingShow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .loadingShow{
    }
    .asset {
      margin-bottom: 2.5vh;
    }
    .text {
      font-size: 1rem;
      color: #666666;
    }
  }
</style>

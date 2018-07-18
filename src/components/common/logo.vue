<template lang="pug">
  .logo
    .btn(@click="goHome")
      img(src="../../assets/images/public/logo.svg")
</template>
<script type="es6">
export default {
  data () {
    return {}
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
<style lang='stylus' scoped>
  .logo {
    width 100vw;
    height $headerHeight
    background: rgba(0, 0, 0, 0.05);
    z-index: 99;
    display: flex;
    align-items: center;
    .btn {
      height: 6.38vw;
      width: 42vw;
      margin-left: 11vw;
      img {
        object-fit: cover;
        object-position: 0 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

<template lang="pug">
  .container
    transition(name="fade" mode="out-in")
      router-view
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="stylus" scoped>
  .container {
    .alert {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>

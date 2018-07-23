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
</style>

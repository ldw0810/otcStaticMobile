<template lang="pug">
  .page
    LogoDiv
    <!--.bg(v-if="!ucFlag")-->
    <!--.bgUC(v-else)-->
    .content
      transition(name="fade" mode="out-in")
        router-view
    EntryFooter
</template>

<script type="es6">
import LogoDiv from '../common/logo'
import EntryFooter from '../common/entryFooter'

export default {
  components: {
    LogoDiv,
    EntryFooter
  },
  data () {
    return {
      ucFlag: false
    }
  },
  created () {
    let UA = navigator.appVersion
    this.ucFlag = UA.split('UCBrowser/').length > 1
  },
  mounted () {
    if (this.$route.query.shareId) {
      this.$store.commit('shareId_setter', this.$route.query.shareId)
    }
  }
}
</script>
<style lang='stylus' scoped>
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-image: linear-gradient(45deg, #0BBFD5 0%, #6DD788 100%);
    background-size: cover;
    .bg {
      background-image: linear-gradient(45deg, #0BBFD5 0%, #6DD788 100%);
      background-size: cover;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: 100%;
      width: 100%;
    }
    .bgUC {
      background: #6DD788;
      background-size: cover;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: 100%;
      width: 100%;
    }
    .content {
      width: 100vw;
      min-height: 100 - $headerHeight - $footerHeight;
    }
  }
</style>

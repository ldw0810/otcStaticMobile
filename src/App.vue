<template lang="pug">
  .container
    transition(name="fade" mode="out-in")
      router-view
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route: function (val) {
      this.init()
    }
  },
  methods: {
    init () {
      if (this.$route.query) {
        console.log(this.$route.query)
        if (this.$route.query.withdraw_token) {
          this.$store.dispatch('axios_withdraw_confirm', {
            code: this.$route.query.withdraw_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('asset.asset_withdraw_confirm_success'))
            }
          }).catch(() => {
            this.$message.error(this.$t('asset.asset_withdraw_confirm_fail'))
          })
        } else if (this.$route.query.activation_token) {
          this.$store.dispatch('axios_email_verified', {
            token: this.$route.query.activation_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('public.email_activation_success'))
            }
          }).catch(() => {
            this.$message.error(this.$t('public.activation_link_notValid'))
          })
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="stylus" scoped>
</style>

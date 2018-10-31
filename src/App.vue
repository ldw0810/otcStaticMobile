<template lang="pug">
  .container
    transition(name="fade" mode="out-in")
      router-view
</template>

<script type="es6">
export default {
  name: 'App',
  watch: {
    $route: function (val) {
      this.init()
    }
  },
  methods: {
    replaceUrl (name, query, delParams, onComplete, onAbort) {
      let index = 0
      let url = name
      if (query) {
        for (let key in query) {
          if (key && key !== delParams && (query['' + key] || query['' + key] === 0)) {
            url += index === 0 ? '?' : '&'
            url += key + '=' + query['' + key]
            index++
          }
        }
      }
      return this.$router.replace(url, onComplete, onAbort)
    },
    init () {
      if (this.$route.query) {
        if (this.$route.query.withdraw_token) {
          this.$store.dispatch('axios_withdraw_confirm', {
            code: this.$route.query.withdraw_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('asset.asset_withdraw_confirm_success'))
            }
          }).catch(() => {
            // this.$message.error(this.$t('asset.asset_withdraw_confirm_fail'))
          }).finally(() => {
            this.replaceUrl(this.$route.path, this.$route.query, 'withdraw_token')
            this.$nextTick(() => {
              this.$loading.close()
            })
          })
        } else if (this.$route.query.activation_token) {
          this.$store.dispatch('axios_email_verified', {
            token: this.$route.query.activation_token
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('public.email_activation_success'))
            }
          }).catch(() => {
            // this.$message.error(this.$t('public.activation_link_notValid'))
          }).finally(() => {
            this.replaceUrl(this.$route.path, this.$route.query, 'activation_token')
            this.$nextTick(() => {
              this.$loading.close()
            })
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

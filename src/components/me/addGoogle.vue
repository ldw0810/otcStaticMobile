<template lang="pug">
  .addGoogle
    mt-header(:title="$t('user.auth_google_add')" fixed)
      router-link(to="/me/settings" slot="left")
        mt-button(icon="back")
    .content
      .step_1
        .text {{$t('user.add_auth_google_step1') + ': ' + $t('user.add_auth_google_download')}}
        .imgDiv
          .img(@click="goLink")
            img(src="../../assets/images/me/AppStore.png")
      .step_2
        .text {{$t('user.add_auth_google_step2') + ': ' + $t('user.add_auth_google_saveKey')}}
        .key(id="googleKey" v-clipboard:copy="googleKey" v-clipboard:success="copySuccess") {{googleKey}}
        .key_tip {{$t('user.add_auth_google_keyInfo')}}
    .footer(class="mintSubmit")
      mt-button(@click="submit") {{$t('user.add_auth_google_commit')}}
</template>
<script type="es6">
import {Button, Cell, Header} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)

export default {
  name: 'addGoogle',
  data () {
    return {}
  },
  computed: {
    googleKey () {
      return this.$store.state.googleKey
    }
  },
  methods: {
    goLink () {
      window.open('https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8')
    },
    copySuccess () {
      this.$message.success(this.$t('public.invite_copy_success'))
    },
    submit () {
      this.$router.push('/me/authGoogle')
    },
    getGoogleKey () {
      this.$store.dispatch('axios_google_auth', {
        refresh: 1
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$store.commit('googleKey_setter', res.data.otp_secret)
          this.$store.commit('googleCode_setter', res.data.uri)
        } else if (res.data && +res.data.error === 100011) {
          this.$router.push('/me/settings')
        }
      }).catch(() => {
        // this.$message.error(this.$t('user.auth_google_request_fail'))
      })
    },
    init () {
      this.getGoogleKey()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  .addGoogle {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    display flex
    flex-direction column
  }

  .content {
    flex 1
    margin-top $mintHeaderHeight + 1
  }

  .step_1 {
    margin-top 1vh
    background #FFFFFF
    display flex
    flex-direction column
    justify-content center
    .text {
      color #333333
      font-size 1rem
      font-weight normal
      padding-top 4vh
      display flex
      justify-content center
    }
    .imgDiv {
      display flex
      justify-content center
      padding-top 4vh
      padding-bottom 4vh
      .img {
        width 60vw
        img {
          object-fit: cover;
          object-position: 0 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .step_2 {
    margin-top 1vh
    background #FFFFFF
    .text {
      color #333333
      font-size 1rem
      font-weight normal
      padding-top 4vh
      display flex
      justify-content center
    }
    .key {
      color #333333
      font-size 1.2rem
      font-weight normal
      padding-top 4vh
      display flex
      justify-content center
      cursor pointer
    }
    .key_tip {
      font-size 0.9rem
      color #666666
      padding 4vh $mintContentPaddingWidth
      display flex
      justify-content center
    }
  }

  .footer {
    height $footerHeight
    display flex
    align-items center
    justify-content center
    font-size 0.8rem
    color #999999
  }
</style>

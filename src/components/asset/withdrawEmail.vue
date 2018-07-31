<template lang="pug">
  .withdrawEmail
    mt-header(:title="$t('user.auth_email')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper(v-if="userInfo.id")
      .content
        .icon
          img(src="../../assets/images/icon/Email-999999.svg")
        .text {{$t('user.authentication_email_beenSend')}}
        .email {{userInfo.email}}
        .info {{$t('asset.asset_withdraw_email')}}
      .submit
        mt-button(class="formButton" @click="goBack") {{$t('public.confirm')}}
        SendCode(ref="sendCode" class="submitButton" :text="$t('user.authentication_email_reSend_link')" :reText="$t('user.authentication_email_reSend_link')" :time="remainTime" :maxTime="maxTime" :once="!+remainTime" @sendCode="sendEmail")
</template>
<script type="es6">
import SendCode from '../common/sendCode'
import {Header, Button} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

export default {
  name: 'withdrawEmail',
  components: {
    SendCode
  },
  props: {
    withdraw_id: {
      type: String | Number,
      default: 0
    },
    currency: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      remainTime: 120,
      maxTime: 120
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    sendEmail () {
      return new Promise((resolve, reject) => {
        this.$loading.open()
        this.$store.dispatch('axios_resend_confirm', {
          id: this.withdraw_id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$message.success(this.$t('asset.asset_withdraw_email_success'))
            this.remainTime = +res.data.remain || 120
          }
        }).catch(() => {
          this.$message.error(this.$t('asset.asset_withdraw_email_fail'))
        })
      })
    },
    getMe () {
      if (!this.userInfo.id) {
        this.$store.dispatch('axios_me')
      } else {
        this.$loading.close()
      }
    },
    init () {
      this.sendEmail().then(() => {
        this.$refs.sendCode.init()
      })
      this.getMe()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .withdrawEmail {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      height 100 - $mintHeaderHeight - buttonHeight
      margin-top $mintHeaderHeight
      display flex
      flex-direction column
      align-items center
      justify-content center
      div {
        margin-bottom 2.5vh
        font-size 1rem
      }
      .icon {
        width 8vh
        height 6vh
        img {
          object-fit: cover;
          object-position: 0 0;
          width: 100%;
          height: 100%;
        }
      }
      .email {
        font-weight normal
      }
    }
    .submit {
      display flex
      align-items flex-start
      justify-content center
      height buttonHeight
      .formButton {
        margin-bottom 2.5vh
      }
      .submitButton {
        height 5vh
        background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
        box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
      }
    }
  }
</style>

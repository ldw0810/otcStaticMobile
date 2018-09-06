<template lang="pug">
  .orderReleaseConfirm(v-if="order.id")
    mt-header(:title="$t('order.order_confirm_release')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .info
          .labelList
            .label {{$t("order.order_id")}}:
            .label {{$t("order.order_money_amount")}}:
          .textList
            .text {{order.id}}
            .text {{order.price_sum | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
        .formDiv
          mt-field(type="password" :label="$t('user.password')" :placeholder="$t('user.password_login')" v-model="form.password" :state="formState.password" @input="checkState('password')")
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success" :disabled="!formStateAll") {{$t('order.order_pay_release')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Header, Button} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

export default {
  name: 'orderReleaseConfirm',
  props: {
    order: {}
  },
  data () {
    return {
      form: {
        password: ''
      },
      formState: {
        password: ''
      },
      formMessage: {
        password: ''
      }
    }
  },
  computed: {
    formStateAll () {
      const tempStateList = Object.keys(this.formState)
      for (let i = 0; i < tempStateList.length; i++) {
        if (this.formState[tempStateList[i]] === '') {
          return false
        }
      }
      return true
    },
    formMessageAll () {
      const tempMessageList = Object.keys(this.formMessage)
      for (let i = 0; i < tempMessageList.length; i++) {
        if (this.formMessage[tempMessageList[i]] !== '') {
          return this.formMessage[tempMessageList[i]]
        }
      }
      return ''
    }
  },
  methods: {
    checkAllState () {
      Object.keys(this.formState).forEach((item) => {
        this.checkState(item)
      })
    },
    checkState (value) {
      if (value === 'password') {
        this.formState.password = this.form.password ? 'success' : ''
      }
    },
    goBack () {
      this.$emit('close', 1)
    },
    success () {
      this.$emit('close', 1)
      this.$emit('success', this.form.password)
    },
    init () {
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .orderReleaseConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      margin-top $mintHeaderHeight + 1
      background #FFFFFF
      display flex
      padding 5vh 0
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .info {
        display flex
        padding 0 6vw
        .labelList {
          .label {
            font-size 1rem
            font-weight normal
            color #333333
            margin 0 5vw 2.5vh 0
          }
        }
        .textList {
          flex 1
          .text {
            font-size 1rem
            font-weight normal
            color #333333
            margin-bottom 2.5vh
          }
        }
      }
      .tip {
        margin-top 2.5vh
        .text {
          font-weight normal
          font-size 0.85rem
          color #ED1C24
        }
      }
    }
    .submit {
      display flex
      flex-direction column
      align-items center
      justify-content center
      height buttonHeight
      margin-top 5vh
      .submitBtn {
        margin-bottom 2.5vh
      }
    }
  }
</style>

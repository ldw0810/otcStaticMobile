<template lang="pug">
  .withdrawConfirm
    mt-header(:title="$t('asset.asset_withdraw_confirm')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .text {{$t("asset.asset_withdraw_address")}}
        .address {{address}}
        .text {{$t("asset.asset_withdraw_number")}}
        .numberDiv
          .number {{form.number + ' ' + currency.toUpperCase()}}
          .tip {{'(' + $t('asset.asset_miners_fee') + currencyFee + ' ' + currency.toUpperCase() + ')'}}
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success") {{$t('public.confirm')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Header, Button} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

export default {
  name: 'withdrawConfirm',
  props: {
    currency: '',
    currencyFee: '',
    form: {
      selectAddress: {},
      label: '',
      address: '',
      number: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    address () {
      if (this.form.address) {
        return this.form.address
      } else {
        return this.form.selectAddress.uid
      }
    }
  },
  methods: {
    goBack () {
      this.$emit('close', 1)
    },
    success () {
      this.$emit('close', 1)
      this.$emit('success', 1)
    },
    init () {
    }
  },
  mounted () {
    console.log(this.form)
    this.init()
  }
}
</script>
<style lang='stylus' scoped>
  buttonHeight = 15vh
  .withdrawConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      margin-top $mintHeaderHeight
      display flex
      flex-direction column
      padding 2.5vh 6vw
      .text {
        color #666666
        font-size 1rem
        font-weight normal
      }
      .address {
        margin 1.5vh 0 2.5vh
        font-size 1.2rem
        color: #2EA2F8;
        word-break break-all
      }
      .numberDiv {
        margin 1.5vh 0
        display flex
        align-items center
        .number {
          font-size 1.2rem
          color: #2EA2F8;
        }
        .tip {
          margin 0 2.5vw
          font-size 1rem
          color: #2EA2F8;
        }
      }
    }
    .submit {
      display flex
      flex-direction column
      align-items center
      justify-content center
      height buttonHeight
      .submitBtn {
        margin-bottom 2.5vh
      }
    }
  }
</style>

<template lang="pug">
  .orderPayConfirm
    mt-header(:title="$t('order.order_confirm_pay_title')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="goBack")
    .wrapper
      .content
        .tip {{$t("order.order_confirm_pay_remark_tip")}}
        mt-field(class="remark" type="textarea" :placeholder="$t('order.order_confirm_pay_remark')" v-model="form.remark" :state="formState.remark" @input="checkState('remark')")
        .warn {{$t("order.order_confirm_pay_warn")}}
      .submit
        .mintSubmit
          mt-button(class="submitBtn" @click="success" :disabled="!formStateAll") {{$t('order.order_confirm_payed')}}
        .mintCancel
          mt-button(class="cancelBtn" @click="goBack") {{$t('public.cancel')}}
</template>
<script type="es6">
import {Header, Button, Field} from 'mint-ui'
import Vue from 'vue'

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)

export default {
  name: 'orderPayConfirm',
  data () {
    return {
      form: {
        remark: ''
      },
      formState: {
        remark: ''
      },
      formMessage: {
        remark: ''
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
      if (value === 'remark') {
        this.formState.remark = this.form.remark.trim() ? 'success' : ''
      }
    },
    goBack () {
      this.$emit('close', 1)
    },
    success () {
      this.$emit('close', 1)
      this.$emit('success', this.form.remark)
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
  .orderPayConfirm {
    width 100vw
    height 100vh
    background #fafafa
    overflow hidden
    .content {
      width 100vw
      margin-top $mintHeaderHeight + 1
      background #FFFFFF
      display flex
      padding 5vh 6vw
      flex-direction column
      border-top 1px solid #EEEEEE
      border-bottom 1px solid #EEEEEE
      .tip {
        font-weight normal
        font-size 0.85rem
        color #333333
      }
      .remark {
        margin 2.5vh 0
        border 1px solid #EEEEEE
      }
      .warn {
        margin-top 2.5vh
        font-weight normal
        font-size 0.85rem
        color #ED1C24
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

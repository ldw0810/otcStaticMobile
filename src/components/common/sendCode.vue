<!--手机发送验证码按钮-->
<template>
  <div class='send'>
    <a @click="send" class='btn primary' v-if="subOnce">{{text || $t('user.auth_phone_code_send')}}</a>
    <a disabled class='btn disabled' v-else-if="subTime > 0">{{$t('user.auth_phone_code_reSend_seconds', {'0': subTime})}}</a>
    <a @click="send" class='btn primary' v-else>{{reText || $t('user.auth_phone_code_reSend')}}</a>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    reText: {
      type: String,
      default: ''
    },
    time: {
      type: Number,
      default: 60
    },
    maxTime: {
      type: Number,
      default: 60
    },
    once: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      subTime: this.time,
      subOnce: this.once,
      timer: 0
    }
  },
  watch: {
    time (val) {
      this.subTime = val
    },
    once (val) {
      this.subOnce = val
    }
  },
  methods: {
    send () {
      this.subOnce && (this.subOnce = false)
      this.$emit('sendCode', 1)
      this.subTime = this.maxTime + 1
      this.countDown()
    },
    countDown () {
      if (this.subTime) {
        this.subTime--
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(this.countDown, 1000)
      }
    },
    refresh () {
      this.subOnce = true
    },
    clear () {
      this.timer && clearTimeout(this.timer)
      this.subTime = this.time
    },
    init () {
      if (this.subTime && !this.subOnce) {
        this.clear()
        this.countDown()
      }
    }
  },
  destroyed () {
    this.clear()
  }
}
</script>
<style lang="stylus" scoped>
  .send {
    .btn {
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    }
    .primary {
      color: #FFFFFF;
    }
    .disabled {
      color: #999;
    }
  }
</style>

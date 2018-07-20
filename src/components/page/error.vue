<template lang="pug">
  .notFound
    .content
      .message
        .text {{$t('public.server_maintenance')}}
        .btn(@click="$router.push('/')") {{$t('public.return_home')}}
</template>
<script type="es6">
import {$title} from '../../utils'

export default {
  name: 'error',
  created () {
    $title(this.$t('public.server_maintenance'))
  }
}
</script>
<style lang='stylus' scoped>
  .content {
    height 100vh
    background: url("../../assets/images/public/Img-502.svg") no-repeat center;
    background-size: cover;
  }

  .message {
    .text {
      position absolute
      top 45vh
      left 0
      width 100vw
      font-size 1.6rem
      color: #ffffff;
      text-align: center;
    }
    .btn {
      cursor pointer
      position absolute
      top 80vh
      left 0
      width 60vw
      height 10vw
      margin 0 20vw
      font-size 1rem
      background #FFFFFF
      border 1px solid rgba(0,0,0,0.10)
      box-shadow 0 5px 5px 0 rgba(0,0,0,0.03)
      border-radius 2vw
      line-height 10vw
      color #333333
      text-align center
      font-weight normal
      &:active, &:focus, &:hover {
        color #999
        background-color #999999
        border-color #999999
      }
    }
  }
</style>

<template lang="pug">
  .avatar
    .status(v-if='isStatus' :class="{'online': status, 'offline': !status}")
    .icon(:style="{width: size + 'vh', height: size + 'vh'}")
</template>
<script type="es6">
export default {
  props: {
    size: {
      type: Number,
      default: 5
    },
    isStatus: {
      type: Boolean,
      default: true
    },
    status: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  $avatarImage = "../../assets/images/trade/DefaultHead.jpg";
  .avatar {
    display flex
    align-items center
  }

  .status {
    border-radius: 50%;
    width: 1.5vh;
    height: 1.5vh;
    border: 1px solid #fff;
    margin-right 1vw
  }

  .online {
    background-image: linear-gradient(to bottom, #b5eb45, #7ed321);
  }

  .offline {
    background-image: linear-gradient(0deg, #D2D2D2 0%, #AEAEAE 100%);
  }

  .icon {
    flex-shrink: 0;
    position: relative;
    width: 50px;
    height: 50px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: url($avatarImage) no-repeat center;
    background-size: cover;
  }
</style>

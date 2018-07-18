<template lang="pug">
  .forgetPassword
    .content
      .title(v-text="$t('user.password_forget')")
      .form
        el-form(status-icon ref="form" :model="form" :rules="rules" @submit.native.prevent="submit")
          el-form-item(prop="email" class="formItem" :show-message="false")
            el-input(class="input" v-model="form.email" :placeholder="$t('user.email_required')")
              span(slot="prepend")
                img(src="../../assets/images/icon/Email-FFFFFF.svg")
          el-form-item(class="formItem submit")
            el-button(class="submitButton" type='primary' :loading='submitLoading' @click="submit") {{$t('user.auth_email_send')}}
      .goDiv
        .goButton(v-text="$t('user.back_login')" @click="$router.push('/user/login')")
        .empty
    #captcha
</template>
<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Watch} from 'vue-property-decorator';

  @Component
  export default class login_forgetPassword extends Vue {
    submitLoading: boolean = false;
    form: Globe.forgetPasswordForm = {
      email: '',
    };
    rules: Globe.rules = {
      email: [
        {
          required: true,
          message: this.$i18n.translate('user.email_required', ''),
          trigger: 'blur'
        }
      ],
    };
    captchaObj: string = '';
    // const validateEmail = (rule, value, callback) => {
    //   if (!value || !value.length) {
    //     callback(new Error(this.$t('user.email_required')))
    //   } else if (
    //     !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(
    //       value
    //     )
    //   ) {
    //     callback(new Error(this.$t('user.email_notValid')))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePinCode = (rule, value, callback) => {
    //   if (!value || !value.length) {
    //     callback(new Error(this.$t('user.pinCode_required')))
    //   } else if (
    //     value.toUpperCase() !== this.$store.state.pinCodeValue.toUpperCase()
    //   ) {
    //     callback(new Error(this.$t('user.pinCode_different')))
    //   } else {
    //     callback()
    //   }
    // }
    @Watch('$route')
    changeRoute() {
      this.init();
    }

    mounted() {
      this.init()
    }

    submit() {
      console.log("submit")
      // this.$refs['form'].validate(valid => {
      //   if (valid) {
      //     this.captchaObj.verify()
      //   }
      // })
    }

    init() {
      // this.$store
      //   .dispatch('axios_captcha_server')
      //   .then(res => {
      //     if (res.data && +res.data.error === 0) {
      //       window.initGeetest(
      //         {
      //           gt: res.data.gt,
      //           challenge: res.data.challenge,
      //           offline: false,
      //           new_captcha: res.data.new_captcha,
      //
      //           product: 'bind',
      //           width: '292px',
      //           lang: window.localStorage.getItem('language') === 'zh-CN' ? 'zh-cn' : 'en'
      //         },
      //         captchaObj => {
      //           captchaObj.appendTo(document.getElementById('captcha'))
      //           this.captchaObj = captchaObj
      //           captchaObj.onSuccess(() => {
      //             let result = this.captchaObj.getValidate()
      //             this.submitLoading = true
      //             this.$store.dispatch('axios_send_forget_mail', {
      //               email: this.form.email,
      //               geetest_challenge: result.geetest_challenge,
      //               geetest_validate: result.geetest_validate,
      //               geetest_seccode: result.geetest_seccode,
      //               check_captcha: 1
      //             }).then(result => {
      //               this.submitLoading = false
      //               if (result.data && +result.data.error === 0) {
      //                 this.$Message.success(this.$t('user.auth_email_send_success'))
      //               } else if (result.data.error === '100031') {
      //                 this.$alert.error({
      //                   title: this.$t('common.error_title_default'),
      //                   content: this.$t('user.email_not_activated')
      //                 })
      //               } else if (result.data.error === '100040') {
      //                 this.$alert.error({
      //                   title: this.$t('common.error_title_default'),
      //                   content: this.$t('user.email_not_reg')
      //                 })
      //               } else {
      //                 this.$alert.error({
      //                   title: this.$t('common.error_title_default'),
      //                   content: this.$t('user.auth_email_send_fail')
      //                 })
      //               }
      //             })
      //               .catch(() => {
      //                 this.submitLoading = false
      //                 // this.$Message.error(this.$t("user.auth_email_send_fail"));
      //               })
      //           })
      //         }
      //       )
      //     } else {
      //       this.$alert.error({
      //         title: this.$t('common.error_title_default'),
      //         content: this.$t('user.captcha_request_fail')
      //       })
      //     }
      //   })
      //   .catch(() => {
      //     // this.$Message.error(this.$t("user.captcha_request_fail"));
      //   })
    }
  }

</script>
<style lang='stylus' scoped>
  .content div {
    word-wrap: break-word;
  }

  .title {
    padding-top: 5vh;
    font-size: 1.6rem;
    color: #FFFFFF;
    margin-left: 14vw;
    text-align: left;
  }

  .form {
    margin-top: 5vh;
  }

  .formItem {
    margin-left: 14vw;
  }

  .input {
    width: 72vw;
  }

  .submitButton {
    margin-top: 1vh;
    font-size: 0.85rem;
    color: #00A6AE;
    text-align: center;
    width: 72vw;
    background: #FFFFFF;
    border-radius: 6px;
  }

  .goButton {
    display: flex;
    justify-content: flex-end;
    font-size: 0.85rem;
    color: #FFFFFF;
    letter-spacing: 0;
    cursor: pointer;
    margin-right: 14vw;
    padding-bottom: 4vh;
    &-btn {
      color: #FFFFFF;
      cursor: pointer;
    }
  }
</style>

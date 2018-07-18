<template lang="pug">
  .modifyPassword
    .content
      .title(v-text="$t('user.modify_password')")
      .form
        el-form(status-icon ref="form" :model="form" :rules="rules" @submit.native.prevent="submit")
          el-form-item(prop="password" class="formItem" :show-message="false")
            el-input(class="input" type="password" v-model="form.password" :placeholder="$t('user.password_new_required')")
              span(slot="prepend")
                img(src="../../assets/images/icon/Lock-FFFFFF.svg")
          el-form-item(prop="rePassword" class="formItem" :show-message="false")
            el-input(class="input" type="password" v-model="form.rePassword" :placeholder="$t('user.rePassword_required')")
              span(slot="prepend")
                img(src="../../assets/images/icon/Lock-FFFFFF.svg")
          el-form-item(class="formItem submit")
            el-button(class="submitButton" type='primary' :loading='submitLoading' @click="submit") {{$t('public.complete')}}
</template>
<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Watch} from 'vue-property-decorator';

  @Component
  export default class login_modifyPassword extends Vue {
    submitLoading: boolean = false;
    token: string = '';
    form: Globe.modifyPasswordForm = {
      password: '',
      rePassword: ''
    };
    rules: Globe.rules = {
      password: [
        {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            let reg = /[^\d].*[\d]|[\d].*[^\d]/;
            if (!value || !value.length) {
              callback(new Error(this.$i18n.translate('user.password_required', '')));
            } else if (!/^.{6,200}$/.test(value) || !reg.test(value)) {
              //6位以上的密码
              callback(new Error(this.$i18n.translate('user.password_minLength', '')));
            } else {
              callback();
            }
          }
        }
      ],
      rePassword: [
        {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value || !value.length) {
              callback(new Error(this.$i18n.translate('user.rePassword_required', '')))
            } else if (!/^.{6,200}$/.test(value)) {
              // 6位以上的密码
              callback(new Error(this.$i18n.translate('user.password_minLength', '')))
            } else if (value !== this.form.password) {
              callback(new Error(this.$i18n.translate('user.password_different', '')))
            } else {
              callback()
            }
          }
        }
      ]
    };

    @Watch('$route')
    changeRoute() {
      this.init();
    }

    mounted() {
      this.init()
    }

    submit() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store.dispatch('axios_forget_password', {
      //       token: this.token,
      //       password: this.form.password
      //     }).then(res => {
      //       this.loading = false
      //       if (res.data && +res.data.error === 0) {
      //         this.$Message.success(this.$t('user.password_modify_success'))
      //         this.$goRouter('/user/login')
      //       } else {
      //         // this.$Message.error(this.$t("user.password_modify_fail"));
      //       }
      //     }).catch(() => {
      //       // this.$Message.error(this.$t("user.password_modify_fail"));
      //     })
      //   } else {
      //     this.loading = false
      //     this.$alert.error({
      //       title: this.$t('common.error_title_default'),
      //       content: this.$t('user.password_modify_notValid')
      //     })
      //   }
      // })
    }

    init() {
      // if (this.$route.query && this.$route.query.token) {
      //   this.token = this.$route.query.token
      //   // 先判断 token valid
      //   this.$store.dispatch('axios_verified_token', {
      //     token: this.token
      //   }).then(res => {
      //     if (!res.data || +res.data.error !== 0) {
      //       this.$alert.error({
      //         title: this.$t('common.error_title_default'),
      //         content: this.$t('user.email_token_invalid')
      //       })
      //       this.$goRouter('/user/login')
      //     }
      //   }).catch(() => {
      //     // this.$Message.error(this.$t("user.email_token_invalid"));
      //     this.$goRouter('/user/login')
      //   })
      // }
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
</style>

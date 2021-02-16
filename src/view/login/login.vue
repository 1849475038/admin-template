<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container">
      <div class="top">
        <div class="desc">
          <img class="logo_login" src="@/assets/logo_login.png" alt="" />
        </div>
        <div class="header">
          <a href="/">
            <!-- <img src="~@/assets/logo.png" class="logo" alt="logo" /> -->
            <span class="title1">Gin-Vue-Admin</span>
          </a>
        </div>
      </div>
      <div class="main">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" @keyup.enter.native="submitForm">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="loginForm.username">
              <i class="el-input__icon el-icon-user" slot="suffix"></i></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="lock === 'lock' ? 'password' : 'text'" placeholder="请输入密码" v-model="loginForm.password">
              <i :class="'el-input__icon el-icon-' + lock" @click="changeLock" slot="suffix"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-input v-model="loginForm.captcha" name="logVerify" placeholder="请输入验证码" style="width: 60%" />
            <div class="vPic">
              <img v-if="picPath" :src="picPath" width="100%" height="100%" alt="请输入验证码" @click="loginVefify()" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" style="width: 100%">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="footer">
        <div class="links">
          <a href="http://doc.henrongyi.top/"><img src="@/assets/docs.png" class="link-icon" /></a>
          <a href="https://www.yuque.com/flipped-aurora/"><img src="@/assets/yuque.png" class="link-icon" /></a>
          <a href="https://github.com/flipped-aurora/gin-vue-admin"><img src="@/assets/github.png" class="link-icon" /></a>
          <a href="https://space.bilibili.com/322210472"><img src="@/assets/video.png" class="link-icon" /></a>
        </div>

        <div class="copyright">Copyright &copy; {{ curYear }} 💖flipped-aurora</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    initDynamicRoutes
  } from '../../router/index.js'
  import {
    mapMutations
  } from 'vuex'
  import {
    captcha,
    login
  } from "../../api/user.js";
  import {
    asyncMenu
  } from "../../api/menu.js";
  export default {
    name: "Login",
    data() {
      const checkUsername = (rule, value, callback) => {
        if (value.length < 5 || value.length > 12) {
          return callback(new Error("请输入正确的用户名"));
        } else {
          callback();
        }
      };
      const checkPassword = (rule, value, callback) => {
        if (value.length < 6 || value.length > 12) {
          return callback(new Error("请输入正确的密码"));
        } else {
          callback();
        }
      };
      return {
        curYear: 0,
        lock: "lock",
        loginForm: {
          username: "admin",
          password: "123456",
          captcha: "",
          captchaId: "",
        },
        rules: {
          username: [{
            validator: checkUsername,
            trigger: "blur"
          }],
          password: [{
            validator: checkPassword,
            trigger: "blur"
          }],
        },
        logVerify: "",
        picPath: "",
      };
    },
    // 初始页面渲染
    created() {
      this.loginVefify();
      this.curYear = new Date().getFullYear();
    },
    // 映射store中的mutations
    methods: {
      ...mapMutations({
        'setToken': 'user/setToken',
        'setMenu': 'user/setMenu'
      }),
      async submitForm() {
        this.loginForm.captchaId = this.captchaId
        // 登录
        login({
          'username': this.loginForm.username,
          'password': this.loginForm.password,
          'captcha': this.loginForm.captcha,
          'captchaId': this.loginForm.captchaId
        }).then(res => {
          console.log(res.data.code)
          // 登录失败重新获取验证码
          if (res.data.code == 7) {
            alert(res.data.msg)
            this.loginVefify()
          } else {
            // console.log('aaa', this.$store.state.user.token)
            this.setToken(res.data.data)
            //请求menu数据，将menu数据存进store
            asyncMenu({}).then(res => {
              this.setMenu(res.data.data.menus)
              initDynamicRoutes()
              this.$router.push('/home')
            }).catch(err => {
              Promise.reject(err);
            })

          }
        }).catch(err => {})
      },
      // 密码显示隐藏切换
      changeLock() {
        this.lock === "lock" ? (this.lock = "unlock") : (this.lock = "lock");
      },
      // 获取验证码
      loginVefify() {
        captcha({}).then(res => {
          console.log(res.data.data.picPath)
          this.picPath = res.data.data.picPath
          this.captchaId = res.data.data.captchaId
        }).catch(err => {
          Promise.reject(err);
        })

      },
    },
  };
</script>

<style scoped lang="scss">
  .title1 {
    font-size: 33px;
    color: rgba(0, 0, 0, 0.85);
    font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }

  @import "@/style/login.scss";
</style>

<template>
  <div class="flex location">
    <div class="menu">
      <el-menu v-for="item in menuList" :key="item.id" router :default-active="$route.path" class="el-menu-vertical-demo"
        @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item :index="'/home/' + item.path" v-if="item.children==null&&item.hidden==false">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
        <el-submenu :index="item.path" v-if="item.children!==null&&item.hidden==false">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-s-home"></i>
            <!-- 文本 -->
            <span>{{item.meta.title}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/home/' + subItem.path" v-for="subItem in item.children" v-if="subItem.hidden==false" :key="subItem.ID">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.meta.title}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <el-container>
      <el-container>
        <el-header>
          <div class="flex">
            <div>
              <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button v-show="isCollapse" :label="false">展开</el-radio-button>
                <el-radio-button v-show="!isCollapse" :label="true">收起</el-radio-button>
              </el-radio-group>
            </div>
            <div class="flex1"></div>
            <div class="header-img1">
              <el-dropdown class="flex" trigger="click">
                <div>
                  <img class="header-img" :src="headerImg" alt="">
                  <div>{{nickName}}</div>
                </div>

                <div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="logOut">登出</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </div>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view class="router-view"></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import { clearRoutes } from '../../router/index.js'
  import {
    mapMutations
  } from 'vuex'
  import {
    jsonInBlacklist
  } from '../../api/jwt.js'
  import store from '../../store/index.js' 
  export default {
    data() {
      return {
        // 是否折叠
        isCollapse: false,
        role: '',
        // 渲染列表
      };
    },
    created() {
      const user = store.getters['user/getUser']
      const getMenu = store.getters['user/getMenu']
      this.headerImg = user.headerImg,
      this.nickName = user.nickName
      this.menuList = getMenu
    },
    methods: {
      ...mapMutations({
        'LoginOut': 'user/LoginOut'
      }),
      logOut() {
        jsonInBlacklist().then(response => {
          console.log(response)
          this.LoginOut()
          clearRoutes()
          this.$router.push('/login')
        }, response => {
          console.log("error");
        });
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
  .flex {
    display: flex;
  }

  .flex1 {
    flex: 1;
  }

  .el-submenu__title {
    width: 200px;
  }

  .el-header {
    color: #333;
    line-height: 80px;
    margin-bottom: 10px;
  }

  .el-aside {
    color: #333;
    line-height: 200px;
  }

  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-menu {
    background: #191a23;

  }

  .menu {
    background: #191a23;
  }

  .el-menu-item-group__title {
    color: rgb(191, 203, 217);
  }

  .el-submenu__title {
    color: rgb(191, 203, 217);
  }

  .el-menu-item {
    color: rgb(191, 203, 217);
  }

  .el-menu-item.is-active {
    color: white;
  }

  .el-menu-item:hover {
    background: #191A23;
  }

  .el-submenu__title:hover {
    background: #191A23;
  }

  .el-menu-item:focus {
    background: #1890ff;
  }

  .location {
    min-height: 100vh;
  }

  .menu {
    min-height: 100%;
  }

  .v-modal {
    position: relative;
    z-index: -999999;
  }

  .el-radio-button__inner {
    border-left: 1px solid #DCDFE6;

  }

  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 4px;
  }

  .el-container {
    flex: 1;
    width: 80vw;
  }

  .el-container.is-vertical {
    width: 100%;
  }

  .title img {
    height: 40px;
    width: 40px;
    background: white;
    border-radius: 50%;
    margin-right: 12px;
  }

  .title {
    margin-left: -8px;
    padding-top: 10px;
    display: flex;
    color: white;
    line-height: 40px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .el-dropdown-selfdefine div {
    line-height: 40px;
  }

  .header-img {
    height: 40px;
    width: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .el-dropdown-selfdefine {
    display: flex;
    padding-top: 20px;
  }
</style>

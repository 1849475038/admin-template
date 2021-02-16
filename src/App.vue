<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    initDynamicRoutes
  } from './router/index.js';
  export default {
    name: 'app',
    created() {
      // 刷新页面重新加载路由
      initDynamicRoutes()
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
</style>

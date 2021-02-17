// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUi from 'element-ui'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index.js'
Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

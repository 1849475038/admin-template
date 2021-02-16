import Vue from 'vue'
import Vuex from 'vuex'
// 导入user
import {
  user
} from './module/user.js'
//导入持久化存储插件
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)
//创建对象并进行配置
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user']
})

// 加入模块user
export default new Vuex.Store({
  modules: {
    user
  },
  // 持久化存储vuexLocal对象
  plugins: [vuexLocal.plugin]
})

export const user = {
  namespaced: true,
  // 存放全局数据
  state: {
    token: '',
    user: '',
    expiresAt: '',
    menu: []
  },
  // 相当于组件中的computed,getters是全局的,computed是组件内部使用的
  getters: {
    getToken(state) {
      return state.token
    },
    getUser(state) {
      return state.user
    },
    getMenu(state) {
      return state.menu
    }
  },
  //更改vuex中state的状态的唯一方法是提交mutations
  mutations: {
    setToken(state, newUser) {
      state.token = newUser.token,
      state.user = newUser.user,
      state.menu = newUser.user.authority.authorityName
      state.expiresAt = newUser.expiresAt
    },
    setMenu(state,newMenu){
      state.menu=newMenu
    },
    LoginOut(state) {
      state.token =null
      state.user = ''
      state.menu=null
      sessionStorage.clear()
    },
  },
  //专门用于处理异步,实际修改状态值的依然是mutations
  actions: {},
}

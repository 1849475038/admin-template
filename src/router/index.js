import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login/login.vue'
import store from '../store/index.js'

Vue.use(Router)

//创建指定角色可见的路由
const userRule = {
  path: 'state',
  name: 'serverStatus',
  component: () => import('../view/home/serverStatus/serverStatus.vue')
}
//创建通配路由
const userFour = {
  path: '*',
  name: 'error',
  component: () => import('../view/error/error.vue')
}
//白名单路由
const createRouter = () => new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../view/login/login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/home/dictionary',
      component: () => import('../view/home/home.vue'),
      children: [{
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('../view/home/Dictionaries/Dictionaries.vue')
      }, ]
    },
  ]
})

// 路由拦截 如果用户未登录返回登录页
const router = createRouter();
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || '/') {
    next()
  } else {
    const token = store.getters['user/getToken']
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})
//根据用户身份加载路由,一般用于登录和刷新
export function initDynamicRoutes() {
  const getUser = store.getters['user/getUser']
  const currentRoutes = router.options.routes
  if (getUser.authority.authorityName == '普通用户') {
    const temp = userRule
    const four = userFour
    currentRoutes[2].children.push(temp, four)
    router.addRoutes(currentRoutes)
  }
  console.log(currentRoutes)
}
// 退出时清空路由
export function clearRoutes() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher
}
export default router

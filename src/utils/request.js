import axios from 'axios';
import store from '../store/index.js'

//创建axios对象
const service = axios.create({
  baseURL: 'http://demo.gin-vue-admin.com/api',   // 接口前部分
  timeout: 5000    // 超时时间
})

// 请求拦截
// 请求发出之前,对请求数据做进一步处理,比如添加token,
// 比如接口请求权限验证
service.interceptors.request.use( 
  function(config) {

    const token = store.getters['user/getToken']
    const user = store.getters['user/getUser']

    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
      'x-token': token,
      'x-user-id': user.ID
    }
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
)

//响应拦截,可以统一处理一些状态码
// 避免在接口中做重复的异常处理
service.interceptors.response.use(
  function(response) {
    return response;
  },
  function(err) {
    return Promise.reject(err);
  }
)

export default service

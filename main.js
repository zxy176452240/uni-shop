import Vue from 'vue'
import App from './App'
// 导入 store 实例对象
import store from './store/store.js'


// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 挂载网络请求包
uni.$http = $http
// 请求根路径
$http.baseUrl = 'http://api-ugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({ title: '数据加载中...' })
  
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my/') !== -1) {
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: store.state.m_user.token,
    }
  }
}
// 响应拦截器
$http.afterRequest = function() {  
  uni.hideLoading()
}

// 封装提示弹框
uni.$showMsg = function(title = '数据请求失败！',duration = 1500) {
    uni.showToast({
      title,
      duration,
      icon:'none'
    })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({ 
  ...App,
  // 挂载到 Vue实例上
  store,
})
app.$mount()
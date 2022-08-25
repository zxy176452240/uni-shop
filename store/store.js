import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车的 vuex 模块
import moduleCart from './toCart.js'
import moduleUser from './user.js'

// 安装 Vuex 
Vue.use(Vuex)

// 创建 Store 实例对象
const store = new Vuex.Store({ 
  modules: {
    // 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为m_cart，例如:
    // 购物车模块中 cart 数组的访问路径是 m_cart/cart
    m_cart: moduleCart,
    m_user: moduleUser
  }, 
})

export default store
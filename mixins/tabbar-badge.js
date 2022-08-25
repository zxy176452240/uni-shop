// 按需导入 mapGetters 这个辅助方法
import { mapGetters } from 'vuex'

export default {
  computed: {
    // 将 m_cart 模块中的 total 映射为当前页面的计算属性
    ...mapGetters('m_cart', ['total']),
  },
  
  watch: {
    // 监听 total 值的变化，解决（不能实时更新数字徽标的问题）
    total() {
      this.setBadge()
    }
  },
  
  onShow() {
    // 在页面刚展示的时候，设置数字徽标。不能及时更新
    this.setBadge()
  },
  
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2, // 索引
        text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      })
    }
  }
}

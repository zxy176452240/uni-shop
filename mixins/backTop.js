// 返回顶部
export const backTopMixin = {
  data () {
    return {
      // 窗口高度
        windowHeight: 0,
        // 回到顶部
        back: false
    }
  },
  methods: {
    // 页面滚动触发的事件
    PageScroll(e) {
    	// 获取页面高度
    	uni.getSystemInfo({
    		success:res=>{
    			this.windowHeight = res.windowHeight
    		}
    	})
      // 判断滚动距离
      if (e.scrollTop >= this.windowHeight) {
      	this.back = true
      } else {
      	this.back = false
      }
    },
  },
}
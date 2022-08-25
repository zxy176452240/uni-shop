<template>
  <view>
    <!-- 搜索列表 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none" :value='queryObj.name'></uni-search-bar>
    </view>
    
    <!-- 商品列表 -->
    <view class="goods-list">
      <view v-for="(item,index) in goodsList" :key="index" @click="gotoGoodsDetail(item)">
        <my-goods :item="item"></my-goods>
      </view>
    </view>
    
    <!-- 回到顶部组件 -->
    <my-backTop :back="back"></my-backTop>
  </view>
</template>

<script>
  // 导入混入对象
  import backTop from '@/mixins/backTop.js'
  
  export default {
    // 混入对象
    mixins: [backTop],
    
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类ID
          cid: '',
          // 页码值
          pageNum: 1,
          // 页面显示数据值
          pageSize: 10,
          // 商品名
          name: ''
        },
        // 商品列表数据
        goodsList: [],
        // 总数量：用于分页操作
        total: 0,
        // 定时器ID
        timer: null,
        // 搜索关键词
        kw: '',
        // 节流阀
        isloading: false
      };
    },
    
    onLoad(options) {
      // 将页面携带的参数转存至 queryObj
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.queryObj.name = this.kw = options.name || ''
      
      this.getGoodsList()
    },
    
    // 上拉触底事件
    onReachBottom() {
      // 页码值 +1
      this.queryObj.pageNum += 1
      // 重新获取列表数据
      this.getGoodsList()
    },
    
    // 下拉刷新事件
    onPullDownRefresh() {
      // 重置页面参数
      this.queryObj.pageNum = 1,
      this.total = 0
      this.isloading = false
      this.goodsList = []
      // 重新获取列表数据,并执行 结束下拉刷新 的回调函数
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    
    methods: {
      // 获取商品列表数据
      // cd 指的是回调函数，如果此函数调用时传回回到函数，则用 cd 表示
      async getGoodsList(cd) {
        this.loading = true
        const {data: res} =await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        this.loading = false
        // 只要数据请求完成,立即调用 cd 函数
        cd && cd()
        
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        
        this.goodsList =[...this.goodsList,...res.message.goods] 
        this.total = res.message.total
      },
      
      // 跳转商品页面
      gotoGoodsDetail(item) {
        uni.navigateTo({
          url:'/sub_packages/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      
      // input 输入事件
      input(e) {
        // 清楚定时器
        clearTimeout(this.timer)
        // 重启定时器，并将timeId赋值给this.timer
        this.timer = setTimeout(() => {
          
          if (this.kw !== e) {
            this.kw = e
          // 根据关键词，查询搜索结果
          this.getSearchList()
          }
        },500)
      },
      
      // 查询搜索结果
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索建议
        const { data : res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query: this.kw})
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = res.message
      },
      
      // 监听页面滚动事件
      onPageScroll(e) {
        // 调用混入的方法
        this.PageScroll(e)
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 设置定位效果为"吸顶"
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
</style>

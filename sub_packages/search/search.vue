<template>
  <view>
    <!-- 搜索区域 -->
    <view class="search-box">
      <uni-search-bar :focus="true" @input="input" :radius="100" cancelButton="none" placeholder="请输入想要搜索的商品"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表区域 -->
    <view class="sugg-list" v-show="searchResultsLength">
      <navigator :url="'/sub_packages/goods_detail/goods_detail?goods_id=' + item.goods_id" class="sugg-item" v-for="(item,index) in searchResults" :key="index" @click="saveSearchHistory">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </navigator>
    </view>
    
    <!-- 搜索历史区域 -->
    <view class="history-box" v-show="!searchResultsLength">
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 历史记录 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,index) in histories" :key="index"  @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 定时器ID
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史
        historyList: []
      };
    },
        
    computed:{
      // 计算搜索列表是否为空
      searchResultsLength(){
        return this.searchResults.length;
      },
      // 计算历史记录是否为空
      // historyListLength(){
      //   return this.historyList.length;
      // },
      // 计算搜索记录，将历史记录进行反转，解决（历史记录顺序问题）
      // 注意: 由于原数组直接调用 reverse 方法,会修改原数组的index,
      // 所以应该使用 ... 的方式,建立一个新数组做返回值,
      // 同时在页面渲染时,要用新数组进行循环渲染
      histories() { 
        return [...this.historyList].reverse()
      }
    },

    onLoad() {
      // 将本地存储的历史记录渲染到页面
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    
    methods: {
      // input 输入事件
      input(e) {
        // 清楚定时器
        clearTimeout(this.timer)
        // 重启定时器，并将timeId赋值给this.timer
        this.timer = setTimeout(() => {
          this.kw = e
          // 根据关键词，查询搜索结果
          this.getSearchList()
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
        this.searchResults = res.message
      },
      
      // 保存搜索记录
      saveSearchHistory() {
        // 此做法用于解决(关键词重复问题)
        // 1-将数组转化为 Set 对象
        const set = new Set(this.historyList)
        // 2-调用 Set 对象的 delete 方法,移除对应元素
        set.delete(this.kw);
        // 3-调用 Set 对象的 add 方法,向 Set 对象中添加元素
        set.add(this.kw);
        // 4-将 Set 对象转化为数组
        this.historyList = Array.from(set);
        
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录存储到本地
        uni.setStorageSync("kw", JSON.stringify(this.historyList))
      },
      
      // 跳转商品页
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/sub_packages/goods_list/goods_list?query=' + kw
        })
      },
      
      // 清空历史记录
      cleanHistory() {
        if (this.historyList.length) {
          this.historyList = []
          uni.removeStorageSync('kw')
          uni.showToast({
            title: "已清空历史记录",
            duration: 700,
            icon:'none'
          })
        } else{
          uni.showToast({
            title: "暂无历史记录",
            duration: 700,
            icon:'none'
          })
        }
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

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        // 文字不换行
        white-space: nowrap;
        // 溢出隐藏
        overflow: hidden;
        // 隐藏部分以省略号显示
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
      margin-bottom: 5px;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>

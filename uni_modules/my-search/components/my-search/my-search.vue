<template>
    <view class="my-search-container" :class="{'search-box':stickyTop}" :style="{'background-color': bgcolor}
" @click="searchBoxHandler(searchURL)">
      <view class="my-search-box" :style="{'border-radius': radius + 'px'}"> 
        <uni-icons type="search" size="17"></uni-icons>
        <text class="placeholder">搜索</text>
      </view>
    </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props:{
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#4781c3'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18
      },
      // 跳转地址值
      searchURL: {
        type: String,
        default: '/sub_packages/search/search'
      },
      // 吸顶需求
      stickyTop: {
        type: Boolean,
       default: false
      }
    },
    methods: {
      // 跳转搜索界面
      searchBoxHandler(searchURL) {
        uni.navigateTo({
          url: searchURL
        })
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
  
  .my-search-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 10px;

    .my-search-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;
      background-color: #FFFFFF;
      width: 100%;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }

</style>

<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio">
      <radio color="#007aff" :checked="isFullCheck" @click="changeAllState" /><text>全选</text>
    </label>
    
    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
  
    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  
  export default {
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      
      // 判断全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    },
    
    data() {
      return {}
    },  
    
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      
      // 修改购物车中所有商品的选中状态
      changeAllState() {
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my-settle-container {
    /* 底部固定定位 */
    position: fixed;
    bottom: 0;
    left: 0;
    /* 设置宽高和背景色 */
    width: 100%;
    height: 50px;
    border-top: 1px solid #eeefef;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;
  
    .radio {
      display: flex;
      align-items: center;
    }
  
    .amount {
      color: #007aff;
    }
  
    .btn-settle {
      height: 50px;
      min-width: 100px;
      background-color: #007aff;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>

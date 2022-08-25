<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址区域 -->
    <my-address></my-address>
    
    <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 商品列表区域 -->
    <!-- uni-swipe-action 是最外层包裹性质的容器 -->
    <uni-swipe-action>
      <block v-for="(item, index) in cart" :key="index">
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)">
        <my-goods :item="item" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    
    <!-- 结算区域 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  // 混入 购物车页面数字徽标
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 按需导入 mapState 这个辅助函数
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    mixins: [badgeMix],
    
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#007aff' // 按钮的背景颜色
          }
        }]
      }
    },
        
    computed: {
      // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
      ...mapState('m_cart', ['cart']),
    },
    
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount','removeGoodsById']),
      
      // 修改选中状态
      radioChangeHandler(e) {
        // 调用映射的函数
        this.updateGoodsState(e)
      },
      
      // 修改商品数量
      numberChangeHandler(e) {
        // 调用映射的函数
        this.updateGoodsCount(e)
      },
      
      // 滑动删除功能
      swipeActionClickHandler(item) {
        // 调用映射的函数
        this.removeGoodsById(item.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }
  
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    
    .cart-title-text {
      margin-left: 10px;
    }
  }
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  
    .empty-img {
      width: 90px;
      height: 90px;
    }
  
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>

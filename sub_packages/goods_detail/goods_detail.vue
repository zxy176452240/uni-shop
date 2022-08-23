<template>
  <!-- 使用 v-if 解决（数据为请求完成时的显示异常） -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item,index) in goods_info.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="freight">快递：顺丰包邮</view>
    </view>
    
    <!-- 商品详情区域 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件 -->
    <view class="goods-nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
    
    <!-- 回到顶部组件 -->
    <my-backTop :back="back"></my-backTop>
  </view>
</template>

<script>
  // 导入混入对象
  import { backTopMixin } from '@/mixins/backTop.js'
  
  export default {
    // 混入对象
    mixins: [backTopMixin],
    
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 商品导航左侧区域数据
        options: [{
          icon: 'headphones',
          text: '客服'
        },{
          icon: 'shop',
          text: '店铺'
        },{
          icon: 'cart',
          text: '购物车',
          info: 2,
          infoBackgroundColor: '#007aff',
        }],
        // 商品导航右侧区域数据
				buttonGroup: [{
					text: '加入购物车',
					backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
					color: '#fff'
				},{
					text: '立即购买',
					backgroundColor: 'linear-gradient(90deg, #60F3FF, #088FEB)',
					color: '#fff'
				}],
        // 窗口高度
        windowHeight: 0,
        // 回到顶部
        back: false
      };
    },
    
    onLoad(options) {
      // 获取商品ID
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    
    methods: {
      // 商品详情数据
      async getGoodsDetail(goods_id) {
      const { data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      
      // 处理数据
      // 使用 replace() 方法,为img标签添加行内样式,从而解决（图片下方空白问题）
      // 同时也对 webp 格式图片进行替换，解决（在ios端图片显示异常）
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
      
      this.goods_info = res.message
      console.log(this.goods_info);
      },
      
      // 轮播图预览事件
      preview(index) {
        // uni自身预览方法
        uni.previewImage({
          // 预览时默认显示此索引值的图片
          current: index,
          // 所有图片 url 地址数组
          // map() 方法获取数组每个元素的 pics_big ，返回一个新的数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      
      // 商品导航组件点击事件
      onClick (e) {
        if(e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick (e) {
        console.log(e)
        this.options[2].info++
      },
      
      // 监听页面滚动事件
      onPageScroll(e) {
        // 调用混入的方法
        this.PageScroll(e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-detail-container {
    padding-bottom: 50px;
  }
  
  swiper {
    height: 750rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #007aff;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .freight {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }
  
  .goods-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

	.back-top {
		position: fixed;
		bottom: 60px;
		right: 10px;
    width: 30px;
    height: 30px;
    padding: 5px;
    text-align: center;
    color: #fff;
    font-size: 11px;
    border-radius: 50%;
    background-color: #1E83FF;
    z-index: 999;
	}
</style>

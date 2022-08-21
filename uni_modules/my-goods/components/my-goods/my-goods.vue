<template>
  <view class="goods-item">
      
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <view class="goods-name">{{item.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{(item.goods_price || '暂无报价') | tofixed}}</view>
      </view>
    </view>
      
    </view>
</template>

<script>  
  export default {
    data() {
      return {
        // 默认图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    filters: {
      tofixed(num) {
        if (num !== '暂无报价') {
        // 以 \d（数字）开头
        // (\d{3})+  3的倍数个\d（数字）
        // (\d{3})+\.  3的倍数个\d（数字），并且以\.（.）结尾
        // ?=  是正向预匹配，即不会让?=后面的内容被匹配出来，这里的作用是不让\d{3}+被替换掉
        // ?=(\d{3})+\.  匹配(3的倍数个\d（数字），并且以\.（.）结尾)之前的内容
        // g  进行全局多次匹配满足的条件
        // $1 正则表达式的replace特有的规则，表示满足前一个参数的内容，如replace('例','$1,'),此处的 $1 指的就是 '例' 
        // replace(/(\d)(?=(\d{3})+\.)/g,'$1,')  将(满足条件的内容)替换为 (内容,)
        
        // 例：1234567890.012 
        // 第一次匹配到 1，替换为 1,
        // 第二次匹配到1234，替换为 1234,
        // 第三次匹配到1234567，替换为 1234567,
        // 替换汇总: 1,234,567,
        // 与原数据结合: 1,2 34,567,890 .012
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$1,')
        } else {
          return num
        }
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          color: #C00000;
          font-size: 16px;
        }
      }
    }
  }
</style>

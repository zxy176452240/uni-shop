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
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
  
  export default {
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),   
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      
      // 判断全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    },
    
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
      }
    },  
    
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      
      // 修改购物车中所有商品的选中状态
      changeAllState() {
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      
      // 结算
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')

        // 2. 再判断用户是否选择了收货地址
        // if (!this.addstr) return uni.$showMsg('请选择收货地址！')
      
        // 3. 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        if (!this.token) return this.delayNavigate()
        
        // 4. 实现微信支付功能
        this.payOrder()
      },
      
      // 延迟导航到登录页面
      delayNavigate() {
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTips(this.seconds)
      
        // 2. 创建定时器，每隔 1 秒执行一次
        this.timer = setInterval(() => {
          // 2.1 先让秒数自减 1
          this.seconds--
          
          // 2.2 判断秒数
          if (this.seconds <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            // 跳转页面
            uni.switchTab({
              url: '/pages/user/user',
                // 页面跳转成功之后的回调函数
                success: () => {
                  // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                  this.updateRedirectInfo({
                    // 跳转到登录界面的方式
                    openType: 'switchTab',
                    // 从哪个页面跳转到登录界面的
                    from: '/pages/cart/cart'
                  })
                }
            })
            // 初始化 倒计时的秒数
            this.seconds = 3
            // 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      
      // 微信支付
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state)
                          .map(x => ({ 
                            goods_id: x.goods_id, 
                            goods_number: x.goods_count, 
                            goods_price: x.goods_price ,
                          }))
        }
        // 1.2 发起请求创建订单
        const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        console.log(res.message);
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
      
        // 2. 订单预支付
        // 此处无法执行，token正确，但 用户id不正确
        // 2.1 发起请求获取订单的支付信息
        const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
        console.log(res2.meta);
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
      
         // 3. 发起微信支付
         // 3.1 调用 uni.requestPayment() 发起微信支付
         const [err, succ] = await uni.requestPayment(payInfo)
         // 3.2 未完成支付
         if (err) return uni.$showMsg('订单未支付！')
         // 3.3 完成了支付，进一步查询支付的结果
         const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
         // 3.4 检测到订单未支付
         if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
         // 3.5 检测到订单支付完成
         uni.showToast({
           title: '支付完成！',
           icon: 'success'
         })
       },
      
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
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

<template>
    <!-- 回到顶部组件 -->
    <view class="back-top" @tap="backtop" v-if="back">回到顶部</view>
</template>

<script>
  export default {
    props: {
      back: {
        type: Boolean,
        default: false
      }
    },
            
    methods: {
      // 点击返回顶部按钮 跳回顶部
      backtop() {
      	uni.pageScrollTo({
      		scrollTop: 0
      	});
      },
      
    }
  }
</script>

<style lang="scss">
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

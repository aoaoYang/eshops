// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    //被收藏的商品数量
    collectNums:0
  },
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
     //获取缓存中的收藏数据
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      userinfo,
      collectNums:collect.length
    })
  }
})
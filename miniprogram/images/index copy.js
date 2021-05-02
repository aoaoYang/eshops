import {request} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
  //轮播图数组
    swaperList: [],
  //导航数组
    catesList: [],
  //楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api.it120.cc/kotoba/banner/list',
    //   success: (res) => {
    //     this.setData({
    //       swaperList: res.data.data
    //     })
    //     //  console.log(result.data);
    //     }
    // })
    this.getSwiplist();
    this.getCatelist();
    this.getFloorlist();
  },
  //获取轮播图数据
  getSwiplist(){
    //发送异步网络请求-ES6 promise 避免回调地狱
    request({ url:"/home/swiperdata"})
    .then(result =>{
      this.setData({
        swaperList: result   
      })  
    })
  },
  //获取分类导航数据
  getCatelist(){
    //发送异步网络请求-ES6 promise 避免回调地狱
    request({ url:"/home/catitems"})
    .then(result =>{
      this.setData({
        catesList: result     
      })  
    })
  },
   //获取楼层数据
   getFloorlist(){
    //发送异步网络请求-ES6 promise 避免回调地狱
    request({ url:"/home/floordata"})
    .then(result =>{
      this.setData({
        floorList: result       
      })  
    })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
// pages/category/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../libs/runtime/runtime"

Page({

  /**
   * 页面的初始数据
   */
  data: {
  //左侧菜单数据
  leftMenuList:[],
  //右侧商品数据
  rightContent:[],
  //被点击的左侧菜单
  currentIndex:0,
  //右侧商品信息与顶部距离
  scrolltop:0
  },
  //接口返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  /*数据缓存处理
  0.代码形式
    --web方式:
    localStorage.setItem("key","value") localStorage.getItem("key")
    --小程序方式：
    wx.setStorageSync('key', data)  wx.getStorageSync('key')
    有无类型转换
    web：最终调用toString方法，变成字符串再存入
    小程序：不存在数据转换
  1.先判断本地存储有无旧的数据{time:Date.now(),data:[...]}
  2.没有旧数据，直接发送新的请求
  3.有数据且没有过期，使用本地旧数据即可
  */
  //1.获取本地存储数据
  const Cates=wx.getStorageSync('cates')
  //2.判断
  if(!Cates){
    //不存在,发送请求获取数据
    this.getCates();
  }
  else {
  //有旧的数据 定义过期时间 10s 5min
  if(Date.now()-Cates.time>1000*15){
    //重新发送请求
    this.getCates();
  } else{
    //使用旧数据
    this.Cates=Cates.data;
    //构造左侧大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //构造右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  }

  }
  },
  //获取分类
  async getCates(){
    // request({
    //   url: "/categories"
    // }).then(res=>{
    //   this.Cates=res.data.message;
    //   // 把接口数据存入本地
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});

    //   //构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    //   console.log(res);
    // })
    // 1.es7 和await 发送同步请求
    const res=await request({url:"/categories"})
      // this.Cates=res.data.message;
      this.Cates=res;
      // 把接口数据存入本地
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
      //构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
      console.log(res);
  },
  handleItemTap(e){
    console.log(e)
    //1.获取被点击的标题身上的索引
    //2.给data中的currentIndex赋值
    //3.根据不同的索引来渲染右侧的商品
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrolltop:0
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
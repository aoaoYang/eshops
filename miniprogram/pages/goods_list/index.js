// pages/goods_list/index.js
  /**功能1：用户上滑页面 滚动条触底 开始加载下一页数据
   * 1.找到滚动条数据 
   * 2.判断还有没有下一页数据 
   *   1.获取总页数 只有总条数 total 
   *    总页数= Math.ceil(total/ 页容量 pagesize)
   *   2.获取到当前的页码 pagenum 
   *   3.判断当前页码大于等于总页数 则没有 否则有下一页
   * 有则加载下一页数据 无则提示
   * 加载下一页数据{1.当前页码++ 2重新发送请求 3 请求回来数据 直接进行数组拼接}
   */
  /**功能2：用户下拉 刷新页面
   *  1.触发下拉刷新事件  page.json 配置 enablePullDownFresh
   *   找到触发下拉刷新的事件 onPullDownRefresh
   *  2.重置 数据 数组
   *  3.重置页面 设置为1
   *  4.重新发送请求
   *  5.数据已请求回来，需要关闭等待效果 wx.stopPullDownRefresh();
   * **/
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
  tabs:[
  {
    id:0,
    value:"综合",
    isActive:true
  },
  {
    id:1,
    value:"销量",
    isActive:false
  },
  {
    id:2,
    value:"价格",
    isActive:false
  },
  ],
  goodsList:[]
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // console.log(options);
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList(){
  const res=await request({url:"/goods/search",data:this.QueryParams})
  console.log(res);
  //获取总页数
  const total=res.total;
  this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  // console.log(this.totalPages);
  this.setData({
    //拼接的数组
    goodsList:[...this.data.goodsList,...res.goods]
  })
  //请求完成，关闭下拉的窗口
   wx.stopPullDownRefresh();
  },
  // 点击标题事件，从子组件传递过来的
  handleTabsItemChange(e){
   console.log(e);
   // 1 获取被点击的标题索引
   const {index}=e.detail;
   // 2 修改源数组 产生选中效果
   let {tabs}=this.data;
   tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
   //3  赋值到data中
   this.setData({
     tabs
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
    //1.重置数组
    this.setData({
      goodsList:[]
    }),
    //2.重置页码
    this.QueryParams.pagenum=1;
    //3.发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面触底!');
    //判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
      })
    } else{
      // console.log("有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
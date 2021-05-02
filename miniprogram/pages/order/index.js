// pages/order/index.js
/*
1 页面被打开时候 onShow
  0 onShow 不同onLoad 无法在形参上接收 options参数
    0.5 判断缓存中有没有token {没有:直接跳转到授权页面  有：直接往下进行}
  1.获取url上的参数type
  2.根据type 去决定页面标题的数组元素 哪个被激活选中 
  2.根据type 去发送请求获取订单数据  
  3.渲染页面
2 点击不同的标题，需要重新发送请求和渲染数据
*/
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退货/退款",
        isActive:false
      },
      ]
  },
  // onLoad(options){
  //   console.log(options);
  // },
  onShow(options){
    //获取缓存中的token,非企业微信无法生成token
    // const token=wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index',
    //   });
    //   return;
    // }
    //1.获取当前的小程序的页面栈-数组 长度最大10页面
    let pages =  getCurrentPages();
    // console.log(pages);
    //2.数组中 索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    console.log(currentPage.options);
    //3.获取url上的type参数
    const {type}=currentPage.options;
    //4.根据标题激活选中页面标题 type=1 index=0
    this.changeTitleByIndex(type-1);
    //5.重新请求数据
    this.getOrders(type)
  },
  async getOrders(type){
  const res=await request({url: "/my/orders/all", data: {type}});
  console.log(res);
  this.setData({
    orders:res.orders.map(v=>({...v,create_time_cn:new Date(v.create_time*1000).toLocaleString()}))
  })
  },

  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
      // 2 修改源数组 产生选中效果
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      //3  赋值到data中
      this.setData({
        tabs
      })
  },
  handleTabsItemChange(e){
    console.log(e);
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    //2.重新发送请求 type=1 index=0
    this.getOrders(index+1);
   },
 
})
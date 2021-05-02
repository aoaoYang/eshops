// pages/goods_detail/index.js
// 1.发送请求获取商品详细数据

import {request} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";
import {showToast } from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */

  onShow: function () {
  let pages=getCurrentPages();
  let currentPage=pages[pages.length-1];
  let options=currentPage.options;
  const {goods_id}=options;
  // console.log(goods_id);
  this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:'/goods/detail',data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // console.log(goodsObj);
  //1 缓存中的商品收藏数组
  let collect=wx.getStorageSync("collect")||[];
  //2 当前商品是否被收藏
  let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce,
        //iphone 部分手机不支持 webp格式 ，让后台修改成.jpg格式
        //临时自己改 采用正则表达式
        // goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics,
      },
      isCollect
    })
  },
  //2. 点击轮播图 预览大图
  //2.1 绑定事件，调用api -- previewImage  
  handlePreviewImage(e){
  console.log("preview");
  // 1.先构造要预览的图片数组
  const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
  // 2.接收传递过来的图片url 
  const current =e.currentTarget.dataset.url;
  wx.previewImage({
    current: current, //url 的第一张
    urls:urls, //要预览图片的http列表
  })
  },
  //3.点击添加购物车
  //3.1 绑定事件 3.2 获取缓存中购物车数据 数组格式 
  //3.3 先判断商品是否存在购物车中： 3.3.1 存在 购物车num++ 填充于缓存中
  //3.3.2 不存在 添加商品给购物车数组 添加一个新元素 且包含购买数量属性num 且填充于缓存中
  handleCartAdd(){
  console.log("add cart");
  //1.获取缓存中的购物车 数组类型转换
  let cart=wx.getStorageSync('cart')||[];
  //2.判断商品对象是否存在购物车中
  let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
  if(index===-1){
    //3.此商品不存在于购物车中,第一次添加
    this.GoodsInfo.num=1;
    this.GoodsInfo.checked=true;
    cart.push(this.GoodsInfo);
  }else{
     //4.已存在购物车
    cart[index].num++;
  }
  // 5.把购物车重新添加回缓存
  wx.setStorageSync('cart', cart)
  //6.操作弹窗提示 加入购物车
  wx.showToast({
    title: '加入成功',
    icon:'success',
    //mask 防止用户疯狂点击
    mask:true
  })
  },
  
  // 4.商品收藏
   /* 1页面onShow的时候 加载缓存中的商品收藏数据
    * 2判断当前商品是不是被收藏 
        1.是 改变页面的图标 
        2 不是 不做处理
      3 点击商品收藏按钮
        1.判断商品是否存在缓存数组中
        2.已经存在 删除该商品
        3.否则 添加商品到收藏数组中 存入到缓存即可  
    */
  //点击商品收藏图标
  async handleCollect(){
     let isCollect=false;
    //1. 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2 判断商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //3 当 index!=-1 表示 已经收藏过
    if(index!==-1){
     //取消收藏 数组中删除该商品
     collect.splice(index,1);
     isCollect=false;
     await showToast({ title: "取消成功!" });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      await showToast({title: "收藏成功!" });
    }
    //4 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    //5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  },
})
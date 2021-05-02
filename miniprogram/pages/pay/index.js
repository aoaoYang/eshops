// pages/pay/index.js
/*
1,页面加载
  从缓存中获取购物车数据 渲染到页面中 check=true
2,微信支付
  1，权限 人员 和账号 可以进行微信支付 
    1.企业账号 2.企业小程序后台 必须给开发者添加白名单
      1.一个appid 可以绑定多个开发者
      2.这些开发者可以共用appid 和它的开发权限
3.支付按钮
  1，判断缓存中有无token
    2. 没有token 跳转到授权页面 进行获取token
    3. 有token 执行后面的创建订单 获取订单编号
    4. 创建订单 获取订单编号
    5  已经完成微信支付 手动移除购物车中支付成功的商品
    6  删除后的缓存数据 填充回缓存
    7  再跳转页面

*/
import { request } from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../libs/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收货地址
    address: {},
    //缓存中的购物车数组
    cart: [],
    //总价格
    totalPrice: 0,
    //总数量
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    //1.获取缓存收货地址
    const address = wx.getStorageSync('address');
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    //1.计算全选
    //every 数组方法 会遍历 接收一个回调函数 每一个回调函数都返回true，那么every 返回值为 true,否则不再执行返回为false
    //空数组调用 every,返回值为true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({ address });
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice, totalNum, address,
    });
  },
  //点击支付
  async handleOrderPay() {
    try {
      console.log("pay click");
      //1.token 判断
      const token = wx.getStorageSync("token");
      //2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      //  console.log("已经存在token");
      //3.创建订单 
      //3.1准备请求头参数
      // const header = { Authorization: token };
      //3.2准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      //4.准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // console.log(order_number);
      //5 发起预支付接口请求
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST",data: { order_number } });
      // console.log(pay);
      //6 发起微信支付
      await requestPayment(pay);
      //7 查询后台订单状态 是否支付成功
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", header: header, data: { order_number } });
      // console.log(res);
      await showToast({ title: "支付成功!" })
      //8. 手动删除购物车中的数据 选中的cart数据
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      //8. 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({ title: "支付失败!" })
    }
  }
})


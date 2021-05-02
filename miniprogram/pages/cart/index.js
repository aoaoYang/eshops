// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"

//1点击收货地址添加的点击事件绑定
  //2获取当前收货地址 wx的api  wx.chooseAddress
  //3 获取用户对小程序所授予 获取地址的权限 状态 scope
  //  3.1 假设 用户点击获取提示框选择确定 authSetting scope.address scope值true  
  //   3.2假设 用户从来没有调用过 收货地址的api scope值undefine  
  //   直接调用api
  //   3.3 假设 用户点击获取提示框选择取消 scope值false
  //  诱导用户打开授权设置界面，重新授予权限 调用api 否则提示授权失败  
  //  4.获取到的收货地址存入本地存储中
//2 页面加载完毕 onload onshow
   //1.获取本地存储地址数据
   //2.把数据 设置给data中的变量
// 3.onshow 获取缓存中的购物车数组
   //0. 商品详情页面，第一次添加商品到购物车,新增属性
   //num=1 checked=true
   //1.获取缓存中的购物车数组
   //2.把购物车数据填充到data中
// 4.全选的实现 数据的展示
  // 1. onShow 获取缓存中的购物车数组
  // 2.根据购物车的商品数据计算 所有商品选中{checked=true} 否则为false
// 5.总价格和总数量
  //1.需要商品选中，才进行计算
  //2.获取购物车数组
  //3.遍历 
  //4.判断商品是否选中 {选中：总价格+=商品的单价*商品的数量  总数量+=商品的数量}
  //5.计算后的价格和数量 设置回data即可
//6.商品的选中
  //1.绑定change事件
  //2.获取被修改的商品对象
  //3.商品对象的选中状态 取反
  //4.重新填充回data中和缓存中
  //5.重新计算全选 总价格 总数量
//7.全选和反选
  //1.全选复选框绑定 chnage事件
  //2.获取data中的全选变量 allChecked
  //3.直接取反 allChecked=!allChecked
  //4.遍历购物车数组 让里面的商品选中状态跟随 allChecked改变而改变
  //5.把购物车数组和选中allChecked 状态重新设置回data中 把购物车重新设置回缓存中
//8. 商品数量的编辑功能和删除
  //1."+" "-" 按钮绑定同一个点击事件 区分关键 在于自定义属性
    //"+" "+1" "-" "-1"
  //2.传递被点击的商品id goods_id
  //3.获取data中的购物车数组 id获取需要被修改的商品对象
    //当购物车的数量=1 同时用户点击"-"
    //1.弹框提示，询问是否删除，否则不做操作 showModel
    //2.确定删除，进行删除选项  cart.splice(index,1); this.setCart(cart);
  //4.直接修改商品的数量属性 num
  //5.把 cart数组重新设置回缓存和data中 this.setCart
//9.点击结算
  //判断有无收货地址信息
  //判断用户有无选购商品
  //3.经过以上的验证，跳转到支付页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收货地址
    address:{},
    //缓存中的购物车数组
    cart:[],
    //全选
    allChecked:false,
    //总价格
    totalPrice:0,
    //总数量
    totalNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function(){
    //1.获取缓存收货地址
    const address=wx.getStorageSync('address');
    //获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    //1.计算全选
    //every 数组方法 会遍历 接收一个回调函数 每一个回调函数都返回true，那么every 返回值为 true,否则不再执行返回为false
    //空数组调用 every,返回值为true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({address});
    this.setCart(cart);
  },
  
  async handleChooseAddress(){
    // console.log("address add");
  try{
    //1.获取权限 状态
    const res1=await getSetting();
    const scopeAddress= res1.authSetting["scope.address"];
    //2.判断状态 失败诱导用户打开授权设置界面 否则调用api
    if(scopeAddress===false){
      await openSetting();
    }
    //3.调用收货地址 api
    const address=await chooseAddress();
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
    // console.log(address);
    //4.获取的地址存入本地缓存
    wx.setStorageSync('address', address)
  }
  catch(err){
    console.log(err);
  }

  // wx.getSetting({
  //   success:(result)=>{
  //     //获取权限状态 属性名怪异 都要使用[]形式来获取属性值
  //     const scopeAddress= result.authSetting["scope.address"];
  //     if(scopeAddress===false){   //拒绝授权，打开提示框
  //       wx.openSetting({
  //         withSubscriptions: true,
  //       })
  //     }
  //     wx.chooseAddress({
  //     success: (res)=> {
  //       console.log(res);
  //     }
  //     })
  // console.log(result);
  },
  //商品的选中 
  handleItemChange(e){
    //1.获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    // console.log(goods_id);
    //2.获取购物车数组
    let {cart}=this.data;
    //3.找到被修改的商品对象通过id
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //4.选中状态取反
    cart[index].checked=!cart[index].checked;
    //5. 6.把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
     let allChecked=true;
     //总价格 总数量
     let totalPrice=0;
     let totalNum=0;
     cart.forEach(v=>{
       if(v.checked){
         totalPrice +=v.num*v.goods_price;
         totalNum +=v.num;
       }
       else{
         allChecked=false;
       }
     })
     //判断数组是否为空
     allChecked=cart.length!=0?allChecked:false;
     this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  //商品全选功能
  handleItemAllCheck(e){
  //1获取data中的数据
  let {cart,allChecked}=this.data;
  //2修改值
  allChecked=!allChecked;
  //3循环修改cart数组中的商品选中状态
  cart.forEach(v=>v.checked=allChecked);
  //4.把修改后的值填充回data或者缓存中
  this.setCart(cart);
  },
  //商品数量的编辑功能
  async handleItemNumEdit(e){
  //1.获取传递过来的参数
  const {operation,id}=e.currentTarget.dataset;
  // console.log(operation,id);
  //2.获取购物车数组
  let {cart}=this.data;
  //3.找到需要修改商品的索引
  const index=cart.findIndex(v =>v.goods_id===id);
  //4.修改之前判断是否要执行删除
  if(cart[index].num===1 && operation===-1){
    //4.1弹窗提示
    const res=await showModal({content:"您是否要删除该商品？"});
    if (res.confirm) {
      cart.splice(index,1);
      this.setCart(cart);
      // console.log('用户点击确定')
    } 
  }else{
 //4进行修改数量
 cart[index].num+=operation;
 //5.设置回缓存和data中
 this.setCart(cart);
  }
},
//点击结算功能
async handlePay(){
  console.log("pay click");
  const {address,totalNum}=this.data;
  //1.判断收货地址
  if(!address.userName){
    await showToast({title:"您还没有选择收货地址!"});
    return;
  }
  //2.判断用户有没有选购商品
  if(totalNum===0){
    await showToast({title:"您还没有选购商品!"});
    return;
  }
  //3.跳转到支付页面
  wx.navigateTo({
    url: '/pages/pay/index',
  });
}
})
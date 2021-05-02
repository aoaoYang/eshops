// pages/search/index.js
/*
1. 输入框绑定事件 值改变input事件
   1.获取到输入框的值
   2.合法性的判断 
   3.检验通过 把输入框的值 发送到后台
   4.返回的数据打印到页面上
2.防抖  定时器 节流
  0.防抖 一般用于输入框中 防止重复输入 重复发送请求
  1.节流 一般是用于页面下拉和上拉 
  1.定义一个全局的定时器id
*/
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //取消 按钮 是否显示
    isFoucs:false,
    //输入框的值
    inputValue:""
  },
  TimeId:-1,
  //输入框的值改变就会触发的事件
  handleInput(e){
     console.log(e);
    //1 获取输入框的值
    const {value}=e.detail;
    //2 检测合法性 为空时清空数组 隐藏取消按钮
    if(!value.trim()){
      this.setData({
        goods:[],
        isFoucs:false
      })
      return;
    }
    //3 发送请求，获取数据
    this.setData({
      isFoucs:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  async qsearch(query){
   const res=await request({url:"/goods/qsearch",data:{query}});
   console.log(res);
   this.setData({
    goods:res
   })
  },
  //点击取消 重置和清空搜索数据
  handleCancel(){
   this.setData({
    inputValue:"",
    isFoucs:false,
    goods:[]
   })
  }
})
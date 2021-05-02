// pages/auth/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../libs/runtime/runtime";
import { login } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async handleGetUserInfo(e){
  try {
    //1 获取用户信息
      const {encryptedData,rawData,iv,signature}=e.detail;
    //2 获取成功登录后的code
    const {code}=await login();
    const loginParams= {encryptedData,rawData,iv,signature,code};
    // console.log(code);
    //3 发送请求 获取用户的token值
    const {token} =await request({url:"/users/wxlogin",data:loginParams,method:"post"})
    console.log(token);//需要企业微信权限才能生效
    //4.把 token存储到缓存中,同时跳转回上个页面
    wx.setStorageSync("token", token);
    //for test token
    // wx.setStorageSync("token", "021xRW7i11b5Ev0uiSC7i1SL48i1xRW7Q");
    wx.navigateBack({
        delta: 1
      });
  } catch (error) {
    console.log(error);
  }
  }
})
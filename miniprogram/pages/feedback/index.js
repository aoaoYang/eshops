// pages/feedback/index.js
/*
1. 点击“+” 触发tap点击事件
  1.调用小程序内置的 选择图片 api
  2.获取到 图片的路径 数组
  3.把图片路径 存到 data变量中
  4.页面根据图片数组进行循环显示 自定义组件
2. 点击自定义图片组件删除
  1.获取被点击元素的索引
  2.获取data中的图片数组
  3.根据索引 数组中删除对应的元素
  4.把数组重新设置回data中

3. 点击"提交"按钮
  1.获取文本域的内容 类似 输入框的获取
    1.data中定义变量 表示输入框内容
    2.文本域 绑定 输入事件 事件触发把输入的值存入到变量中
  2.对这些内容 合法性验证 文本为空时不合法
  3.验证通过 用户选择的图片上传专门的图片服务器中 返回图片外网的链接
     1.遍历图片数组
     2.挨个依次上传
     3.维护图片数组 存放图片 上传后的外网链接 
  4.文本域的内容 和外网图片的路径一起提交到服务器中 前端模拟，不会发送请求到后台 或云数据库
  5.提交成功 清空当前页面
  6.返回上一页
*/


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImagesUrl: [],
    // 文本域的内容
    textVal: "",
    // 图片上传云存储的fileID
    fileID: [],
    tempImgs: []
  },
  //外网images
  UploadImgs: [],
  // 点击标题事件，从子组件传递过来的
  handleTabsItemChange(e) {
    console.log(e);
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组 产生选中效果
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3  赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击"+" 选择图片事件
  handleChooseImg() {
    //2.调用小程序内置选择图片的api
    wx.chooseImage({
      //同时选中图片的数量
      count: 9,
      //图片的格式 原图 和压缩
      sizeType: ['original', 'compressed'],
      //图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          //图片数组进行拼接 多次选中图片
          chooseImagesUrl: [...this.data.chooseImagesUrl, ...result.tempFilePaths]
        })
      },
    });

  },
  //点击自定义图片组件
  handleRemoveImg(e) {
    //2 获取被点击组件的索引
    const { index } = e.currentTarget.dataset;
    //  console.log(index);
    //3 获取data中的图片数组
    let { chooseImagesUrl } = this.data;
    //4 删除元素
    chooseImagesUrl.splice(index, 1);
    //5 删除后重新赋值
    this.setData({
      chooseImagesUrl
    })
  },
  //文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })

  },
  //提交按钮点击事件
  handleFormSubmit() {
    //1.获取文本域的内容 图片数组
    const { textVal, chooseImagesUrl } = this.data;
    //2.合法性的验证
    if (!textVal.trim()) {
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    //3.上传图片到专门的服务器
    // 上传文件的api 不支持多文件同时上传 遍历数组 挨个异步上传

    wx.showLoading({
      title: "正在上传中...",
      mask: true
    });
    //判断有没有需要上传的图片数组
    if(chooseImagesUrl.length !=0){
          // 显示正在等待的图片

      //  chooseImagesUrl.forEach((v, i) => {
        // wx.uploadFile({
        //   //图片上传到哪里
        //   url: 'https://img.coolcr.cn/api/upload',
        //   //被上传的文件路径
        //   filePath: v,
        //   //上传文件的名称 后台来获取文件 file
        //   name: "file",
        //   //顺带的文本信息
        //   formData: {},
        //   success: (result) => {
        //     console.log(result);
        //     let url = JSON.parse(result.data).url;
        //     this.UploadImgs.push(url);
        //     console.log(this.UploadImgs);
        //     //所有图片都上传完毕才触发
        //     if (i === chooseImagesUrl.length - 1) {
        //       wx.hideLoading();
        //       console.log("文本内容和外网图片数组 提交到后台中");
        //       //提交都成功了
        //       //重置页面
        //       this.setData({
        //         textVal: "",
        //         chooseImagesUrl: []
        //       })
        //       //返回上一个页面
        //       wx.navigateBack({
        //         delta: 1
        //       });
        //     }
        //   },
        // });

        // 循环上传图片
        for(let i=0;i<chooseImagesUrl.length;i++){
          let extName = chooseImagesUrl[i].match(/(?<=\.)([^\.]+)$/g)[0];
          let cloudPath="eshops/"+new Date().getTime() + "." + extName;
          wx.cloud.uploadFile({
            cloudPath:cloudPath,
            filePath:chooseImagesUrl[i],
          success: res=>{
              console.log(res);
              // let url = JSON.parse(res.fileID).url;
              // this.UploadImgs.push(url);
              console.log("上传成功",res.fileID);
              // this.setData({
              //   fileID:[,...this.data.fileID.push(res.fileID)]
              // })
              //所有图片都上传完毕才触发
              // if (i===chooseImagesUrl.length-1){
                console.log("文本内容和外网图片数组 提交到后台中");
                //提交都成功了 显示云存储上的图片 getTempFileURL
                // const { fileID } = this.data;
                // console.log("fileID",fileID);
                wx.cloud.getTempFileURL({
                  fileList:[res.fileID],
                  success:res=>{
                    // console.log("fileID1",fileID);
                    console.log("111",res.fileList);
                    
                    this.setData({
                      tempImgs:[...this.data.tempImgs,...res.fileList],
                      //  fileID:[...this.data.fileID,...tempImgs.tempFileURL]
                    })
                     this.data.fileID.push(this.data.tempImgs[i].tempFileURL)
                     const {tempFileURL}=this.data.tempImgs[i];
                   console.log("解构：",tempFileURL);
                   this.setData({
                    fileID: [,...this.data.fileID.push(tempFileURL)]
                   })
                  //  console.log(fileID);
                  },fail:err=>{console.log(err);},
                  complete:()=>{
                    wx.hideLoading();
                  }
                })
            }
            }
          )
        }
          //重置页面
          this.setData({
            textVal: "",
            chooseImagesUrl: [],
          })
          //返回上一个页面
          wx.navigateBack({
            delta: 1
          });
    } else{
      // wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }
  }
})
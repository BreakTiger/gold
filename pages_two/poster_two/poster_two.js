const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',
    img: ''
  },


  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getData()
  },

  getData: function () {
    let that = this
    let data = {
      userid: that.data.id
    }
    http.sendRequest('huishou.userma', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        let detail = res.list
        wx.showLoading({
          title: '正在生成海报，请稍后',
          mask: true
        })
        const ctx = wx.createCanvasContext('shareCanvas');
        // 判断
        if (detail.shop.shopname) {
          console.log('店铺')
          ctx.drawImage('../../img/poster.png', 0, 0, 375, 576.5);
          wx.downloadFile({
            url: detail.avatar,
            success: function (res) {
              let img1 = res.tempFilePath
              console.log(img1)
              wx.downloadFile({
                url: detail.shop.logo,
                success: function (res) {
                  let img2 = res.tempFilePath
                  console.log(img2)
                  wx.downloadFile({
                    url: detail.ims,
                    success: function (res) {
                      let img3 = res.tempFilePath

                      // 用户名
                      ctx.setFontSize(15) //文字大小
                      ctx.setFillStyle('#FF5E10') //文字颜色
                      ctx.fillText(detail.nickname, 95, 50, 100)

                      ctx.setFontSize(15) //文字大小
                      ctx.setFillStyle('#333333') //文字颜色
                      ctx.fillText('邀您进入店铺', 200, 50)

                      // 用户联系
                      ctx.setFontSize(12) //文字大小
                      ctx.setFillStyle('#666666') //文字颜色
                      ctx.fillText('联系方式:' + detail.mobile, 95, 80)

                      // 店铺图片
                      ctx.drawImage(img2, 35, 100, 296, 152);

                      // 店铺名
                      ctx.setFontSize(16) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText(detail.shop.shopname, 35, 280, 296)

                      // 电话
                      ctx.setFontSize(16) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText('电话：' + detail.shop.mobile, 35, 320, 296)

                      // 地址
                      ctx.setFontSize(16) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText('地址：' + detail.shop.province + detail.shop.city + detail.shop.area + detail.shop.address, 35, 350, 296)

                      //经营范围
                      ctx.setFontSize(15) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText('经营范围：', 35, 380)

                      ctx.setFontSize(13) //文字大小
                      ctx.setFillStyle('#FF5E10') //文字颜色
                      ctx.fillText(detail.categoryList, 35, 410)

                      // 提示
                      ctx.setFontSize(15) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText('黄金回购', 35, 520)

                      ctx.setFontSize(13) //文字大小
                      ctx.setFillStyle('#000000') //文字颜色
                      ctx.fillText('长按小程序识别', 35, 540)

                      //分享码
                      ctx.drawImage(img3, 250, 480, 87, 87);

                      // 用户头像 - 圆型
                      //绘制的头像宽度
                      let avatarurl_width = 48
                      //绘制的头像高度
                      let avatarurl_heigth = 48
                      //绘制的头像在画布上的位置
                      let avatarurl_x = 35
                      //绘制的头像在画布上的位置
                      let avatarurl_y = 35
                      // ctx.save()
                      ctx.beginPath()
                      ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
                      ctx.clip()
                      ctx.drawImage(img1, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
                      //输出
                      ctx.draw();//draw()的回调函数
                    }
                  })
                }
              })
            }
          })
        } else {
          console.log('个人')
          ctx.drawImage('../../img/poster_one.png', 0, 0, 375, 576.5);
          wx.downloadFile({
            url: detail.avatar,
            success: function (res) {
              let img1 = res.tempFilePath
              wx.downloadFile({
                url: detail.ims,
                success: function (res) {
                  let img2 = res.tempFilePath
                  // 用户名
                  ctx.setFontSize(15) //文字大小
                  ctx.setFillStyle('#FF5E10') //文字颜色
                  ctx.fillText(detail.nickname, 95, 150, 100)

                  ctx.setFontSize(15) //文字大小
                  ctx.setFillStyle('#333333') //文字颜色
                  ctx.fillText('邀您进入店铺', 200, 150)

                  // 用户联系
                  ctx.setFontSize(12) //文字大小
                  ctx.setFillStyle('#666666') //文字颜色
                  ctx.fillText('联系方式:' + detail.mobile, 130, 180)

                  //经营范围
                  ctx.setFontSize(15) //文字大小
                  ctx.setFillStyle('#000000') //文字颜色
                  ctx.fillText('经营范围：', 50, 240)

                  ctx.setFontSize(13) //文字大小
                  ctx.setFillStyle('#FF5E10') //文字颜色
                  ctx.fillText(detail.categoryList, 50, 280, 600)

                  // 提示
                  ctx.setFontSize(13) //文字大小
                  ctx.setFillStyle('#000000') //文字颜色
                  ctx.fillText('长按小程序识别', 150, 490)

                  //分享码
                  ctx.drawImage(img2, 150, 380, 87, 87);

                  // 用户头像 - 圆型
                  //绘制的头像宽度
                  let avatarurl_width = 75
                  //绘制的头像高度
                  let avatarurl_heigth = 75
                  //绘制的头像在画布上的位置
                  let avatarurl_x = 150
                  //绘制的头像在画布上的位置
                  let avatarurl_y = 50
                  // ctx.save()
                  ctx.beginPath()
                  ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
                  ctx.clip()
                  ctx.drawImage(img1, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
                  //输出
                  ctx.draw();//draw()的回调函数 
                }
              })
            }
          })

        }
        setTimeout(() => {
          wx.hideLoading()
        }, 1500);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 保存图片
  save: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 576.5,
      destWidth: 750,
      destHeight: 1153,
      canvasId: 'shareCanvas',
      success: function (res) {
        let path = res.tempFilePath
        console.log(path)
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: function (res) {
            modal.showToast('保存成功')
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '海报保存失败，请检查小程序是否授权保存图片',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    withSubscriptions: true,
                  })
                }
              }
            })
          }
        })
      }
    })
  }


})
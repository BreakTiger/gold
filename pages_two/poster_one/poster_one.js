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
      shopid: that.data.id
    }
    http.sendRequest('huishou.shopma', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        let detail = res.list
        wx.showLoading({
          title: '正在生成海报',
          mask: true
        })
        that.canvas(detail)
        setTimeout(() => {
          wx.hideLoading()
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 画布
  canvas: async function (detail) {

    // 合成
    const ctx = wx.createCanvasContext('shareCanvas');

    ctx.drawImage('../../img/poster.png', 0, 0, 347.5, 565.5);  //绘制背景图

    // 用户头像
    await wx.downloadFile({
      url: detail.avatar,
      success: function (res) {
        let img1 = res.tempFilePath
        wx.downloadFile({
          url: detail.logo,
          success: function (res) {
            let img2 = res.tempFilePath
            wx.downloadFile({
              url: detail.ims,
              success: function (res) {
                let img3 = res.tempFilePath

                // 用户名
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色
                ctx.fillText(detail.nickname, 80, 35, 100)

                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#333333') //文字颜色
                ctx.fillText('邀您进入店铺', 200, 35)

                // 用户联系
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#666666') //文字颜色
                ctx.fillText('联系方式:' + detail.mobile, 80, 65)

                // 店铺图片
                ctx.drawImage(img2, 20, 85, 296, 152);


                // 电话
                ctx.setFontSize(16) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('电话：' + detail.shopmobile, 20, 300, 296)

                // 地址
                ctx.setFontSize(16) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('地址：' + detail.province + detail.city + detail.area + detail.address, 20, 330, 296)

                ctx.setFontSize(16) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(detail.address, 55, 360, 296)

                //经营范围
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('经营范围：', 20, 390)

                var text = detail.categoryList;
                var chr = text.split("");//这个方法是将一个字符串分割成字符串数组 
                var temp = "";
                var row = [];

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色

                for (var a = 0; a < chr.length; a++) {
                  if (ctx.measureText(temp).width < 280) {
                    temp += chr[a];
                  } else {
                    a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                    row.push(temp); temp = "";
                  }
                }

                row.push(temp); //如果数组长度大于2 则截取前两个

                if (row.length > 2) {
                  var rowCut = row.slice(0, 2);
                  var rowPart = rowCut[1];
                  var test = "";
                  var empty = [];
                  for (var a = 0; a < rowPart.length; a++) {
                    if (ctx.measureText(test).width < 250) {
                      test += rowPart[a];
                    } else {
                      break;
                    }
                  }

                  empty.push(test);

                  var group = empty[0] + "..."//这里只显示两行，超出的用...表示
                  rowCut.splice(1, 1, group);
                  row = rowCut;
                }

                for (var b = 0; b < row.length; b++) {
                  ctx.fillText(row[b], 20, 420 + b * 30, 296);
                }

                // 提示
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(app.globalData.app_name, 20, 490)

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('长按小程序识别', 20, 520)

                // //分享码
                ctx.drawImage(img3, 230, 450, 87, 87);

                // 店铺名
                ctx.font = "normal bold 16px sans-serif"
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(detail.shopname, 20, 270, 296)

                // 用户头像 - 圆型
                //绘制的头像宽度
                let avatarurl_width = 48
                //绘制的头像高度
                let avatarurl_heigth = 48
                //绘制的头像在画布上的位置
                let avatarurl_x = 20
                //绘制的头像在画布上的位置
                let avatarurl_y = 20
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
  },

  // 保存图片
  save: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 347.5,
      height: 565.5,
      destWidth: 347.5 * wx.getSystemInfo().pixelRatio,
      destHeight: 565.5 * wx.getSystemInfo().pixelRatio,
      canvasId: 'shareCanvas',
      quality: 1,
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
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    // 分享参数:
    uid: '',
    shopid: '',

    id: '',
    detail: {},
    shad: false,
    shads: false,
    share_img: '',
    markers: [],
    showmore: false,
    login: false //登录窗状态
  },

  onLoad: function (options) {
    // 分享
    if (options.shopid) {
      that.setData({
        shopid: options.shopid
      })
    }

    this.setData({
      id: options.id
    })
    this.getDeatil()
  },

  getDeatil: async function () {
    let that = this
    let data = {
      id: that.data.id
    }
    await http.sendRequest('huishou.getshopxing', 'post', data).then(function (res) {
      let detail = res.list
      detail.level = parseInt(detail.fenshu)
      // console.log(detail)
      if (res.error == 0) {
        that.setData({
          detail: res.list,
          markers: [
            {
              id: 1,
              latitude: res.list.lat,
              longitude: res.list.lng,
            }
          ]
        })
      } else {
        modal.showToast(res.messages, 'none')
      }
    })
  },

  //评论
  toComment: function () {
    modal.navigate('/pages_one/comment/comment?id=', this.data.id)
  },

  //导航
  toLocation: function () {
    let detail = this.data.detail
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.openLocation({
          latitude: Number(detail.lat),
          longitude: Number(detail.lng),
          scale: 28,
          name: detail.province + detail.city + detail.area + detail.address
        })
      },
      fail: function (error) {
        console.log(error)
        modal.showToast('获取定位失败，请检查手机是否开启定位功能,或小程序是否授权定位', 'none')
      }
    })
  },

  // 现在预约
  toOrder: function () {
    let openid = wx.getStorageSync('openid')
    if (openid) {
      modal.navigate('/pages_one/shop_order/shop_order?shopname=', this.data.detail.shopname + '&id=' + this.data.detail.id + '&times=' + this.data.detail.yingyetime)
    } else {
      this.setData({
        login: true
      })
    }
  },

  //登录窗
  logined: function () {
    this.setData({
      login: true
    })
  },

  //登录
  getAddGrug: function (e) {
    this.setData({
      login: e.detail.login
    })
    let openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    if (openid) {
      this.getDeatil()
    }
  },

  //分享
  toShare: function () {
    this.setData({
      shad: true
    })
  },

  // 关闭
  close_share: function () {
    this.setData({
      shad: false,
      shads: false
    })
  },

  // 分享海报
  toShare_img: function () {
    this.setData({
      shad: false,
      shads: true
    })
    this.canvass()
  },

  // 合成画布
  canvass: function () {
    let that = this
    let detail = that.data.detail
    wx.showLoading({
      title: '正在生成海报，请稍后',
      mask: true
    })
    // 合成
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage('../../img/poster.png', 0, 0, 345, 501.5);  //绘制背景图

    wx.downloadFile({
      url: detail.avatar,
      success: function (res) {
        let img1 = res.tempFilePath
        wx.downloadFile({
          url: detail.image[0],
          success: function (res) {
            let img2 = res.tempFilePath
            wx.downloadFile({
              url: detail.ims,
              success: function (res) {
                let img3 = res.tempFilePath
                // 用户名
                ctx.setFontSize(14) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色
                ctx.fillText(detail.nickname, 90, 40, 100)

                ctx.setFontSize(14) //文字大小
                ctx.setFillStyle('#333333') //文字颜色
                ctx.fillText('邀您进入店铺', 200, 40)

                // 用户联系
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#666666') //文字颜色
                ctx.fillText('联系方式:' + detail.mobile, 90, 65)

                // 店铺图片
                ctx.drawImage(img2, 32, 80, 280, 138);

                // 店铺名
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(detail.shopname, 35, 250, 296)

                // 电话
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('电话：' + detail.mobile, 35, 280, 296)

                // 地址
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('地址：' + detail.province + detail.city + detail.area, 35, 300, 296)

                // 经营
                let texts = ''
                let list = detail.management_text
                // console.log('经营类目', list)
                list.forEach(function (item) {
                  // console.log(item)
                  texts += item + ','
                })
                console.log(texts.substring(0, texts.length - 1))
                //经营范围
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('经营范围：', 35, 340)

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色
                ctx.fillText(texts.substring(0, texts.length - 1), 35, 365)

                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('黄金回购', 35, 440)

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('长按小程序识别', 35, 460)

                //分享码
                ctx.drawImage(img3, 230, 400, 81, 81);

                // 用户头像 - 圆型
                //绘制的头像宽度
                let avatarurl_width = 43.5
                //绘制的头像高度
                let avatarurl_heigth = 43.5
                //绘制的头像在画布上的位置
                let avatarurl_x = 30
                //绘制的头像在画布上的位置
                let avatarurl_y = 25
                // ctx.save()
                ctx.beginPath()
                ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
                ctx.clip()
                ctx.drawImage(img1, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
                //输出
                ctx.draw();
              }
            })
          }
        })
      }
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1500);
  },

  // 保存
  toSave: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 345,
      height: 501.5,
      destWidth: 690,
      destHeight: 1003,
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
            modal.showToast('保存失败', 'none')
          }
        })
      }
    })
  },

  // 预览
  toPreview: function (e) {
    let that = this
    let url = e.currentTarget.dataset.urls
    let item = e.currentTarget.dataset.item
    modal.bigimg(url, item)
  },

  mores: function () {
    let that = this
    let type = that.data.showmore
    if (type) {
      this.setData({
        showmore: false
      })
    } else {
      this.setData({
        showmore: true
      })
    }
  },

  //分享
  onShareAppMessage: function (res) {
    this.setData({
      shad: false
    })
    if (res.from === 'button') {
      return {
        title: this.data.detail.shopname,
        path: '/pages_one/shop_detail/shop_detail?id=' + this.data.id + '&shopid=' + this.data.id
      }
    }
  }
})
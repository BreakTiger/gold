const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {

    // 扫码获得参数:
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
    //小程序码扫码进入
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      console.log('小程序码参数：', scene);
      let param = scene.split('&')
      console.log(param)
      let arr = []
      for (var i in param) {
        arr = param[i].split("=");
      }
      console.log(arr[1])
      this.setData({
        id: arr[1],
        shopid: arr[1]
      })
      this.getDeatil()
    } else {
      // 分享
      if (options.shopid) {
        this.setData({
          shopid: options.shopid
        })
      }

      this.setData({
        id: options.id
      })
      this.getDeatil()
    }
  },

  getDeatil: async function () {
    let that = this
    let data = {
      id: that.data.id
    }
    await http.sendRequest('huishou.getshopxing', 'post', data).then(function (res) {
      let detail = res.list
      detail.level = parseInt(detail.fenshu)
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
  toShare_img: async function () {
    this.setData({
      shad: false,
      shads: true
    })
    wx.showLoading({
      title: '正在生成海报',
      mask: true
    })

    await this.canvass()

    setTimeout(() => {
      wx.hideLoading()
    }, 2500);
  },

  // 画布 - 合成海报
  canvass: function () {
    let that = this
    let detail = that.data.detail
    // 合成
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage('../../img/poster.png', 0, 0, 315, 516);  //绘制背景图

    // 下载 头像 店铺图 + 小程序码
    wx.downloadFile({
      url: detail.avatar,
      success: function (res) {
        let img1 = res.tempFilePath //头像
        wx.downloadFile({
          url: detail.image[0],
          success: function (res) {
            let img2 = res.tempFilePath //店铺图
            wx.downloadFile({
              url: detail.ims,
              success: function (res) {
                let img3 = res.tempFilePath //小程序码

                // 用户名
                ctx.setFontSize(14) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色
                ctx.fillText(detail.nickname, 80, 35, 100)

                ctx.setFontSize(14) //文字大小
                ctx.setFillStyle('#333333') //文字颜色
                ctx.fillText('邀您进入店铺', 200, 35)

                // 用户联系
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#666666') //文字颜色
                ctx.fillText('联系方式:' + detail.mobile, 80, 55)

                // // 店铺图片
                ctx.drawImage(img2, 20, 75, 269.5, 139);


                // 电话
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('电话：' + detail.shopmobile, 20, 260, 269.5)

                // 地址
                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('地址：' + detail.province + detail.city + detail.area, 20, 280)

                ctx.setFontSize(12) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(detail.address, 55, 300, 269.5)

                //经营范围
                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('经营范围：', 20, 330)

                // 经营
                let texts = ''
                let list = detail.management_text
                list.forEach(function (item) {
                  texts += item + ','
                })
                console.log(texts.substring(0, texts.length - 1))

                // 文本换行
                var text = texts.substring(0, texts.length - 1);
                var chr = text.split("");//这个方法是将一个字符串分割成字符串数组 
                var temp = "";
                var row = [];

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#FF5E10') //文字颜色

                for (var a = 0; a < chr.length; a++) {
                  if (ctx.measureText(temp).width < 250) {
                    temp += chr[a];
                  } else {
                    a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                    row.push(temp);
                    temp = "";
                  }
                }

                row.push(temp); //如果数组长度大于2 则截取前两个

                console.log(row)

                if (row.length > 2) {
                  var rowCut = row.slice(0, 2);
                  var rowPart = rowCut[1];
                  var test = "";
                  var empty = [];

                  for (var a = 0; a < rowPart.length; a++) {
                    if (ctx.measureText(test).width < 220) {
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
                  ctx.fillText(row[b], 20, 365 + b * 30, 269.5);
                }

                ctx.setFontSize(15) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(app.globalData.app_name, 20, 440)

                ctx.setFontSize(13) //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText('长按小程序识别', 20, 460)

                //分享码
                ctx.drawImage(img3, 210, 400, 81, 81);

                // 店铺名
                ctx.font = "normal bold 15px sans-serif" //文字大小
                ctx.setFillStyle('#000000') //文字颜色
                ctx.fillText(detail.shopname, 20, 240, 269.5)

                // 用户头像 - 圆型
                //绘制的头像宽度
                let avatarurl_width = 43.5
                //绘制的头像高度
                let avatarurl_heigth = 43.5
                //绘制的头像在画布上的位置
                let avatarurl_x = 20
                //绘制的头像在画布上的位置
                let avatarurl_y = 20
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
  },

  // 保存  315, 516
  toSave: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 315,
      height: 516,
      destWidth: 315 * wx.getSystemInfo().pixelRatio,
      destHeight: 516 * wx.getSystemInfo().pixelRatio,
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
    let title = '[' + app.globalData.app_name + ']' + ' ' + this.data.detail.shopname + ' ' + app.globalData.gold_price + '克/元'
    console.log('分享名称：', title)
    this.setData({
      shad: false
    })
    if (res.from === 'button') {
      return {
        title: title,
        imageUrl: this.data.detail.image[0],
        path: '/pages_one/shop_detail/shop_detail?id=' + this.data.id + '&shopid=' + this.data.id
      }
    }
  },

  onShareTimeline: function (res) {
    let title = '[' + app.globalData.app_name + ']' + ' ' + this.data.detail.shopname + ' ' + app.globalData.gold_price + '克/元'
    console.log('分享名称：', title)
    return {
      title: title,
      query: {
        id: this.data.id,
        shopid: this.data.id
      },
      imageUrl: this.data.detail.image[0]
    }
  }
})
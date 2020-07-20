const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',
    detail: {},
  },


  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDeatil()
  },

  getDeatil: function () {
    let that = this
    let data = {
      id: that.data.id
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.getshopxing', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          detail: res.list
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
      }
    })
  },

  // 现在预约
  toOrder: function () {
    console.log(this.data.detail)
    modal.navigate('/pages_one/shop_order/shop_order?shopname=', this.data.detail.shopname + '&id=' + this.data.detail.id)
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: this.data.detail.shopname,
        path: '/pages_one/shop_detail/shop_detail?id=' + this.data.id
      }
    }
  }



})
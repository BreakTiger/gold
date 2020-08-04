const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    id: '',

    detail: {}
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
      id: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.getorder', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          detail: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  // 确定
  toFinish: function () {
    let that = this
    console.log(that.data.detail)
    let data = {
      shopid: that.data.detail.store_id,
      orderid: that.data.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.editshopOrder', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        modal.showToast('到店成功')
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },
})
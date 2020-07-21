const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',
    detail: {}
  },

  onLoad: function (options) {
    // console.log(options)
    this.setData({
      id: options.id
    })
    this.getDetail()
  },

  //详情
  getDetail: function () {
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

  // 完成
  toFinish: function () {
    let that = this
    console.log(111)
    let data = {
      id: that.data.detail.id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.complete', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        modal.showToast(res.message, 'none')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }

})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    status: 1,
    shop_status: {}, //店铺申请入驻状态
    step: 0,
    content:''
  },

  onLoad: function (options) {
    this.getType()
  },

  //入驻状态
  getType: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.getshenhe', 'post', data).then(function (res) {
      // console.log(res)
      if (res.error == 0) {
        that.setData({
          shop_status: res.list.shop_status,
          content: res.list.shop_status.content_error
        })
        if (res.list.shop_status.status) {
          that.setData({
            step: 2
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //申请
  getApply: function (e) {
    this.setData({
      step: e.detail.step
    })
    if (e.detail.step == 2) {
      this.getType()
    }
  },

  // 再次申请
  getAgain: function (e) {
    console.log(e.detail)
    this.setData({
      step: e.detail.step,
      shop_status: e.detail.shop_status
    })
  }

})
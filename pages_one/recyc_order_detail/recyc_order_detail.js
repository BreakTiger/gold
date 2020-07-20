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

})
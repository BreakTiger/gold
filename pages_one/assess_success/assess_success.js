const app = getApp()
import modal from '../../modals.js'

Page({

  data: {
    detail: {}
  },

  onLoad: function (options) {
    console.log(JSON.parse(options.data))
    let data = JSON.parse(options.data)
    this.setData({
      detail: data
    })
  },

  // 上门回收
  recyc_one: function () {
    //储存到全局
    app.globalData.putInfo = this.data.detail
    wx.switchTab({
      url: '/pages/recyc/recyc',
    })
  },

  // 到店回收
  recyc_two: function () {
    //储存到全局
    app.globalData.putInfo = this.data.detail
    modal.navigate('/pages_one/nearby/nearby')
  }


})
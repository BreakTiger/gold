const app = getApp()
import modal from '../../modals.js'

Page({

  data: {
    pirce: '',
    count_price: ''
  },

  onLoad: function (options) {
    console.log(JSON.parse(options.data))
    let data = JSON.parse(options.data)
    this.setData({
      price: data.price,
      count_price: data.count_price
    })
  },

  // 上门回收
  recyc_one: function () {
    wx.switchTab({
      url: '/pages/recyc/recyc',
    })
  },

  // 到店回收
  recyc_two: function () {
    modal.navigate('/pages_one/nearby/nearby')
  }

  
})
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
      pirce: data.pirce,
      count_price: data.count_price
    })
  }
})
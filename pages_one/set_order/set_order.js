const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    price: '',
    count_price: ''
  },

  onLoad: function (options) {
    let datas = JSON.parse(options.data)
    this.setData({
      price: datas.price,
      count_price: datas.count_price
    })
  },


})
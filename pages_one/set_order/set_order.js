const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    price: '',
    gram:'',
    count_price: ''
  },

  onLoad: function (options) {
    let datas = JSON.parse(options.data)
    this.setData({
      price: datas.price,
      gram:datas.gram,
      count_price: datas.count_price
    })
  },



})
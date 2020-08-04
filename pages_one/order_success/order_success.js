const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    types: '',
    detail: {}
  },

  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(options.data))
    this.setData({
      types: options.types,
      detail: JSON.parse(options.data)
    })
  },

  //完成
  toFinish: function () {
    app.globalData.putInfo = {}  //清空
    let types = this.data.types
    if (types == 1) {
      console.log('门店')
      modal.navigate('/pages_one/recyc_order_list/recyc_order_list?type=')
    } else {
      console.log('上门')
      modal.navigate('/pages_one/order-list/order-list?type=')
    }

  }


})
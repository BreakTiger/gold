const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    detail: {}
  },


  onLoad: function (options) {
    console.log(JSON.parse(options.data))
    this.setData({
      detail: JSON.parse(options.data)
    })
  },


})
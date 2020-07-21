const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    status: 1,
    step: 0
  },

  onLoad: function (options) {

  },

  //申请
  getApply: function (e) {
    console.log(e)
    this.setData({
      step: e.detail.step
    })
  }

})
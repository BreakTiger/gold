const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {

  },

  methods: {

    //返回首页
    backHome: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})

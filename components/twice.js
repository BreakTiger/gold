const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

Component({

  options: {
    addGlobalClass: true
  },

  properties: {
    status: String,
    content: String
  },

  data: {

  },

  methods: {

    //返回首页
    backHome: function () {
      console.log(this.data.content)
      wx.switchTab({
        url: '/pages/index/index',
      })
    },

    // 再次申请
    apply_again: function () {
      this.triggerEvent('Again', { step: 0, shop_status: [] })
    }
  }
})

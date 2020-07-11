const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    id: ''
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDetail()
  },

  getDetail:function(){
    let that = this
    let data = {
      
    }
  }
  
})
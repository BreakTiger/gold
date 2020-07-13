const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',
    detail: {},
    markers: [
      {

      }
    ]
  },


  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDeatil()
  },

  getDeatil: function () {
    let that = this
    let data = {
      id: that.data.id
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.getshopxing', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          detail: res.list
        })
      } else {
        modal.showToast(res.messages, 'none')
      }
    })
  },


  //导航
  toLocation: function () {
    console.log('导航')
    
  },

  // 现在预约
  toOrder:function(){

  }



})
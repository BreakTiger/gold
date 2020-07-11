const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    page: 1,
    lat: '',
    lng: '',
    list: []
  },


  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 10,
      lat: that.data.lat,
      lng: that.data.lng,
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  //门店详情
  toDetail: function (e) {
    modal.navigate('/pages_one/shop_detail/shop_detail?id=', e.currentTarget.dataset.id)
  },



  
})
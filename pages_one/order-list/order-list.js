const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    nav: [
      {
        text: '全部',
        type: 0
      },
      {
        text: '派单中',
        type: 1
      },
      {
        text: '进行中',
        type: 2
      },
      {
        text: '待评价',
        type: 3
      },
      {
        text: '已取消',
        type: 4
      }
    ],
    choice: 0,

    page: 1,

    list: []
  },


  onLoad: function (options) {
    console.log(options)
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 10,
      status: that.data.choice,
      openid: wx.getStorageSync('openid'),
      type: 1,
      ordertype: 1
    }
    console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //详情
  toDetail: function (e) {
    console.log(e)
    modal.navigate('/pages_one/order-detail/order-detail')
  }

})
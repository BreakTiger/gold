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
        text: '预约中',
        type: 1
      },
      {
        text: '待评价',
        type: 2
      }
    ],
    choice: '',

    page: 1,
    list: []
  },


  onLoad: function (options) {
    console.log(options)
    this.getList()
  },

  //列表
  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 10,
      status: that.data.choice,
      openid: wx.getStorageSync('openid'),
      type: 1,
      ordertype: 2
    }
    console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
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

  toDetail: function (e) {
    modal.navigate('/pages_one/recyc_order_detail/recyc_order_detail?id=', e.currentTarget.dataset.id)
  }


})
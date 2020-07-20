const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    nav: [
      {
        text: '全部',
        status: ''
      },
      {
        text: '派单中',
        status: ''
      },
      {
        text: '进行中',
        status: ''
      },
      {
        text: '待评价',
        status: ''
      },
      {
        text: '已取消',
        status: ''
      }
    ],

    choice: '', //选项

    page: 1,

    list: []
  },


  onLoad: function (options) {
    console.log('状态：', options.type)
    // this.setData({
    //   choice: options.type
    // })
  },

  onShow: function () {
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
    // console.log('参数：', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //取消订单
  toCancel: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    console.log(id)
    console.log(index)
    let data = {
      id: id,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.delorder', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        modal.showToast(res.message)
        let list = that.data.list
        list.splice(index, 1)
        that.setData({
          list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  //完成
  toFinish: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    console.log(id)
    console.log(index)
    let data = {
      id: id,
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.complete', 'post', data).then(function (res) {
      if (res.error == 0) {
        let list = that.data.list
        list.forEach(function (item, indexs) {
          if (indexs == index) {
            item.orderstatus = 2
          }
        })
        that.setData({
          list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //切换
  toSwitch: function (e) {
    console.log(e.currentTarget.dataset.type)
  },

  //详情
  toDetail: function (e) {
    modal.navigate('/pages_one/order-detail/order-detail?id=', e.currentTarget.dataset.id)
  },


  onPullDownRefresh: function () {
    console.log('刷新')
  },

  onReachBottom: function () {
    console.log('到底')
  }

})
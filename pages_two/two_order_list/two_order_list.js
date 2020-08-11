const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    id: '',

    nav: [
      {
        text: '全部',
        type: ''
      },
      {
        text: '已派单',
        type: '1'
      },
      {
        text: '待评价',
        type: '2'
      }
    ],
    choice: '',

    page: 1,
    list: []
  },


  onLoad: function (options) {
    console.log(options)
    this.setData({
      choice: options.type,
      id: options.id
    })
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid'),
      page: that.data.page,
      pagesize: 10,
      ordertype: 1,
      type: 3,
      rid: that.data.id,
      status: that.data.choice
    }
    console.log('参数', data)
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

  // 切换
  toSwitch: function (e) {
    this.setData({
      page: 1,
      choice: e.currentTarget.dataset.type
    })
    this.getList()
  },

  // 详情
  toDetail: function (e) {
    modal.navigate('/pages_two/two_order_list_detail/two_order_list_detail?id=', e.currentTarget.dataset.id)
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.setData({
      page: 1
    })
    that.getList()
  },


  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let page = that.data.page + 1

    let data = {
      openid: wx.getStorageSync('openid'),
      page: page,
      pagesize: 10,
      ordertype: 1,
      type: 3,
      rid: that.data.id,
      status: that.data.choice
    }
    console.log('参数', data)
    http.sendRequest('huishou.orderList', 'post', data).then(function (res) {
      if (res.error == 0) {
        let news = res.list
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.page
          })
        } else {
          modal.showToast('已经到底了哦', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',

    nav: [
      {
        text: '全部',
        type: ''
      },
      {
        text: '已预约',
        type: '0'
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
    this.setData({
      choice: options.type,
      id: options.id
    })
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 10,
      store_id: that.data.id,
      openid: wx.getStorageSync('openid'),
      ordertype: 2,
      type: 2,
      status: that.data.choice
    }
    // console.log('参数', data)
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
    modal.navigate('/pages_two/one_order_list_detail/one_order_list_detail?id=', e.currentTarget.dataset.id)
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
      page: page,
      pagesize: 10,
      store_id: that.data.id,
      openid: wx.getStorageSync('openid'),
      ordertype: 2,
      type: 2,
      status: that.data.choice
    }
    console.log('参数：', data)
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
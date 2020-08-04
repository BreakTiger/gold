const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',

    page: 1,

    list: []
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      shopid: that.data.id,
      openid: wx.getStorageSync('openid'),
      page: this.data.page,
      pagesize: 10,
      type: 2
    }
    console.log('参数：', data)
    http.sendRequest('huishou.evaluate', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
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
    this.getList()
  },

  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let page = that.data.page + 1
    let data = {
      shopid: that.data.id,
      openid: wx.getStorageSync('openid'),
      page: page,
      pagesize: 10,
      type: 2
    }
    console.log('参数：', data)
    http.sendRequest('huishou.evaluate', 'post', data).then(function (res) {
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
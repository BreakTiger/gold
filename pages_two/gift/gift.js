const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: '',

    type: '', //2 店铺  1个人

    page: 1,

    list: []
  },

  onLoad: function (options) {
    let data = JSON.parse(options.data)
    console.log(data)
    this.setData({
      id: data.id,
      type: data.type
    })
    this.getList(data.type)
  },

  getList: function (type) {
    let that = this
    let data = {}
    if (type == 2) {
      data = {
        shopid: that.data.id,
        page: that.data.page,
        pagesize: 10,
        type: that.data.type
      }
    } else {
      data = {
        openid: wx.getStorageSync('openid'),
        type: that.data.type,
        page: that.data.page,
        pagesize: 10
      }
    }
    console.log('参数：', data)
    http.sendRequest('huishou.reward', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
        console.log(res.list)
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
    this.getList(that.data.type)
  },

  onReachBottom: function () {
    let that = this
    let page = that.data.page + 1
    let old = that.data.list
    let type = that.data.type
    let data = {}
    if (type == 2) {
      data = {
        shopid: that.data.id,
        page: that.data.page,
        pagesize: 10,
        type: type
      }
    } else {
      data = {
        openid: wx.getStorageSync('openid'),
        type: type,
        page: that.data.page,
        pagesize: 10
      }
    }
    console.log('参数：', data)
    http.sendRequest('huishou.reward', 'post', data).then(function (res) {
      if (res.error == 0) {
        let news = res.list
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.page
          })
        } else {
          modal.showToast('已经到底', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})
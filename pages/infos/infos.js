const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
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
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.knowledge', 'post', data).then(function (res) {
      // console.log(res)
      if (res.error == 0) {
        that.setData({
          list: res.list
        })
      } else {

      }
    })
  },

  //知识详情
  toInfoDetail: function (e) {
    let id = e.currentTarget.dataset.id
    modal.navigate('/pages_one/infos_detail/infos_detail?id=', id)
  },

  // 下拉刷新
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
    console.log('到底')
    let that = this
    let old = that.data.list
    console.log(old)
    let data = {
      page: that.data.page + 1,
      pagesize: 10,
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.knowledge', 'post', data).then(function (res) {
      if (res.error == 0) {
        let list = res.list
        if (list.length != 0) {
          let news = old.concat(list)
          that.setData({
            list: news,
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
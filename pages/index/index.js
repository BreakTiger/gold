const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    lunbo: [],
    shop: [],
    info: [],

    nav_list: [
      {
        icon: '../../icon/home-1.png',
        text: '上门回收',
        path: ''
      },
      {
        icon: '../../icon/home-2.png',
        text: '门店回收',
        path: ''
      },
      {
        icon: '../../icon/home-3.png',
        text: '以旧换新',
        path: ''
      },
      {
        icon: '../../icon/home-4.png',
        text: '饰品修复',
        path: ''
      }
    ]
  },

  onLoad: function (options) {
    this.getLun()
  },

  //轮播图
  getLun: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 5,
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.luobo', 'post', data).then(function (res) {
      // console.log(res)
      if (res.error == 0) {
        that.setData({
          lunbo: res.list
        })
        that.getShop()
      } else {
        that.modal.showToast(res.message, 'none')
      }
    })
  },

  //门店
  getShop: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 10,
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      // console.log(res.list)
      if (res.error == 0) {
        that.setData({
          shop: res.list
        })
        that.getInfo()
      } else {
        that.modal.showToast(res.message, 'none')
      }
    })
  },

  //知识推荐
  getInfo: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 10,
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数；', data)
    http.sendRequest('huishou.knowledge', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          info: res.list
        })
      } else {
        that.modal.showToast(res.message, 'none')
      }
    })
  },


  onReady: function () {

  },


  onShow: function () {

  },


  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    lunbo: [],
    // 经营类目：
    nav_list: [],
    price: '0.00',
    shop: [],
    info: [],
    login: false
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
    http.sendRequest('huishou.luobo', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          lunbo: res.list
        })
        that.getKind()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //经营类目
  getKind: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 10
    }
    console.log('参数：', data)
    http.sendRequest('huishou.jingying', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          nav_list: res.list
        })
        that.getPice()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //金价
  getPice: function () {
    let that = this
    http.sendRequest('huishou.getipricej', 'post', {}).then(function (res) {
      if (res.error == 0) {
        that.setData({
          price: res.list.price
        })
        that.getShop()
      } else {
        modal.showToast(res.message, 'none')
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
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          shop: res.list
        })
        that.getInfo()
      } else {
        modal.showToast(res.message, 'none')
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
    http.sendRequest('huishou.knowledge', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          info: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 附近门店
  toShop: function (e) {
    let openid = wx.getStorageSync('openid')
    if (openid) {
      modal.navigate('/pages_one/nearby/nearby?id=', e.currentTarget.dataset.id)
    } else {
      this.setData({
        login: true
      })
    }

  },

  // 免费估价
  toAssess: function () {
    modal.navigate('/pages_one/assess/assess')
  },

  // 知识推荐 - 更多
  toInfo: function () {
    wx.switchTab({
      url: '/pages/infos/infos',
    })
  },

  //门店详情
  toDetail: function (e) {
    modal.navigate('/pages_one/shop_detail/shop_detail?id=', e.currentTarget.dataset.id)
  },

  //知识详情
  toInfoDetail: function (e) {
    let id = e.currentTarget.dataset.id
    modal.navigate('/pages_one/infos_detail/infos_detail?id=', id)
  },

  //登录
  getAddGrug: function (e) {
    this.setData({
      login: e.detail.login
    })
    // let openid = wx.getStorageSync('openid') | ''
    // this.setData({
    //   openid: openid
    // })
  }

})
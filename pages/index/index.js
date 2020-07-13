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
        text: '上门回收'
      },
      {
        icon: '../../icon/home-2.png',
        text: '门店回收'
      },
      {
        icon: '../../icon/home-3.png',
        text: '以旧换新'
      },
      {
        icon: '../../icon/home-4.png',
        text: '饰品修复'
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
    http.sendRequest('huishou.luobo', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          lunbo: res.list
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
  toShop: function () {
    modal.navigate('/pages_one/nearby/nearby')
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
  }

})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

// 地图组件
var QQMapWX = require('../../qqmap-wx-jssdk.min.js')
var demo;

Page({

  data: {

    city: '定位',

    lunbo: [], //轮播

    nav_list: [],// 经营类目

    price: '0.00',

    shop: [],

    info: [],

    login: false
  },

  onLoad: function (options) {
    this.getMapKey()
  },

  //基础设置
  getMapKey: async function () {
    let that = this
    await http.sendRequest('huishou.set', 'post', {}, '1').then(function (res) {
      if (res.error == 0) {
        demo = new QQMapWX({
          key: res.list.baidumiyao
        });
        app.globalData.map_Key = res.list.baidumiyao
        app.globalData.app_name = res.list.uniacidname
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onShow: function () {
    let city = wx.getStorageSync('city')
    if (city) {
      this.setData({
        city: city
      })
      this.getLun()
    } else {
      this.getLocation()
    }
  },

  //定位
  getLocation: function () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: 'true',
      success: function (res) {
        let lat = res.latitude
        let lon = res.longitude
        demo.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lon
          },
          success: function (res) {
            console.log(res)
            that.setData({
              city: res.result.address_component.city
            })
            wx.setStorageSync('lat', lat)
            wx.setStorageSync('lon', lon)
            wx.setStorageSync('city', res.result.address_component.city)
          },
          fail: function (error) {
            console.log(error);
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '获取定位失败，请检查手机是否开启定位功能,或检查小程序设置,确认是否授权定位',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
              })
            }
          }
        })
      }
    })
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
    http.sendRequest('huishou.luobo', 'post', data, '1').then(function (res) {
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
    http.sendRequest('huishou.jingying', 'post', data, '1').then(function (res) {
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
    http.sendRequest('huishou.getipricej', 'post', {}, '1').then(function (res) {
      if (res.error == 0) {
        that.setData({
          price: res.list.price
        })
        app.globalData.gold_price = res.list.price
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
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lon'),
      city: wx.getStorageSync('city')
    }
    http.sendRequest('huishou.shoplist', 'post', data, '1').then(function (res) {
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
      is_tuijin: 1
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

  // 定位
  toLocation: function () {
    modal.navigate('/pages/choice_city/choice_city')
  },

  // 附近门店
  toShop: function (e) {
    modal.navigate('/pages_one/nearby/nearby?id=', e.currentTarget.dataset.id)
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
  },

  // 轮播跳转
  toLink: function (e) {
    console.log(e.currentTarget.dataset.item)
    let type = e.currentTarget.dataset.item.urltype
    if (type == 0) {
      console.log('无连接')
    } else if (type == 1) {
      console.log('文章')
      let id = e.currentTarget.dataset.item.wid
      modal.navigate('/pages_one/infos_detail/infos_detail?id=', id)
    } else if (type == 2) {
      console.log('小程序链接')
      let url = e.currentTarget.dataset.item.url
      console.log('链接：', url)
      modal.navigate('/' + url)
    }
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
    this.getMapKey()
    this.getLocation()
  }

})
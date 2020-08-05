const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

// 地图组件
var QQMapWX = require('../../qqmap-wx-jssdk.min.js')
var demo;
Page({

  data: {
    city: '城市定位',
    id: '',
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })

    console.log('密钥：', app.globalData.map_Key)
    demo = new QQMapWX({
      key: app.globalData.map_Key
    });




    let city = wx.getStorageSync('city') || ''
    if (!city) {
      this.getLocation()
    }
  },

  //定位
  getLocation: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        let lat = res.latitude
        let lon = res.longitude
        wx.setStorageSync('lat', lat)
        wx.setStorageSync('lon', lon)
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
  },

  onShow: function () {
    let city = wx.getStorageSync('city') || ''
    console.log(city)
    if (city) {
      this.setData({
        city: city,
        page: 1
      })
      this.getList()
    }
  },

  //门店列表
  getList: function () {
    let that = this
    let data = {
      page: that.data.page,
      pagesize: 15,
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lon'),
      managementid: that.data.id || '',
      city: wx.getStorageSync('city'),
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.get_distance(res.list)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 计算距离
  get_distance: async function (list) {
    let that = this
    let from = {
      latitude: wx.getStorageSync('lat'),
      longitude: wx.getStorageSync('lon')
    }

    let old = that.data.list
    for (let i = 0; i < list.length; i++) {
      let to = {
        latitude: list[i].lat,
        longitude: list[i].lng
      }

      //计算距离
      wx.showLoading({
        title: '加载中~',
        mask: true
      })
      await demo.calculateDistance({
        mode: 'straight',
        from: from,
        to: [to],
        success: function (e) {
          console.log(e)
          list[i].distance = ((e.result.elements[0].distance) / 1000).toFixed(2)
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }

    that.setData({
      list: list
    })
    wx.hideLoading()
  },

  //门店详情
  toDetail: function (e) {
    modal.navigate('/pages_one/shop_detail/shop_detail?id=', e.currentTarget.dataset.id)
  },

  // 选择城市
  toChoice: function () {
    modal.navigate('/pages/choice_city/choice_city?city=', wx.getStorageSync('city'))
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
    let that = this
    let page = that.data.page
    let old = that.data.list
    console.log('到底')
    let data = {
      page: page + 1,
      pagesize: 15,
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lon'),
      managementid: that.data.id || '',
      city: wx.getStorageSync('city'),
      openid: wx.getStorageSync('openid')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        let news = res.list
        if (news.length != 0) {
          let list = old.concat(news)
          that.setData({
            list: list,
            page: data.page
          })
          that.get_distance(list)
        } else {
          modal.showToast('已经到底了哦', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }

})
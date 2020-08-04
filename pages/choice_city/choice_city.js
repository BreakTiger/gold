const city = require('../../libs/city.js');
import modal from '../../modals.js'

// 地图组件
var QQMapWX = require('../../qqmap-wx-jssdk.min.js')
var demo = new QQMapWX({
  key: 'UFTBZ-W4UW6-UNPSV-EMHL3-24UFQ-SCFKR' //临时
});

Page({

  data: {

    // 当前城市：
    city: '定位失败，重新获取',
    lat: '',
    lon: '',

    scrollTopId: '', //定位锚点

    cityData: [], //所有城市列表

    hotCityData: [], // 热门城市列表

    searchList: [], //搜索列表

    historyList: [], //搜索历史列表

    _py: ["hot", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"], //首字母

    showSearch: false,
  },

  onLoad: function (options) {
    // 绑定所有城市数据 + 热门城市
    this.setData({
      cityData: city.all,
      hotCityData: city.hot
    });
  },

  onShow: function () {
    //定位当前城市
    this.getLocations()
  },

  // 定位当前所在城市
  getLocations: function () {
    let that = this
    wx.getLocation({
      success: function (res) {
        // console.log(res)
        let lat = res.latitude
        let lon = res.longitude
        demo.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lon
          },
          success: function (res) {
            let city = res.result.address_component.city
            that.setData({
              city: city,
              lat: lat,
              lon: lon
            })
          },
          fail: function (error) {
            console.log(error);
          }
        })
      },
      fail: function (error) {
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

  // 搜索
  input: function (e) {
    let that = this
    let list = this.data.cityData
    let arr = Object.values(list) // ES7语法  对象转数组
    let a
    for (var i = 0; i < arr.length; i++) {
      if (i == 0) {
        a = arr[i]
      } else {
        a = a.concat(arr[i])
      }
    }
    const b = a.filter((res) => {
      if (res.fullname.search(e.detail.value) != -1) {
        return res
      }
    })
    console.log('搜索结果', b)
    that.setData({
      searchList: b
    })
    console.log(e.detail.value)
    if (e.detail.value) {
      that.setData({
        showSearch: true
      })
    }
  },

  // 当前城市 - 手动定位
  getLocation: function () {
    let that = this
    let city = that.data.city
    if (city != '定位失败，重新获取') {
      wx.setStorageSync('city', city)
      wx.setStorageSync('lat', that.data.lat)
      wx.setStorageSync('lon', that.data.lon)
      wx.navigateBack({
        delta: 0,
      })
    } else {
      console.log('重新定位')
    }
  },

  // 选择城市
  selectCity: function (e) {
    let that = this
    let detail = e.currentTarget.dataset
    // 更新缓存
    wx.setStorageSync('lat', detail.lat) //经度
    wx.setStorageSync('lon', detail.lng) //纬度
    wx.setStorageSync('city', detail.fullname) //城市名
    wx.navigateBack({
      delta: 0,
    })
  },

  //首字母
  getPy: function (e) {
    this.setData({
      showPy: e.target.id,
    })
  },

  setPy: function (e) {
    this.setData({
      scrollTopId: this.data.showPy
    })
  }

})
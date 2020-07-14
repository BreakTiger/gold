const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    // 回收门店
    shop_list: [], //预约门店
    shop: '请选择预约门店',

    //回收时间
    time_one: '预约回收日期',
    time_two: '预约回收时间',

    // 业务
    business_list: [],//预约业务

    // 姓名
    name: '',

    // 电话
    phone: '',

  },

  onLoad: function (options) {
    this.getShop()
  },

  // 预约门店
  getShop: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 50,
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lng')
    }
    console.log('参数：', data)
    http.sendRequest('huishou.shoplist', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          shop_list: res.list
        })
        that.getBusiness()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //预约业务
  getBusiness: function () {
    let that = this
    let data = {
      page: 1,
      pagesize: 50,
      type: 2
    }
    http.sendRequest('huishou.jingying', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          business_list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },




  //姓名
  getName: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },

  //电话
  getPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },


  // 提交
  toSend: function () {

  },




})
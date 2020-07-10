const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    price: '',
    type_list: [],
    gram: '',//克重
    phone: '' //电话
  },


  onLoad: function (options) {
    this.getPrice()
  },

  //实时金价
  getPrice: function () {
    let that = this
    http.sendRequest('huishou.getipricej', 'post', {}).then(function (res) {
      // console.log(res.list.price)
      if (res.error == 0) {
        that.setData({
          price: res.list.price
        })
        that.getType()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //黄金类型
  getType: function () {
    let that = this
    http.sendRequest('huishou.huangjintype', 'post', {}).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        let list = res.list
        list.forEach(function (item) {
          item.choice = 0
        })
        that.setData({
          type_list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 克重
  getGram: function (e) {
    console.log(e.detail.value)
    this.setData({
      gram: e.detail.value
    })
  },

  // 手机号
  getPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },

  //立即回收
  toRecyc: function () {
    let that = this
    console.log(that.gram)
    console.log(that.phone)
    // if (!that.gram) {
    //   modal.showToast('请输入黄金克重', 'none')
    // } else if (!that.phone) {
    //   modal.showToast('请输入手机号码', 'none')
    // } else {
    //   let data = {
    //     type: that.choice_type,
    //     gram: that.gram,
    //     mobile: that.phone,
    //     openid: wx.getStorageSync('openid')
    //   }
    //   console.log('参数：', data)
    // }

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
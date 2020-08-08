const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    status: 2, //类型 1 店铺 2 个人
    user_status: {}, //个人申请入驻状态
    step: 0,
    content: '',
    code: ''
  },


  onLoad: function (options) {
    this.getType()
  },

  onShow: function () {
    this.wxlogin()
  },

  wxlogin: function () {
    const that = this
    wx.login({
      success: function (res) {
        console.log('code:', res.code)
        that.setData({
          code: res.code
        })
      }
    })
  },

  // 入驻状态
  getType: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    // console.log('参数：', data)
    http.sendRequest('huishou.getshenhe', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        that.setData({
          user_status: res.list.user_status,
          content: res.list.user_status.error_centent
        })

        if (res.list.user_status.status) {
          that.setData({
            step: 2
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 申请
  getApply: function (e) {
    this.setData({
      step: e.detail.step
    })
    if (e.detail.step == 2) {
      this.getType()
    }
  },

  // 再次申请
  getAgain: function (e) {
    console.log(e.detail)
    this.setData({
      step: e.detail.step,
      user_status: e.detail.user_status
    })
  },

  // 一键获取手机号
  getsPhone: function (e) {
    this.wxlogin()
  }


})
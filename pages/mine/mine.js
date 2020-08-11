const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {

    openid: '',

    user: {}, //用户信息

    login: false //登录窗状态
  },

  onShow: function () {
    let openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    if (!openid) { //未登录
      this.setData({
        login: true
      })
    } else { //已经登录
      this.getUser()
    }
  },


  //用户信息
  getUser: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid')
    }
    http.sendRequest('huishou.getusermember', 'post', data).then(function (res) {
      if (res.error == 0) {


        that.setData({
          user: res.list
        })

      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //上门回收
  enter_one: function (e) {
    if (this.data.openid) {
      let type = e.currentTarget.dataset.type || ''
      modal.navigate('/pages_one/order-list/order-list?type=', type)
    } else {
      this.setData({
        login: true
      })
    }
  },

  //门店预约
  enter_two: function (e) {
    if (this.data.openid) {
      let type = e.currentTarget.dataset.type || ''
      modal.navigate('/pages_one/recyc_order_list/recyc_order_list?type=', type)
    } else {
      this.setData({
        login: true
      })
    }
  },

  // 店铺入驻
  toApplyOne: function () {
    if (this.data.openid) {
      modal.navigate('/pages_two/apply_one/apply_one')
    } else {
      this.setData({
        login: true
      })
    }
  },

  // 个人入驻
  toApplyTwo: function () {
    if (this.data.openid) {
      modal.navigate('/pages_two/apply_two/apply_two')
    } else {
      this.setData({
        login: true
      })
    }
  },

  //店铺工作台
  space_one: function () {
    modal.navigate('/pages_two/workspace_one/workspace_one?id=', this.data.user.shopid)
  },

  //个人工作台
  space_two: function () {
    modal.navigate('/pages_two/workspace_two/workspace_two?id=', this.data.user.practitionersid)
  },

  //登录窗
  logined: function () {
    this.setData({
      login: true
    })
  },

  //登录
  getAddGrug: function (e) {
    this.setData({
      login: e.detail.login
    })
    let openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    if (openid) {
      this.getUser()
    }
  }

})
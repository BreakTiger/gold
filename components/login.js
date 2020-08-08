const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

Component({

  options: {
    addGlobalClass: true
  },

  properties: {
    shopid: String,
    uid: String
  },

  data: {
    openid: ''
  },

  created: function () {
    wx.login({
      success: function (res) {
        console.log(res)
      }
    })
  },

  methods: {

    // 取消
    cencal: function () {
      this.triggerEvent('addDrug', { login: false })
    },

    //用户信息 - 获取key
    wxGetUserInfo: function (e) {
      console.log(e)
      let that = this
      let detail = e.detail
      wx.login({
        success: res => {
          let data = {
            code: res.code
          }
          http.sendRequest('wxapp.login', 'post', data).then(function (res) {
            if (res.error == 0) {
              let session_key = res.session_key
              wx.setStorageSync('session_key', session_key)
              let openid = 'sns_wa_' + res.openid
              that.setData({
                openid: openid
              })
              that.getUser(detail)
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      })
    },

    //授权
    getUser: function (detail) {
      let that = this
      let data = {
        data: detail.rawData,
        iv: detail.iv,
        encryptedData: detail.encryptedData,
        sessionKey: wx.getStorageSync('session_key')
      }
      http.sendRequest('wxapp.auth', 'post', data).then(function (res) {
        if (res.error == 0) {
          wx.setStorageSync('openid', that.data.openid)
          if (that.properties.uid) {
            that.bind_user()
          } else if (that.properties.shopid) {
            that.bind_shop()
          }
          //授权成功关闭 弹窗
          that.triggerEvent('addDrug', { login: false })

        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //绑定用户
    bind_user: function () {
      let that = this
      let data = {
        uid: that.properties.uid,
        openid: wx.getStorageSync('openid')
      }
      console.log('参数：', data)
      http.sendRequest('huishou.binuser', 'post', data).then(function (res) {
        console.log(res)
        if (res.error == 0) {

        } else {
          modal.showToast(res.message, 'none')
        }
      })
    },

    //绑定店铺
    bind_shop: function () {
      let that = this
      let data = {
        shopid: that.properties.shopid,
        openid: wx.getStorageSync('openid')
      }
      http.sendRequest('huishou.binshop', 'post', data).then(function (res) {
        console.log(res)
        if (res.error == 0) {

        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }
})

const app = getApp()
const http = require('../request.js')
import modal from '../modals.js'

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

  },

  data: {
    openid: ''
  },

  methods: {
    
    // 取消
    cencal: function () {
      this.triggerEvent('addDrug', { login: false })
    },

    //用户信息 - 获取key
    wxGetUserInfo: function (e) {
      let that = this
      let detail = e.detail
      let data = {
        code: wx.getStorageSync('code')
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
          that.triggerEvent('addDrug', { login: false})
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }
})

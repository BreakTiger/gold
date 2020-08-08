const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    price: '',

    type_list: [],
    type_choice: '', //类型ID

    types_list: [],
    types_choice: '', //属性ID

    bi_text: '', //比例

    feimoney: '',

    gram: '',//克重
    phone: '', //电话

    login: false
  },

  onLoad: function (options) {
    this.getPrice()
    this.getType()
  },

  //实时金价
  getPrice: async function () {
    let that = this
    let data = {
      type: that.data.type_choice,
      shuxing: that.data.types_choice
    }
    await http.sendRequest('huishou.getipricej', 'post', data).then(function (res) {
      if (res.error == 0) {
        that.setData({
          price: res.list.price
        })
        app.globalData.gold_price = res.list.price
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //黄金类型
  getType: function () {
    let that = this
    http.sendRequest('huishou.huangjintype', 'post', {}).then(function (res) {
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

  //选择类型
  toChoice: function (e) {
    let that = this
    let list = that.data.type_list
    let indexs = e.currentTarget.dataset.index
    list.forEach(function (item, index) {
      if (indexs == index) {
        item.choice = 1
        that.setData({
          type_choice: item.id,
          types_choice: '',
          bi_text: ''
        })
        that.getNature()
      } else {
        item.choice = 0
      }
    })
    that.setData({
      type_list: list
    })
  },

  // 获取类型属性
  getNature: function () {
    let that = this
    let data = {
      type_id: that.data.type_choice
    }
    http.sendRequest('huishou.jintype', 'post', data).then(function (res) {
      if (res.error == 0) {
        let list = res.list
        list.forEach(function (item) {
          item.choice = 0
          that.setData({
            feimoney: item.feimoney
          })
        })
        that.setData({
          types_list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //选择类型属性
  choice_Nature: function (e) {
    let that = this
    let list = that.data.types_list
    let indexs = e.currentTarget.dataset.index
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          types_choice: item.id,
          bi_text: item.content
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      types_list: list
    })
    that.getPrice()
  },

  // 克重
  getGram: function (e) {
    this.setData({
      gram: e.detail.value
    })
  },

  // 手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //立即回收
  toRecyc: function () {
    let that = this
    let openid = wx.getStorageSync('openid') || ''
    if (openid) {
      let list = that.data.types_list
      let gram = that.data.gram
      let phone = that.data.phone
      if (!that.data.type_choice && list.length == 0) {
        modal.showToast('请选择黄金类型', 'none')
      } else if (!that.data.types_choice && list.length != 0) {
        modal.showToast('请选择所选黄金类型的种类', 'none')
      } else if (!gram) {
        modal.showToast('请输入黄金克重', 'none')
      } else if (!phone) {
        modal.showToast('请输入手机号码', 'none')
      } else if (!(/^1[3456789]\d{9}$/.test(phone))) {
        modal.showToast('请输入如合法的手机号码', 'none')
      } else {
        let data = {
          type: that.data.type_choice, //类型
          shuxing: that.data.types_choice, //属性
          gram: gram,
          mobile: phone,
          price: that.data.price,
          openid: wx.getStorageSync('openid')
        }
        console.log('data：', data)
        http.sendRequest('huishou.sbpinggu', 'post', data).then(function (res) {
          console.log(res.list)
          console.log(that.data.feimoney)
          if (res.error == 0) {
            modal.navigate('/pages_one/assess_success/assess_success?data=', JSON.stringify(res.list) + '&feimoney=' + that.data.feimoney)
          } else {
            modal.showToast(res.message, 'none')
          }
        })
      }
    } else {
      this.setData({
        login: true
      })
    }
  },

  //登录
  getAddGrug: function (e) {
    this.setData({
      login: e.detail.login
    })
  }

})
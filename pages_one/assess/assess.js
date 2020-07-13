const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    price: '',
    type_list: [],
    type_choice: '',

    types_list: [],
    types_chopice: '',

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
        // console.log(item)
        that.setData({
          type_choice: item.id
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
    // console.log('参数：', data)
    http.sendRequest('huishou.jintype', 'post', data).then(function (res) {
      // console.log(res.list)
      if (res.error == 0) {
        let list = res.list
        list.forEach(function (item) {
          item.choice = 0
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
    console.log(list)
    list.forEach(function (item, index) {
      if (index == indexs) {
        console.log(item)
        item.choice = 1
        that.setData({
          types_chopice: item.id
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      types_list: list
    })
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
    let list = that.data.types_list
    let gram = that.data.gram
    let phone = that.data.phone
    if (!that.data.type_choice || !that.data.types_chopice) {
      modal.showToast('请选择你的黄金类型，及属性', 'none')
    } else if (!gram) {
      modal.showToast('请输入黄金克重', 'none')
    } else if (!phone) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(phone))) {
      modal.showToast('请输入如合法的手机号码', 'none')
    } else {
      let data = {}
      if (list.length != 0) {
        console.log('存在类型')
        if (that.data.types_chopice) {
          data = {
            type: that.data.types_chopice,
            gram: gram,
            mobile: phone,
            openid: wx.getStorageSync('openid')
          }
        } else {
          modal.showToast('请选择黄金类型的属性')
        }
      } else {
        data = {
          type: that.data.type_choice,
          gram: gram,
          mobile: phone,
          openid: wx.getStorageSync('openid')
        }
      }
      console.log('参数：', data)
      http.sendRequest('huishou.sbpinggu', 'post', data).then(function (res) {
        // console.log(res)
        if (res.error == 0) {
          let data = {
            count_price: res.list.countprice,
            price: res.list.price
          }
          modal.navigate('/pages_one/assess_success/assess_success?data=', JSON.stringify(data))
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }
})
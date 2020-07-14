const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'
const WxParse = require('../../wxParse/wxParse.js')

Page({


  data: {
    price: '',
    type_list: [],
    type_choice: '', //选择的黄金类型,
    types_list: [],
    types_choice: '', //选择的黄金类型的属性

    gram: '',
    money: '',
    phone: '',

    kind: [
      {
        name: '到店回收',
        type: 1
      },
      {
        name: '上门回收',
        type: 2
      }
    ],
    choice: null, //服务方式

    shadows: false,
    agree: 0
  },

  onLoad: function (options) {
    this.getPrice()
  },

  //实时金价
  getPrice: function () {
    let that = this
    http.sendRequest('huishou.getipricej', 'post', {}).then(function (res) {
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
      // console.log(res.list)
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
          types_chopice: ''
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

  //获取黄金属性
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
        })
        that.setData({
          types_list: list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //选择类型
  choiceType: function (e) {
    let that = this
    let list = that.data.types_list
    let indexs = e.currentTarget.dataset.index
    list.forEach(function (item, index) {
      if (index == indexs) {
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

  //黄金克重
  getGram: function (e) {
    this.setData({
      gram: e.detail.value
    })
  },

  //金额
  getMoney: function (e) {
    this.setData({
      money: e.detail.value
    })
  },

  //手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //选择服务类型
  getTypes: function (e) {
    this.setData({
      choice: e.currentTarget.dataset.type
    })
  },

  //规则
  getRule: function () {
    let that = this
    let list = that.data.types_list
    let gram = that.data.gram
    let money = that.data.money
    let phone = that.data.phone
    if (!that.data.type_choice && list.length == 0) {
      modal.showToast('请选择黄金类型', 'none')
    } else if (!that.data.types_chopice && list.length != 0) {
      modal.showToast('请选择所选黄金类型的种类', 'none')
    } else if (!gram) {
      modal.showToast('请输入黄金克重', 'none')
    } else if (!money) {
      modal.showToast('请设置预估金额', 'none')
    } else if (!phone) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(phone))) {
      modal.showToast('请输入如合法的手机号码', 'none')
    } else if (!that.data.choice) {
      modal.showToast('请选择服务类型', 'none')
    } else {
      http.sendRequest('huishou.set', 'post', {}).then(function (res) {
        console.log(res.list)
        if (res.error == 0) {
          that.setData({
            shadows: true
          })
          // 富文本解析
          let article = res.list.huixie
          WxParse.wxParse('article', 'html', article, that, 5);

        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  },

  // 同意协议
  agrees: function () {
    this.setData({
      agree: 1
    })
  },

  // 同意
  toAgrees: function () {
    let that = this
    let type = that.data.agree
    if (type == 1) {
      // 判断，服务方式，选择跳转页面
      let way = that.data.choice
      if (way == 1) {
        modal.navigate('/pages_one/shop_order/shop_order')
      } else {
        modal.navigate('/pages_one/set_order/set_order')
      }
    } else {
      modal.showToast('请先阅读，并同意《黄金回收服务协议》', 'none')
    }
  }





})
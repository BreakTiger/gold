const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'
const WxParse = require('../../wxParse/wxParse.js')

Page({

  data: {
    code: '',

    price: '',

    type_list: [],
    type_choice: '', //选择的黄金类型ID,
    type_text: '',

    types_list: [],
    types_choice: '', //选择的黄金类型的属性ID
    types_text: '',

    gram: '',
    money: '0.00',
    phone: '',

    fu_moeny: '',

    fu_text: '',

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
    agree: 0,

    shad: false,

    login: false
  },

  onLoad: function (options) {
    this.getPrice()
    this.fuwu()
  },

  fuwu: function () {
    let that = this
    http.sendRequest('huishou.set', 'post', {}).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          fu_moeny: res.list.shouxufei,
          fu_text: res.list.fuwutext
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  onShow: function () {
    let that = this
    that.wxlogin()

    let data = app.globalData.putInfo || {}
    console.log(data)
    if (Object.keys(data).length != 0) {
      //先绑定 克重 预估金额 手机号 选择的类型
      this.setData({
        gram: data.ke,
        money: data.countprice,
        phone: data.mobile,
        choice: data.status
      })
    }
  },


  wxlogin: function () {
    const that = this
    wx.login({
      success: function (res) {
        console.log(res.code)
        that.setData({
          code: res.code
        })
      }
    })
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
      if (res.error == 0) {
        let list = res.list
        // console.log(list)
        list.forEach(function (item) {
          item.choice = 0
          // 判断
          let data = app.globalData.putInfo
          // console.log(data)
          if (data.type == item.id) {
            item.choice = 1
            that.setData({
              type_choice: item.id,
              type_text: item.name
            })
            that.getNature()
          }
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
          type_text: item.name,
          types_choice: ''
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
        // console.log(list)
        list.forEach(function (item) {
          item.choice = 0
          // 判断
          let data = app.globalData.putInfo
          // console.log(data)
          if (data.shuxing == item.id) {
            item.choice = 1
            that.setData({
              types_choice: item.id,
              types_text: item.name
            })
          }
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
          types_choice: item.id,
          types_text: item.name
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
    let that = this
    let price = that.data.price
    let gram = e.detail.value
    let data = {
      huishou_gram: gram,
      price: price
    }
    console.log('参数：', data)
    http.sendRequest('huishou.getprice', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          gram: e.detail.value,
          money: res.countprice,
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  setPhone: function (e) {
    let that = this
    let data = {
      data: e.detail.encryptedData,
      code: that.data.code,
      iv: e.detail.iv
    }
    console.log('参数：', data)
    http.sendRequest('wxapp.getWechatUserPhone', 'post', data).then(function (res) {
      console.log(res)
      if (res.error == 0) {
        that.setData({
          phone: res.data.phoneNumber
        })
        that.wxlogin();
      } else {
        modal.showToast(res.message, 'none')
      }
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
    let openid = wx.getStorageSync('openid')
    if (openid) {
      let list = that.data.types_list
      let gram = that.data.gram
      let money = that.data.money
      let phone = that.data.phone
      if (!that.data.type_choice && list.length == 0) {
        modal.showToast('请选择黄金类型', 'none')
      } else if (!that.data.types_choice && list.length != 0) {
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
    } else {
      this.setData({
        login: true
      })
    }
  },

  // 同意协议
  is_agrees: function () {
    let type = this.data.agree
    if (type == 0) {
      this.setData({
        agree: 1
      })
    } else {
      this.setData({
        agree: 0
      })
    }

  },

  // 同意
  toAgrees: function () {
    let that = this
    let type = that.data.agree
    if (type == 1) {
      // 判断，服务方式，选择跳转页面
      let way = that.data.choice
      if (way == 1) {
        let data = {
          phone: that.data.phone
        }
        modal.navigate('/pages_one/shop_order/shop_order?data=', JSON.stringify(data))
      } else {
        let data = {
          type: that.data.type_text,
          types: that.data.types_text,
          id_one: that.data.type_choice,
          id_two: that.data.types_choice,
          price: that.data.price,
          count_price: that.data.money,
          gram: that.data.gram,
          phone: that.data.phone,
          fu_moeny: that.data.fu_moeny * that.data.gram
        }
        // console.log(data)
        modal.navigate('/pages_one/set_order/set_order?data=', JSON.stringify(data))
      }
    } else {
      modal.showToast('请先阅读，并同意《黄金回收服务协议》', 'none')
    }
  },

  // 关闭协议窗口
  close: function () {
    this.setData({
      shadows: false,
      agree: 0
    })
  },

  //登录
  getAddGrug: function (e) {
    this.setData({
      login: e.detail.login
    })
  },

  // 离开页面
  onHide: function () {
    this.setData({
      shadows: false,
      agree: 0,
      gram: '',
      money: '0.00',
      phone: ''
    })
  },

  toRule: function () {
    this.setData({
      shad: true
    })
  },

  toClose: function () {
    this.setData({
      shad: false
    })
  }

})
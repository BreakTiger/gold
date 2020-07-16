const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    // 回收门店
    shop_list: [], //预约门店
    shop: '请选择预约门店',
    shop_id: '',


    //回收时间
    time_one: '预约回收日期',
    time_two: '预约回收时间',

    // 业务
    business_list: [],//预约业务
    business: '预约业务',
    business_id: '',

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
      // console.log(res.list)
      if (res.error == 0) {
        that.setData({
          business_list: res.list
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择门店
  choice_shop: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.shop_list
    that.setData({
      shop: list[index].shopname,
      shop_id: list[index].id
    })
  },

  // 日期
  getData: function (e) {
    this.setData({
      time_one: e.detail.value
    })
  },

  // 时间
  getTime: function (e) {
    this.setData({
      time_two: e.detail.value
    })
  },

  //业务
  set_business: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.business_list
    that.setData({
      business: list[index].name,
      business_id: list[index].id
    })
  },

  //姓名
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //电话
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },


  // 提交
  toSend: function () {
    console.log(111)
    let that = this
    if (!that.data.shop_id) {
      modal.showToast('请选择预约门店', 'none', 'none')
    } else if (that.data.time_one == '预约回收日期') {
      modal.showToast('请选择回收日期', 'none')
    } else if (that.data.time_two == '预约回收时间') {
      modal.showToast('请选择回收时间', 'none')
    } else if (!that.data.business_id) {
      modal.showToast('请选择预约业务', 'none')
    } else if (!that.data.name) {
      modal.showToast('请输入您的姓名', 'none')
    } else if (!that.data.phone) {
      modal.showToast('请输入您的手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
      modal.showToast('请输入合法的手机号码', 'none')
    } else {
      let data = {
        store_id: that.data.shop_id,
        yuyuetime: that.data.time_one + ' ' + that.data.time_two,
        mobile: that.data.phone,
        username: that.data.name,
        jingyingtype: that.data.business_id,
        ordertype: 2,
        openid: wx.getStorageSync('openid')
      }
      console.log('参数：', data)
      http.sendRequest('huishou.addyuOrder', 'post', data).then(function (res) {
        console.log(res.list)
        if (res.error == 0) {
          modal.navigate('/pages_one/order_success/order_success?data=', JSON.stringify(res.list))
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  },




})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {

    id: '', //黄金属性ID

    price: '', //金价

    count_price: '', //金额

    gram: '', //克重

    picture_list: [], //图片

    p_list: [],

    date: '预约回收日期',

    time: '预约回收时间',

    name: '',

    phone: '13868367595',

    place: '请选择回收地址', //省 市 区

    province: '',

    city: '',

    area: '',

    street: ''
  },

  onLoad: function (options) {
    let datas = JSON.parse(options.data)
    // console.log(datas)
    this.setData({
      id: datas.id,
      price: datas.price,
      gram: datas.gram,
      count_price: datas.count_price
    })
  },

  //上传图片
  addPicture: function () {
    let that = this
    wx.chooseImage({
      count: 5,
      success: function (res) {
        let path = res.tempFilePaths
        that.setData({
          picture_list: path
        })
      }
    })
  },

  // 增加
  toAdd: function () {
    let that = this
    let old = that.data.picture_list
    wx.chooseImage({
      count: 5,
      success: function (res) {
        let path = res.tempFilePaths
        let news = old.concat(path)
        that.setData({
          picture_list: news.slice(0, 5)
        })
      }
    })
  },

  // 删除
  toDel: function (e) {
    let that = this
    let list = that.data.picture_list
    let index = e.currentTarget.dataset.index
    //切割
    list.splice(index, 1)
    that.setData({
      picture_list: list
    })
  },

  //预约回收日期
  getDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //预约回收时间
  getTime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //姓名
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //一键获取手机号
  getPhone: function (e) {
    console.log(e.detail)
  },

  //回收地址
  getCity: function (e) {
    let detail = e.detail.value
    let place = detail[0] + detail[1] + detail[2]
    this.setData({
      place: place,
      province: detail[0],
      city: detail[1],
      area: detail[2],
    })
  },

  //详细地址
  getAddress: function (e) {
    this.setData({
      street: e.detail.value
    })
  },

  // 提交
  send: function () {
    let that = this
    if (that.data.date == '预约回收日期') {
      modal.showToast('请选择预约回收的日期', 'none')
    } else if (that.data.time == '预约回收时间') {
      modal.showToast('请选择预约回收的时间', 'none')
    } else if (!that.data.name) {
      modal.showToast('请填写姓名', 'none')
    } else if (!that.data.phone) {
      modal.showToast('请输入手机号码', 'none')
    } else if (that.data.place == '请选择回收地址') {
      modal.showToast('请选择收货地址', 'none')
    } else if (!that.data.street) {
      modal.showToast('请填写您的详细地址', 'none')
    } else {
      // 判断是否存在图片
      if (that.data.picture_list.length != 0) { //存在图片
        console.log('存在')
        that.upImg(that.data.picture_list)
      } else {
        console.log('不存在')
        that.sent()
      }
    }
  },

  //上传图片
  upImg: function (list) {

  },

  //提交
  sent: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid'),
      huishou_type: 1,
      jin_type: that.data.id,
      huishou_gram: that.data.gram,
      yuyuetime: that.data.date + ' ' + that.data.time,
      mobile: that.data.phone,
      province: that.data.province,
      city: that.data.city,
      area: that.data.area,
      address: that.data.street,
      ordertype: '',
      images: that.data.p_list,
      price: that.data.price,
      yuguprice: that.data.count_price
    }
    console.log('参数：', data)
    http.sendRequest('huishou.addhuiOrder', 'post', data).then(function (res) {
      console.log(res.list)
      if (res.error == 0) {
        modal.navigate('/pages_one/order_success/order_success?data=', JSON.stringify(res.list))
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }




})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {

    code: '',

    id_one: '', //黄金属性ID

    id_two: '', //黄金属性ID

    text_one: '',

    text_two: '',

    price: '', //金价

    count_price: '', //金额

    bi_text: '',

    bili: '',

    gram: '', //克重

    fu_moeny: '',

    picture_list: [], //图片

    p_list: [],

    date: '请选择预约日期',

    time: '预约上门时间',

    name: '',

    phone: '',

    place: '请选择回收地址', //省 市 区

    province: '',

    city: '',

    area: '',

    street: '',

    now_time: '', //现在时间

    star_date: '', //开始日期

    end_date: '' //结束日期
  },

  onLoad: function (options) {
    //日期 - 设置
    let date = new Date()

    // 增加一天的基础上增加30天
    let date3 = new Date(date);
    date3.setDate(date.getDate() + 30);

    this.setData({
      now_time: date.getHours() + ':' + date.getMinutes(),
      star_date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      end_date: date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + date3.getDate(),
    })

    let datas = JSON.parse(options.data)
    console.log(datas)

    this.setData({
      id_one: datas.id_one,
      id_two: datas.id_two,
      text_one: datas.type,
      text_two: datas.types,
      price: datas.price,
      count_price: datas.count_price,
      gram: datas.gram,
      phone: datas.phone,
      fu_moeny: datas.fu_moeny,
      bi_text: datas.bili_text,
      bili: datas.bili,
    })
  },

  onShow: function () {
    let that = this
    that.wxlogin()
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

  // 增加图片
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
    if (that.data.date == '请选择预约日期') {
      modal.showToast('请选择预约回收的日期', 'none')
    } else if (that.data.time == '预约上门时间') {
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
        that.upImg(that.data.picture_list)
      } else {
        that.sent()
      }
    }
  },

  //上传图片
  upImg: async function (list) {
    let that = this
    let a = []
    for (let i = 0; i < list.length; i++) {
      await http.upLoading(list[i], { type: 1 }).then(function (res) {
        let result = JSON.parse(res)
        if (result.error == 0) {
          a.push(result.list.url)
        } else {
          modal.showToast(result.message, 'none')
        }
      })
    }
    // console.log('上传后：', a)
    that.setData({
      p_list: a
    })
    that.sent()
  },

  //提交
  sent: function () {
    let that = this
    let data = {
      openid: wx.getStorageSync('openid'),
      huishou_type: that.data.id_one || '',
      jin_type: that.data.id_two,
      huishou_gram: that.data.gram,
      yuyuetime: that.data.date + ' ' + that.data.time,
      mobile: that.data.phone,
      province: that.data.province,
      city: that.data.city,
      area: that.data.area,
      address: that.data.street,
      ordertype: 1,
      images: that.data.p_list,
      price: that.data.price,
      yuguprice: that.data.count_price,
      username: that.data.name,
      shouxufei: that.data.fu_moeny,
      huangjin_lv: that.data.bili
    }
    console.log('参数：', data)
    http.sendRequest('huishou.addhuiOrder', 'post', data).then(function (res) {
      if (res.error == 0) {
        modal.navigate('/pages_one/order_success/order_success?data=', JSON.stringify(res.list) + '&types=2')
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }

})
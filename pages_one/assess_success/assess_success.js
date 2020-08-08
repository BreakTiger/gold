const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'
const WxParse = require('../../wxParse/wxParse.js')

Page({

  data: {
    detail: {},
    all: '',
    fu_moeny: '',
    fu_text: '',
    shad: false,
    shadows: false,
    agree: 0,
    type: null
  },

  onLoad: function (options) {
    console.log(options)
    let data = JSON.parse(options.data)
    this.setData({
      detail: data,
      all: data.countprice,
      fu_moeny: options.feimoney
    })
    this.getRule()
  },

  //规则
  getRule: function () {
    let that = this
    http.sendRequest('huishou.set', 'post', {}).then(function (res) {
      if (res.error == 0) {
        that.setData({
          fu_text: res.list.fuwutext
        })
        // 富文本解析
        let article = res.list.huixie
        WxParse.wxParse('article', 'html', article, that, 5);
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  recyc: function (e) {
    this.setData({
      shadows: true,
      type: e.currentTarget.dataset.type
    })
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

  // 关闭协议窗口
  close: function () {
    this.setData({
      shadows: false,
      agree: 0,
      type: null
    })
  },

  // 同意
  toAgrees: function () {
    let that = this
    let agress = that.data.agree
    if (agress != 0) {
      let type = that.data.type
      if (type == 1) {
        let data = this.data.detail
        let datas = {
          type: data.type_name,
          types: data.shuxing_name,
          id_one: data.type,
          id_two: data.shuxing,
          price: data.price,
          count_price: data.countprice,
          gram: data.ke,
          phone: data.mobile,
          fu_moeny: data.ke * this.data.fu_moeny
        }
        console.log(datas)
        modal.navigate('/pages_one/set_order/set_order?data=', JSON.stringify(datas))
      } else {
        //储存到全局
        let data = this.data.detail
        data.status = 1
        app.globalData.putInfo = data
        modal.navigate('/pages_one/nearby/nearby')
      }
    } else {
      modal.showToast('您还未同意回收协议', 'none')
    }
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
  },

  onHide: function () {
    this.setData({
      shad: false,
      shadows: false,
      agree: 0,
      type: null
    })
  }

})
const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({

  data: {
    detail: {},
    all: '',
    fu_moeny: '',
    fu_text: '',
    shad: false
  },

  onLoad: function (options) {
    let data = JSON.parse(options.data)
    this.setData({
      detail: data,
      all: data.countprice
    })
    this.getRule()
  },

  getRule: function () {
    let that = this
    http.sendRequest('huishou.set', 'post', {}).then(function (res) {
      // console.log(res)
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

  // 上门回收 type:2
  recyc_one: function () {
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
  },

  // 到店回收
  recyc_two: function () {
    //储存到全局
    let data = this.data.detail
    data.status = 1
    app.globalData.putInfo = data
    modal.navigate('/pages_one/nearby/nearby')
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
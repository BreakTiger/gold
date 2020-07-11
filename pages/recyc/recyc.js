const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    price: '',
    type_list: [],
    types_list: [],
    type_choice: '', //选择的黄金类型,

    kind: [
      {
        name: '到店回收'
      },
      {
        name: '上门回收'
      }
    ],
    choice: 0

    
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
        console.log(item)
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


  getNature: function () {
    let that = this
    let data = {
      type_id: that.data.type_choice
    }
    console.log('参数：', data)
    http.sendRequest('huishou.jintype', 'post', data).then(function (res) {
      console.log(res.list)
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
    let index = e.currentTarget.dataset.index
  }



})
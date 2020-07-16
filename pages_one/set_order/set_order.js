const app = getApp()
const http = require('../../request.js')
import modal from '../../modals.js'

Page({


  data: {
    price: '', //金价
    count_price: '', //金额
    gram: '', //克重
    picture_list: [] //图片

  },

  onLoad: function (options) {
    let datas = JSON.parse(options.data)
    this.setData({
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
        console.log(res.tempFilePaths)
        let path = res.tempFilePaths
        that.setData({
          picture_list: path
        })
      }
    })
  },

  //姓名
  getName: function (e) {

  },

  //回收地址
  getCity: function (e) {

  },

  //详细地址
  getAddress: function (e) {

  },

  // 提交
  send: function () {

  },

  toDel:function(){
    console.log('删除')
  },



})